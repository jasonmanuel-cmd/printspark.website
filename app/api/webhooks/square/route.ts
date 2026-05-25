import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/square";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-square-hmacsha256-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Square signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    if (!signatureKey) {
      console.error("Missing SQUARE_WEBHOOK_SIGNATURE_KEY");
      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 }
      );
    }

    const isValid = verifyWebhookSignature(body, signature, signatureKey);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const supabase = getServerSupabase();

    // Handle different event types
    switch (event.type) {
      case "payment.created": {
        const payment = event.data.object.payment;
        const referenceId = payment.reference_id;

        if (!referenceId) break;
        console.log(\`Payment created for order \${referenceId}\`);
        break;
      }

      case "payment.updated": {
        const payment = event.data.object.payment;
        const referenceId = payment.reference_id;
        const status = payment.status;

        if (!referenceId) break;

        if (status === "COMPLETED") {
          await supabase
            .from("orders")
            .update({
              status: "paid",
              payment_status: "completed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", referenceId);

          console.log(\`Order \${referenceId} payment completed\`);
        } else if (status === "FAILED") {
          await supabase
            .from("orders")
            .update({
              status: "payment_failed",
              payment_status: "failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", referenceId);
        }
        break;
      }

      case "refund.created": {
        const refund = event.data.object.refund;
        const paymentId = refund.payment_id;

        const { data: order } = await supabase
          .from("orders")
          .select("id")
          .eq("payment_id", paymentId)
          .single();

        if (order) {
          await supabase
            .from("orders")
            .update({
              status: "refunded",
              payment_status: "refunded",
              notes: "Payment refunded",
              updated_at: new Date().toISOString(),
            })
            .eq("id", order.id);
        }
        break;
      }

      default:
        console.log(\`Unhandled Square webhook: \${event.type}\`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Square webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
