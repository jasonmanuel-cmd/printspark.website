import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/square";
import { neon } from "@neondatabase/serverless";

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

    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("Missing DATABASE_URL");
    const sql = neon(url);

    const event = JSON.parse(body);

    switch (event.type) {
      case "payment.created": {
        const payment = event.data.object.payment;
        const referenceId = payment.reference_id;

        if (!referenceId) break;
        console.log(`Payment created for order ${referenceId}`);
        break;
      }

      case "payment.updated": {
        const payment = event.data.object.payment;
        const referenceId = payment.reference_id;
        const status = payment.status;

        if (!referenceId) break;

        if (status === "COMPLETED") {
          await sql.query(
            "UPDATE orders SET status = $1, payment_status = $2, updated_at = NOW() WHERE id = $3",
            ["paid", "completed", referenceId]
          );
          console.log(`Order ${referenceId} payment completed`);
        } else if (status === "FAILED") {
          await sql.query(
            "UPDATE orders SET status = $1, payment_status = $2, updated_at = NOW() WHERE id = $3",
            ["payment_failed", "failed", referenceId]
          );
        }
        break;
      }

      case "refund.created": {
        const refund = event.data.object.refund;
        const paymentId = refund.payment_id;

        const orders = await sql.query(
          "SELECT id FROM orders WHERE payment_id = $1",
          [paymentId]
        );

        if (orders.length > 0) {
          await sql.query(
            "UPDATE orders SET status = $1, payment_status = $2, notes = $3, updated_at = NOW() WHERE id = $4",
            ["refunded", "refunded", "Payment refunded", orders[0].id]
          );
        }
        break;
      }

      default:
        console.log(`Unhandled Square webhook: ${event.type}`);
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
