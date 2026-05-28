export type FulfillmentPartner = "printful" | "mixam" | "manual";

export interface FulfillmentOrderItem {
  productId: string;
  variantId: string;
  optionId: string;
  quantity: number;
  designFileUrl?: string;
}

export interface FulfillmentOrder {
  orderId: string;
  orderNumber: string;
  items: FulfillmentOrderItem[];
  shippingAddress: {
    name: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
    email?: string;
  };
  shippingMethod: string;
}

export interface FulfillmentResult {
  success: boolean;
  partner: FulfillmentPartner;
  partnerOrderId?: string;
  error?: string;
}

export type FulfillmentOrderStatus =
  | "draft"
  | "pending"
  | "fulfilled"
  | "canceled"
  | "failed";
