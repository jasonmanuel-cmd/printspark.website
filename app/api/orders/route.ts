import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, getOrderByNumber, getCustomerOrders } from "@/lib/supabase";

// GET - Fetch order(s)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orderNumber = searchParams.get("orderNumber");
    const email = searchParams.get("email");

    if (orderNumber) {
      // Fetch single order by order number
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
      // Fetch all orders for a customer
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
    const { orderId, status, trackingNumber, notes } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }

    if (notes) {
      updateData.notes = notes;
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    // TODO: Send status update email to customer

    return NextResponse.json({ order });
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

    const supabase = getServerSupabase();

    // Check if order can be cancelled
    const { data: order } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .single();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (["shipped", "delivered"].includes(order.status)) {
      return NextResponse.json(
        { error: "Cannot cancel order that has been shipped" },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    const { data: cancelledOrder, error } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    // TODO: Process refund if payment was made
    // TODO: Send cancellation confirmation email

    return NextResponse.json({ order: cancelledOrder });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
