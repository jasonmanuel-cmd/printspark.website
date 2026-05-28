import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumber, getCustomerOrders } from "@/lib/db";
import { neon } from "@neondatabase/serverless";

// GET - Fetch order(s)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orderNumber = searchParams.get("orderNumber");
    const email = searchParams.get("email");

    if (orderNumber) {
      const order = await getOrderByNumber(orderNumber);

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ order });
    }

    if (email) {
      const orders = await getCustomerOrders(email);
      return NextResponse.json({ orders });
    }

    return NextResponse.json(
      { error: "Order number or email is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// PATCH - Update order status (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, trackingNumber, fulfillmentStatus, notes } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("Missing DATABASE_URL");
    const sql = neon(url);

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }

    if (fulfillmentStatus) {
      updateData.fulfillment_status = fulfillmentStatus;
    }

    if (notes) {
      updateData.notes = notes;
    }

    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const result = await sql.query(
      `UPDATE orders SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, orderId]
    );

    return NextResponse.json({ order: result[0] });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel order
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("Missing DATABASE_URL");
    const sql = neon(url);

    const orders = await sql.query(
      "SELECT status FROM orders WHERE id = $1",
      [orderId]
    );

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (["shipped", "delivered"].includes(orders[0].status)) {
      return NextResponse.json(
        { error: "Cannot cancel order that has been shipped" },
        { status: 400 }
      );
    }

    const result = await sql.query(
      "UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *",
      [orderId]
    );

    return NextResponse.json({ order: result[0] });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
