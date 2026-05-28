import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL");
  return neon(url);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const printfulOrderId = body?.data?.order?.id || body?.data?.id;
    const status = body?.data?.order?.status || body?.data?.status;
    const trackingNumber = body?.data?.order?.tracking_number;
    const externalId = body?.data?.order?.external_id;

    if (!printfulOrderId || !externalId) {
      return NextResponse.json({ received: true });
    }

    const sql = getDb();

    const dbStatus = mapPrintfulStatus(status);

    if (trackingNumber) {
      await sql.query(
        `UPDATE orders SET status = $1, tracking_number = $2, fulfillment_status = $3, updated_at = NOW() WHERE order_number = $4`,
        [dbStatus, trackingNumber, status, externalId]
      );
    } else {
      await sql.query(
        `UPDATE orders SET status = $1, fulfillment_status = $2, updated_at = NOW() WHERE order_number = $3`,
        [dbStatus, status, externalId]
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Printful webhook error:", error);
    return NextResponse.json({ received: true });
  }
}

function mapPrintfulStatus(pfStatus: string): string {
  const map: Record<string, string> = {
    draft: "pending",
    pending: "processing",
    fulfilled: "shipped",
    canceled: "cancelled",
    returned: "delivered",
  };
  return map[pfStatus] || "processing";
}
