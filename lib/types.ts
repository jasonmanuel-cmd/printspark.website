import { OrderStatus } from "./constants";

export interface CartItem {
  productId: string;
  variantId: string;
  optionId: string;
  quantity: number;
  designFile?: {
    name: string;
    url: string;
    size: number;
  };
  designService?: "basic" | "custom" | "rush" | null;
  customizations?: {
    colors?: string[];
    sizes?: string[];
    text?: string;
    notes?: string;
  };
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  variantQuantity: number;
  optionId: string;
  optionName: string;
  price: number;
  designFile?: {
    name: string;
    url: string;
    size: number;
  };
  designService?: "basic" | "custom" | "rush" | null;
  customizations?: {
    colors?: string[];
    sizes?: string[];
    text?: string;
    notes?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  shippingMethod: "standard" | "express" | "overnight";
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  customerEmail: string;
  customerPhone: string;
  paymentIntentId?: string;
  notes?: string;
}

export interface PriceQuote {
  subtotal: number;
  tax: number;
  shipping: number;
  designFee: number;
  total: number;
  estimatedDelivery: string;
}

export interface DesignFile {
  id: string;
  orderId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  status: "pending" | "approved" | "rejected" | "needs-revision";
  notes?: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  inProductionOrders: number;
  shippedOrders: number;
  revenue: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  popularProducts: Array<{
    productId: string;
    productName: string;
    orderCount: number;
    revenue: number;
  }>;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export interface TrackingInfo {
  orderNumber: string;
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  shippedDate?: string;
  history: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
}
