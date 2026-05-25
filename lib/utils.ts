import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PRODUCTS, SHIPPING_RATES, TAX_RATE, DESIGN_SERVICES } from "./constants";
import { CartItem, PriceQuote } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(date));
}

export function generateOrderNumber(): string {
  const prefix = "PF";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}${timestamp}${random}`;
}

export function calculateItemPrice(item: CartItem): number {
  const product = PRODUCTS.find((p) => p.id === item.productId);
  if (!product) return 0;

  const variant = product.variants.find((v) => v.id === item.variantId);
  const option = product.options.find((o) => o.id === item.optionId);

  if (!variant) return 0;

  let price = variant.price;
  if (option) {
    price += option.price;
  }

  if (item.designService) {
    price += DESIGN_SERVICES[item.designService].price;
  }

  return price;
}

export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + calculateItemPrice(item);
  }, 0);
}

export function calculateShipping(
  items: CartItem[],
  method: "standard" | "express" | "overnight"
): number {
  const totalWeight = items.reduce((weight, item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    return weight + (product?.weight || 0);
  }, 0);

  const rate = SHIPPING_RATES[method];
  return rate.baseRate + totalWeight * rate.perLb;
}

export function calculateTax(subtotal: number): number {
  return subtotal * TAX_RATE;
}

export function calculateTotal(
  subtotal: number,
  tax: number,
  shipping: number
): number {
  return subtotal + tax + shipping;
}

export function calculatePriceQuote(
  items: CartItem[],
  shippingMethod: "standard" | "express" | "overnight"
): PriceQuote {
  const subtotal = calculateCartSubtotal(items);
  const shipping = calculateShipping(items, shippingMethod);
  const tax = calculateTax(subtotal);
  const designFee = items.reduce((fee, item) => {
    if (item.designService) {
      return fee + DESIGN_SERVICES[item.designService].price;
    }
    return fee;
  }, 0);

  const total = calculateTotal(subtotal, tax, shipping);

  // Calculate estimated delivery
  const turnaroundDays = Math.max(
    ...items.map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      return product?.turnaroundDays || 3;
    })
  );

  const shippingDays =
    shippingMethod === "overnight" ? 1 : shippingMethod === "express" ? 3 : 7;
  const totalDays = turnaroundDays + shippingDays;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + totalDays);

  return {
    subtotal,
    tax,
    shipping,
    designFee,
    total,
    estimatedDelivery: formatDate(estimatedDelivery),
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

export function validateZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_+/g, "_")
    .toLowerCase();
}

export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

export function isValidDesignFile(fileName: string, fileSize: number): {
  valid: boolean;
  error?: string;
} {
  const validExtensions = ["pdf", "ai", "eps", "psd", "jpg", "jpeg", "png"];
  const maxSize = 50 * 1024 * 1024; // 50MB

  const extension = getFileExtension(fileName);

  if (!validExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file type. Accepted formats: ${validExtensions.join(", ")}`,
    };
  }

  if (fileSize > maxSize) {
    return {
      valid: false,
      error: "File size must be less than 50MB",
    };
  }

  return { valid: true };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function getProductById(productId: string) {
  return PRODUCTS.find((p) => p.id === productId);
}

export function getProductsByCategory(category: string) {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

export function parseOrderNumber(orderNumber: string): {
  valid: boolean;
  timestamp?: number;
} {
  if (!orderNumber.startsWith("PF") || orderNumber.length !== 13) {
    return { valid: false };
  }

  const timestampStr = orderNumber.slice(2, 10);
  const timestamp = parseInt(timestampStr, 10);

  return { valid: true, timestamp };
}
