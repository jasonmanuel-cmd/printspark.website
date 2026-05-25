import { Client, Environment, ApiError } from "square";
import { randomUUID } from "crypto";

// Initialize Square client
let squareInstance: Client | null = null;

export function getSquare() {
  if (!squareInstance) {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const environment = process.env.SQUARE_ENVIRONMENT === "production"
      ? Environment.Production
      : Environment.Sandbox;

    if (!accessToken) {
      throw new Error("Missing SQUARE_ACCESS_TOKEN environment variable");
    }

    squareInstance = new Client({
      accessToken,
      environment,
    });
  }
  return squareInstance;
}

export const SQUARE_CONFIG = {
  currency: "USD",
  locationId: process.env.SQUARE_LOCATION_ID || "",
};

// Helper function to create a payment
export async function createPayment({
  orderId,
  orderNumber,
  customerEmail,
  sourceId, // Payment token from Square Web SDK
  amount,
  note,
}: {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  sourceId: string;
  amount: number;
  note?: string;
}) {
  const { paymentsApi } = getSquare();

  const payment = await paymentsApi.createPayment({
    sourceId,
    idempotencyKey: randomUUID(),
    amountMoney: {
      amount: BigInt(Math.round(amount * 100)), // Convert to cents
      currency: SQUARE_CONFIG.currency,
    },
    locationId: SQUARE_CONFIG.locationId,
    note: note || `Order ${orderNumber}`,
    referenceId: orderId,
    buyerEmailAddress: customerEmail,
  });

  return payment.result;
}

// Helper function to create an order in Square
export async function createSquareOrder({
  orderId,
  orderNumber,
  items,
  subtotal,
  shipping,
  total,
}: {
  orderId: string;
  orderNumber: string;
  items: Array<{
    name: string;
    description?: string;
    amount: number;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
}) {
  const { ordersApi } = getSquare();

  const lineItems = items.map((item) => ({
    name: item.name,
    note: item.description,
    quantity: item.quantity.toString(),
    basePriceMoney: {
      amount: BigInt(Math.round(item.amount * 100)),
      currency: SQUARE_CONFIG.currency,
    },
  }));

  // Add shipping as a line item
  if (shipping > 0) {
    lineItems.push({
      name: "Shipping",
      note: "Delivery to your address",
      quantity: "1",
      basePriceMoney: {
        amount: BigInt(Math.round(shipping * 100)),
        currency: SQUARE_CONFIG.currency,
      },
    });
  }

  const order = await ordersApi.createOrder({
    order: {
      locationId: SQUARE_CONFIG.locationId,
      referenceId: orderId,
      lineItems,
      metadata: {
        orderNumber,
        internalOrderId: orderId,
      },
    },
    idempotencyKey: randomUUID(),
  });

  return order.result;
}

// Helper function to retrieve a payment
export async function getPayment(paymentId: string) {
  const { paymentsApi } = getSquare();
  const payment = await paymentsApi.getPayment(paymentId);
  return payment.result;
}

// Helper function to create a refund
export async function createRefund(paymentId: string, amount?: number) {
  const { refundsApi } = getSquare();

  const refund = await refundsApi.refundPayment({
    idempotencyKey: randomUUID(),
    paymentId,
    amountMoney: amount ? {
      amount: BigInt(Math.round(amount * 100)),
      currency: SQUARE_CONFIG.currency,
    } : undefined,
    reason: "Customer requested refund",
  });

  return refund.result;
}

// Helper function to verify webhook signature
export function verifyWebhookSignature(
  body: string,
  signature: string,
  signatureKey: string
): boolean {
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", signatureKey);
  const expectedSignature = hmac.update(body).digest("base64");
  return signature === expectedSignature;
}

// Helper function to list all payments for an order
export async function getOrderPayments(orderId: string) {
  const { paymentsApi } = getSquare();

  const payments = await paymentsApi.listPayments({
    locationId: SQUARE_CONFIG.locationId,
    limit: 100,
  });

  // Filter by order reference ID
  return payments.result.payments?.filter(
    (payment) => payment.referenceId === orderId
  ) || [];
}

// Export for backwards compatibility (renamed from stripe.ts)
export const square = getSquare();

