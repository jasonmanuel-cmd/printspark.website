export const BUSINESS_INFO = {
  name: "PrintSpark",
  slogan: "Print Fast. Look Amazing.",
  tagline: "Your Vision, Perfectly Printed",
  email: "hello@printspark.website",
  support: "support@printspark.website",
  phone: "(888) 774-6877", // (888) PRINTSPARK
  address: "Nationwide Print Services", // Update when you have physical location
  hours: "Monday - Friday: 9AM - 7PM EST | Saturday: 10AM - 4PM EST",
  website: "printspark.website",
};

export const SHIPPING_RATES = {
  standard: { name: "Standard (5-7 business days)", baseRate: 9.99, perLb: 1.5 },
  express: { name: "Express (2-3 business days)", baseRate: 19.99, perLb: 3.0 },
  overnight: { name: "Overnight", baseRate: 39.99, perLb: 5.0 },
};

export const TAX_RATE = 0.08; // 8% sales tax

export type ProductCategory = "paper" | "apparel" | "marketing" | "signage";

export interface ProductVariant {
  id: string;
  quantity: number;
  price: number;
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  longDescription: string;
  basePrice: number;
  image: string;
  variants: ProductVariant[];
  options: ProductOption[];
  turnaroundDays: number;
  weight: number; // in pounds for shipping calculation
  requiresDesign: boolean;
  specifications: string[];
  fulfillmentPartner: "printful" | "mixam" | "manual";
}

export const PRODUCTS: Product[] = [
  {
    id: "business-cards",
    name: "Business Cards",
    category: "paper",
    description: "Premium business cards on quality cardstock",
    longDescription: "Make a lasting impression with our premium business cards. Printed on high-quality 16pt cardstock with your choice of finish. Perfect for networking events, conferences, and everyday business interactions.",
    basePrice: 39,
    image: "/products/business-cards.jpg",
    variants: [
      { id: "500", quantity: 500, price: 39 },
      { id: "1000", quantity: 1000, price: 59 },
      { id: "2500", quantity: 2500, price: 99 },
      { id: "5000", quantity: 5000, price: 169 },
    ],
    options: [
      { id: "standard", name: "Standard Finish", price: 0 },
      { id: "glossy", name: "Glossy UV Coating", price: 15 },
      { id: "matte", name: "Matte Lamination", price: 15 },
      { id: "spot-uv", name: "Spot UV", price: 35 },
    ],
    turnaroundDays: 3,
    weight: 0.5,
    requiresDesign: true,
    specifications: [
      "Size: 3.5\" x 2\" (standard)",
      "Material: 16pt cardstock",
      "Full color both sides",
      "Rounded corners available",
    ],
    fulfillmentPartner: "mixam",
  },
  {
    id: "flyers",
    name: "Flyers",
    category: "marketing",
    description: "Eye-catching flyers for promotions and events",
    longDescription: "Promote your business, event, or special offer with professionally printed flyers. Available in multiple sizes and paper stocks to suit any budget and purpose.",
    basePrice: 49,
    image: "/products/flyers.jpg",
    variants: [
      { id: "100-8.5x11", quantity: 100, price: 49 },
      { id: "250-8.5x11", quantity: 250, price: 79 },
      { id: "500-8.5x11", quantity: 500, price: 119 },
      { id: "1000-8.5x11", quantity: 1000, price: 199 },
      { id: "2500-8.5x11", quantity: 2500, price: 399 },
    ],
    options: [
      { id: "80lb-gloss", name: "80lb Gloss Text", price: 0 },
      { id: "100lb-gloss", name: "100lb Gloss Cover", price: 20 },
      { id: "100lb-matte", name: "100lb Matte Cover", price: 20 },
    ],
    turnaroundDays: 3,
    weight: 1.0,
    requiresDesign: true,
    specifications: [
      "Size: 8.5\" x 11\"",
      "Full color single or double sided",
      "Multiple paper stocks",
      "Perfect for promotions",
    ],
    fulfillmentPartner: "mixam",
  },
  {
    id: "posters",
    name: "Posters",
    category: "signage",
    description: "Large format posters for maximum impact",
    longDescription: "Make a big statement with our high-quality poster printing. Perfect for events, promotions, retail displays, and more. Printed on premium paper with vibrant, eye-catching colors.",
    basePrice: 29,
    image: "/products/posters.jpg",
    variants: [
      { id: "1-18x24", quantity: 1, price: 29 },
      { id: "5-18x24", quantity: 5, price: 119 },
      { id: "10-18x24", quantity: 10, price: 199 },
      { id: "1-24x36", quantity: 1, price: 49 },
      { id: "5-24x36", quantity: 5, price: 199 },
      { id: "10-24x36", quantity: 10, price: 349 },
    ],
    options: [
      { id: "standard", name: "Standard Paper", price: 0 },
      { id: "premium", name: "Premium Satin", price: 15 },
      { id: "foam-board", name: "Mounted on Foam Board", price: 35 },
    ],
    turnaroundDays: 2,
    weight: 0.75,
    requiresDesign: true,
    specifications: [
      "Available sizes: 18x24\", 24x36\"",
      "Full color printing",
      "High-resolution output",
      "Optional mounting",
    ],
    fulfillmentPartner: "printful",
  },
  {
    id: "tshirts",
    name: "Custom T-Shirts",
    category: "apparel",
    description: "High-quality custom printed t-shirts",
    longDescription: "Premium cotton t-shirts with your custom design. Perfect for events, teams, promotions, or merchandise. Available in multiple colors and sizes with professional screen printing or DTG printing.",
    basePrice: 149,
    image: "/products/tshirts.jpg",
    variants: [
      { id: "12", quantity: 12, price: 149 },
      { id: "24", quantity: 24, price: 249 },
      { id: "50", quantity: 50, price: 449 },
      { id: "100", quantity: 100, price: 799 },
      { id: "250", quantity: 250, price: 1749 },
    ],
    options: [
      { id: "1-color", name: "1 Color Print", price: 0 },
      { id: "2-color", name: "2 Color Print", price: 50 },
      { id: "full-color", name: "Full Color (DTG)", price: 100 },
    ],
    turnaroundDays: 7,
    weight: 5.0,
    requiresDesign: true,
    specifications: [
      "100% cotton",
      "Sizes: S-3XL",
      "Multiple colors available",
      "Professional printing",
    ],
    fulfillmentPartner: "printful",
  },
  {
    id: "brochures",
    name: "Brochures",
    category: "marketing",
    description: "Professional tri-fold and bi-fold brochures",
    longDescription: "Showcase your products and services with professionally printed brochures. Available in multiple sizes and folds with premium paper stocks and finishes.",
    basePrice: 99,
    image: "/products/brochures.jpg",
    variants: [
      { id: "100", quantity: 100, price: 99 },
      { id: "250", quantity: 250, price: 199 },
      { id: "500", quantity: 500, price: 349 },
      { id: "1000", quantity: 1000, price: 599 },
    ],
    options: [
      { id: "trifold", name: "Tri-Fold", price: 0 },
      { id: "bifold", name: "Bi-Fold", price: 0 },
      { id: "zfold", name: "Z-Fold", price: 10 },
    ],
    turnaroundDays: 5,
    weight: 1.5,
    requiresDesign: true,
    specifications: [
      "Size: 8.5\" x 11\" (folded)",
      "100lb gloss text",
      "Full color both sides",
      "Multiple fold options",
    ],
    fulfillmentPartner: "mixam",
  },
  {
    id: "postcards",
    name: "Postcards",
    category: "marketing",
    description: "Direct mail postcards for marketing campaigns",
    longDescription: "Reach your customers directly with high-quality postcards. Perfect for promotions, announcements, or direct mail campaigns. Available in standard and oversized formats.",
    basePrice: 59,
    image: "/products/postcards.jpg",
    variants: [
      { id: "250-4x6", quantity: 250, price: 59 },
      { id: "500-4x6", quantity: 500, price: 99 },
      { id: "1000-4x6", quantity: 1000, price: 169 },
      { id: "2500-4x6", quantity: 2500, price: 349 },
      { id: "5000-4x6", quantity: 5000, price: 599 },
    ],
    options: [
      { id: "14pt", name: "14pt Cardstock", price: 0 },
      { id: "16pt", name: "16pt Cardstock", price: 20 },
      { id: "uv-coated", name: "UV Coated", price: 25 },
    ],
    turnaroundDays: 3,
    weight: 1.0,
    requiresDesign: true,
    specifications: [
      "Size: 4\" x 6\" or 6\" x 9\"",
      "Full color printing",
      "Mailing services available",
      "EDDM ready",
    ],
    fulfillmentPartner: "mixam",
  },
  {
    id: "stickers",
    name: "Custom Stickers",
    category: "marketing",
    description: "Die-cut stickers in any shape",
    longDescription: "Create custom die-cut stickers in any shape with our premium vinyl material. Perfect for branding, products, laptops, and giveaways. Weather-resistant and durable.",
    basePrice: 79,
    image: "/products/stickers.jpg",
    variants: [
      { id: "50", quantity: 50, price: 79 },
      { id: "100", quantity: 100, price: 119 },
      { id: "250", quantity: 250, price: 229 },
      { id: "500", quantity: 500, price: 399 },
      { id: "1000", quantity: 1000, price: 699 },
    ],
    options: [
      { id: "vinyl", name: "Vinyl Stickers", price: 0 },
      { id: "clear", name: "Clear Vinyl", price: 20 },
      { id: "holographic", name: "Holographic", price: 40 },
    ],
    turnaroundDays: 5,
    weight: 0.5,
    requiresDesign: true,
    specifications: [
      "Custom die-cut shapes",
      "Weather-resistant vinyl",
      "Full color printing",
      "Kiss-cut or individual",
    ],
    fulfillmentPartner: "printful",
  },
];

export const CATEGORIES = [
  { id: "all", name: "All Products" },
  { id: "paper", name: "Paper Products" },
  { id: "apparel", name: "Apparel" },
  { id: "marketing", name: "Marketing Materials" },
  { id: "signage", name: "Signage" },
];

export const DESIGN_SERVICES = {
  basic: {
    name: "Basic Design Assistance",
    price: 49,
    description: "Minor adjustments to your existing design",
  },
  custom: {
    name: "Custom Design",
    price: 149,
    description: "Professional custom design from scratch",
  },
  rush: {
    name: "Rush Design (24hrs)",
    price: 99,
    description: "Fast-track design service",
  },
};

export const ORDER_STATUS = {
  pending: "Pending",
  "design-review": "Design Review",
  "in-production": "In Production",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;
