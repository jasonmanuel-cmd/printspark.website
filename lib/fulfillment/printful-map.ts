export interface PrintfulVariantMap {
  [productId: string]: {
    [variantId: string]: number;
  };
}

function defaultMap(): PrintfulVariantMap {
  return {};
}

export function getPrintfulVariantMap(): PrintfulVariantMap {
  const raw = process.env.PRINTFUL_VARIANT_MAP;
  if (raw) {
    try {
      return JSON.parse(raw) as PrintfulVariantMap;
    } catch {
      console.warn("Failed to parse PRINTFUL_VARIANT_MAP, using defaults");
    }
  }
  return defaultMap();
}
