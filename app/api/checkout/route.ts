import { NextRequest, NextResponse } from "next/server";
import { createPayment, createSquareOrder } from "@/lib/square";
import { createOrder, updateOrder } from "@/lib/supabase";
import { generateOrderNumber } from "@/lib/utils";
import { CartItem, ShippingAddress } from "@/lib/types";
import { PRODUCTS } from "@/lib/constants";
import { calculateItemPrice, calculateCartSubtotal, calculateShipping, calculateTax, calculateTotal } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      shippingAddress,
      shippingMethod,
      customerEmail,
      paymentToken, // Square payment token from Web SDK
    }: {
      items: CartItem[];
      shippingAddress: ShippingAddress;
      shippingMethod: "standard" | "express" | "overnight";
      customerEmail: string;
      paymentToken: string;
    } = body;

    // Validate input
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email is required" },
        { status: 400 }
      );
    }

    if (!paymentToken) {
      return NextResponse.json(
        { error: "Payment token is required" },
        { status: 400 }
      );
    }

    // Calculate pricing
    const subtotal = calculateCartSubtotal(items);
    const shipping = calculateShipping(items, shippingMethod);
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax, shipping);

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order in database (pending payment)
    const orderData = {
      order_number: orderNumber,
      status: "pending_payment",
      items: JSON.stringify(items),
      subtotal,
      tax,
      shipping,
      total,
      shipping_address: JSON.stringify(shippingAddress),
      shipping_method: shippingMethod,
      customer_email: customerEmail,
      customer_phone: shippingAddress.phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const order = await createOrder(orderData);

    // Prepare line items for Square
    const lineItems = items.map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      const option = product?.options.find((o) => o.id === item.optionId);

      return {
        name: `${product?.name} - ${variant?.quantity} units`,
        description: `${option?.name || "Standard"}`,
        amount: calculateItemPrice(item),
        quantity: 1,
      };
    });

    try {
      // Create Square order (optional but recommended for tracking)
      const squareOrder = await createSquareOrder({
        orderId: order.id,
        orderNumber,
        items: lineItems,
        subtotal,
        shipping,
        total,
      });

      // Process payment with Square
      const payment = await createPayment({
        orderId: order.id,
        orderNumber,
        customerEmail,
        sourceId: paymentToken,
        amount: total,
        note: `PrintFlow Order ${orderNumber}`,
      });

      // Update order with payment info
      await updateOrder(order.id, {
        status: "paid",
        payment_id: payment.payment?.id || "",
        payment_status: payment.payment?.status || "",
        square_order_id: squareOrder.order?.id || "",
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber,
        paymentId: payment.payment?.id,
      });
    } catch (paymentError: any) {
      // Payment failed - update order status
      await updateOrder(order.id, {
        status: "payment_failed",
        payment_error: paymentError.message || "Payment processing failed",
        updated_at: new Date().toISOString(),
      });

      console.error("Payment error:", paymentError);
      return NextResponse.json(
        {
          error: "Payment failed",
          message: paymentError.message || "Unable to process payment"
        },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
