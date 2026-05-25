import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { createOrder } from "@/lib/supabase";
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
    }: {
      items: CartItem[];
      shippingAddress: ShippingAddress;
      shippingMethod: "standard" | "express" | "overnight";
      customerEmail: string;
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

    // Calculate pricing
    const subtotal = calculateCartSubtotal(items);
    const shipping = calculateShipping(items, shippingMethod);
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax, shipping);

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order in database
    const orderData = {
      order_number: orderNumber,
      status: "pending",
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

    // Prepare line items for Stripe
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

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      orderId: order.id,
      orderNumber,
      customerEmail,
      items: lineItems,
      subtotal,
      tax,
      shipping,
      total,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?cancelled=true`,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      orderNumber,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
