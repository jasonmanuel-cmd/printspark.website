import { NextRequest, NextResponse } from "next/server";
import { createPayment, createSquareOrder } from "@/lib/square";
import { createOrder, updateOrder } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { CartItem, ShippingAddress } from "@/lib/types";
import { PRODUCTS } from "@/lib/constants";
import { calculateItemPrice, calculateCartSubtotal, calculateShipping, calculateTax, calculateTotal } from "@/lib/utils";
import { fulfillOrder } from "@/lib/fulfillment/router";
import { FulfillmentOrderItem } from "@/lib/fulfillment/types";

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
        note: `PrintSpark Order ${orderNumber}`,
      });

      // Update order with payment info
      await updateOrder(order.id, {
        status: "paid",
        payment_id: payment?.id || "",
        payment_status: payment?.status || "",
        square_order_id: squareOrder?.id || "",
        updated_at: new Date().toISOString(),
      });

      // Submit to fulfillment partners
      const fulfillmentItems: FulfillmentOrderItem[] = items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        optionId: item.optionId,
        quantity: item.quantity,
        designFileUrl: item.designFile?.url,
      }));

      const fulfillmentResults = await fulfillOrder({
        orderId: order.id,
        orderNumber,
        items: fulfillmentItems,
        shippingAddress: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          company: shippingAddress.company,
          address1: shippingAddress.address1,
          address2: shippingAddress.address2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zipCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
          email: customerEmail,
        },
        shippingMethod,
      });

      const printfulResult = fulfillmentResults.find((r) => r.partner === "printful");
      const mixamResult = fulfillmentResults.find((r) => r.partner === "mixam");

      const fulfilledPartner = printfulResult?.success
        ? "printful"
        : mixamResult?.success
          ? "mixam"
          : null;

      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (fulfilledPartner) {
        updateData.fulfillment_partner = fulfilledPartner;
        updateData.status = "processing";
      }

      if (printfulResult?.partnerOrderId) {
        updateData.fulfillment_order_id = printfulResult.partnerOrderId;
        updateData.fulfillment_status = "submitted";
      }

      const allSucceeded = fulfillmentResults.every((r) => r.success);
      if (allSucceeded) {
        await updateOrder(order.id, updateData);
      } else {
        const failed = fulfillmentResults
          .filter((r) => !r.success)
          .map((r) => `[${r.partner}] ${r.error}`)
          .join("; ");
        await updateOrder(order.id, {
          ...updateData,
          notes: `Fulfillment submission issues: ${failed}`,
        });
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber,
        paymentId: payment?.id,
        fulfillment: fulfillmentResults.map((r) => ({
          partner: r.partner,
          success: r.success,
          orderId: r.partnerOrderId,
        })),
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
