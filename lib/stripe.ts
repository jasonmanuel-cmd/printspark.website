import Stripe from "stripe";

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    });
  }
  return stripeInstance;
}

export const stripe = typeof process.env.STRIPE_SECRET_KEY === 'string'
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    })
  : null as any;

export const STRIPE_CONFIG = {
  currency: "usd",
  paymentMethods: ["card"],
};

// Helper function to create a checkout session
export async function createCheckoutSession({
  orderId,
  orderNumber,
  customerEmail,
  items,
  subtotal,
  tax,
  shipping,
  total,
  successUrl,
  cancelUrl,
}: {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  items: Array<{
    name: string;
    description: string;
    amount: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  successUrl: string;
  cancelUrl: string;
}) {
  const lineItems = items.map(
    (item) => ({
      price_data: {
        currency: STRIPE_CONFIG.currency,
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.amount * 100), // Convert to cents
      },
      quantity: item.quantity,
    })
  );

  // Add shipping as a line item
  if (shipping > 0) {
    lineItems.push({
      price_data: {
        currency: STRIPE_CONFIG.currency,
        product_data: {
          name: "Shipping",
          description: "Delivery to your address",
        },
        unit_amount: Math.round(shipping * 100),
      },
      quantity: 1,
    });
  }

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: STRIPE_CONFIG.paymentMethods as any,
    line_items: lineItems,
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      orderId,
      orderNumber,
    },
    shipping_address_collection: {
      allowed_countries: ["US", "CA"],
    },
    phone_number_collection: {
      enabled: true,
    },
    allow_promotion_codes: true,
    billing_address_collection: "required",
  });

  return session;
}

// Helper function to retrieve a checkout session
export async function getCheckoutSession(sessionId: string) {
  return await getStripe().checkout.sessions.retrieve(sessionId);
}

// Helper function to create a refund
export async function createRefund(paymentIntentId: string, amount?: number) {
  const refund = await getStripe().refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
  });

  return refund;
}

// Helper function to construct webhook event
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
  }

  return getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
}

// Helper function to retrieve payment intent
export async function getPaymentIntent(paymentIntentId: string) {
  return await getStripe().paymentIntents.retrieve(paymentIntentId);
}

// Helper function to update payment intent
export async function updatePaymentIntent(
  paymentIntentId: string,
  updates: Stripe.PaymentIntentUpdateParams
) {
  return await getStripe().paymentIntents.update(paymentIntentId, updates);
}
