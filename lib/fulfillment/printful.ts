import { FulfillmentOrder, FulfillmentResult } from "./types";
import { getPrintfulVariantMap } from "./printful-map";

const API_BASE = "https://api.printful.com/v2";

async function fetchPrintful(path: string, options: RequestInit = {}) {
  const key = process.env.PRINTFUL_API_KEY;
  if (!key) {
    throw new Error(
      "PRINTFUL_API_KEY is not set — generate a Private Token at https://developers.printful.com/"
    );
  }

  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Printful API error ${res.status}: ${body}`);
  }

  return res.json();
}

export async function createPrintfulOrder(
  order: FulfillmentOrder
): Promise<FulfillmentResult> {
  const variantMap = getPrintfulVariantMap();

  const items = order.items
    .map((item) => {
      const variantId = variantMap[item.productId]?.[item.variantId];
      if (!variantId) {
        console.warn(
          `[Printful] No variant mapping for ${item.productId}/${item.variantId}`
        );
        return null;
      }
      return {
        sync_variant_id: variantId,
        quantity: item.quantity || 1,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (items.length === 0) {
    return {
      success: false,
      partner: "printful",
      error:
        "No items have Printful variant mappings — configure PRINTFUL_VARIANT_MAP",
    };
  }

  const body: Record<string, unknown> = {
    recipient: {
      name: order.shippingAddress.name,
      company: order.shippingAddress.company || undefined,
      address1: order.shippingAddress.address1,
      address2: order.shippingAddress.address2 || undefined,
      city: order.shippingAddress.city,
      state_code: order.shippingAddress.state,
      zip: order.shippingAddress.zip,
      country_code: order.shippingAddress.country,
      phone: order.shippingAddress.phone || undefined,
      email: order.shippingAddress.email || undefined,
    },
    items,
    external_id: order.orderNumber,
  };

  if (order.shippingMethod === "express") {
    body.shipping = "EXPRESS";
  }

  try {
    const data = await fetchPrintful("/orders", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const orderData = data?.data || data;
    return {
      success: true,
      partner: "printful",
      partnerOrderId: String(orderData.id || ""),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, partner: "printful", error: message };
  }
}

export async function getPrintfulOrderStatus(
  partnerOrderId: string
): Promise<{ status: string; tracking?: string } | null> {
  try {
    const data = await fetchPrintful(`/orders/${partnerOrderId}`);
    const orderData = data?.data || data;
    return {
      status: orderData.status || "unknown",
      tracking: orderData.tracking_number || undefined,
    };
  } catch {
    return null;
  }
}
