import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { updateOrderStatus, getServerSupabase } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature and construct event
    const event = constructWebhookEvent(body, signature);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract order information from metadata
        const orderId = session.metadata?.orderId;
        const orderNumber = session.metadata?.orderNumber;

        if (!orderId) {
          console.error("No orderId in session metadata");
          break;
        }

        // Update order with payment information
        const supabase = getServerSupabase();
        await supabase
          .from("orders")
          .update({
            status: "design-review",
            payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        console.log(`Order ${orderNumber} payment completed`);

        // TODO: Send confirmation email to customer
        // TODO: Notify admin of new order

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment ${paymentIntent.id} succeeded`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`Payment ${paymentIntent.id} failed`);

        // Find and update order status
        const supabase = getServerSupabase();
        const { data: order } = await supabase
          .from("orders")
          .select("id")
          .eq("payment_intent_id", paymentIntent.id)
          .single();

        if (order) {
          await supabase
            .from("orders")
            .update({
              status: "cancelled",
              notes: "Payment failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", order.id);
        }

        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`Charge ${charge.id} refunded`);

        // Update order status to cancelled
        const supabase = getServerSupabase();
        const { data: order } = await supabase
          .from("orders")
          .select("id")
          .eq("payment_intent_id", charge.payment_intent as string)
          .single();

        if (order) {
          await supabase
            .from("orders")
            .update({
              status: "cancelled",
              notes: "Payment refunded",
              updated_at: new Date().toISOString(),
            })
            .eq("id", order.id);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
