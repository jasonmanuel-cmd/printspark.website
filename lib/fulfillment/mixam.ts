import { FulfillmentOrder, FulfillmentResult } from "./types";

export async function createMixamOrder(
  order: FulfillmentOrder
): Promise<FulfillmentResult> {
  const key = process.env.MIXAM_API_KEY;

  if (!key) {
    return {
      success: false,
      partner: "mixam",
      error:
        "Mixam API key not configured — request credentials from developer@mixam.com and set MIXAM_API_KEY",
    };
  }

  return {
    success: false,
    partner: "mixam",
    error:
      "Mixam integration stub — full API client will be implemented once credentials are available",
  };
}
