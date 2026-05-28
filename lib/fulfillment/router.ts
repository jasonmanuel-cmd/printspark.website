import { FulfillmentOrder, FulfillmentResult, FulfillmentPartner } from "./types";
import { createPrintfulOrder } from "./printful";
import { createMixamOrder } from "./mixam";

function partnerForProduct(productId: string): FulfillmentPartner {
  const printfulProducts = ["tshirts", "stickers", "posters"];
  const mixamProducts = ["business-cards", "flyers", "brochures", "postcards"];

  if (printfulProducts.includes(productId)) return "printful";
  if (mixamProducts.includes(productId)) return "mixam";
  return "manual";
}

export async function fulfillOrder(
  order: FulfillmentOrder
): Promise<FulfillmentResult[]> {
  const grouped: Record<FulfillmentPartner, FulfillmentOrder> = {
    printful: { ...order, items: [] },
    mixam: { ...order, items: [] },
    manual: { ...order, items: [] },
  };

  for (const item of order.items) {
    const partner = partnerForProduct(item.productId);
    grouped[partner].items.push(item);
  }

  const results: FulfillmentResult[] = [];

  if (grouped.printful.items.length > 0) {
    const r = await createPrintfulOrder(grouped.printful);
    results.push(r);
  }

  if (grouped.mixam.items.length > 0) {
    const r = await createMixamOrder(grouped.mixam);
    results.push(r);
  }

  if (grouped.manual.items.length > 0) {
    results.push({
      success: true,
      partner: "manual",
      error: undefined,
    });
  }

  return results;
}
