# PrintSpark - Professional Print-on-Demand Platform

A complete, production-ready print-on-demand e-commerce platform built with Next.js 16, TypeScript, Neon (Postgres), and Square Payments.

## Features

### Customer-Facing
- **Product Catalog** - 9 different printing products (business cards, flyers, posters, banners, t-shirts, brochures, postcards, stickers, yard signs)
- **Real-time Price Calculator** - Instant quotes based on quantity, options, and design services
- **File Upload System** - Drag-and-drop design file upload with validation
- **Shopping Cart** - Persistent cart with Zustand state management
- **Square Checkout** - Secure card payment processing via Square Web Payments SDK
- **Order Tracking** - Real-time order status tracking
- **Custom Quote Requests** - Form for bulk orders and special requests
- **Responsive Design** - Mobile-first, fully responsive UI

### Business Features
- **Automated Order Management** - Order creation, status updates, tracking
- **Design File Storage** - Vercel Blob for customer uploads
- **Webhook Integration** - Square webhooks for payment notifications
- **Email Notifications** - Customer confirmations and updates (ready to integrate)
- **Shipping Calculator** - Dynamic shipping cost calculation
- **Tax Calculation** - Automatic sales tax computation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Database**: Neon (serverless PostgreSQL)
- **Payments**: Square
- **File Storage**: Vercel Blob
- **Email**: Resend (optional)

## Project Structure

```
printspark/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts           # Square checkout processing
│   │   ├── contact/route.ts            # Contact form submission
│   │   ├── orders/route.ts             # Order CRUD operations
│   │   ├── quote/route.ts              # Quote request submission
│   │   ├── shipping/calculate/route.ts # Shipping cost calculation
│   │   └── webhooks/square/route.ts    # Square webhook handler
│   ├── products/
│   │   ├── [id]/page.tsx               # Product detail page
│   │   └── page.tsx                    # Products listing
│   ├── checkout/page.tsx               # Checkout with Square card form
│   ├── order/success/page.tsx          # Order confirmation
│   ├── track/page.tsx                  # Order tracking
│   ├── about/page.tsx                  # About us
│   ├── faq/page.tsx                    # FAQ
│   ├── shipping/page.tsx               # Shipping info
│   ├── returns/page.tsx                # Returns policy
│   ├── terms/page.tsx                  # Terms of service
│   ├── privacy/page.tsx                # Privacy policy
│   ├── contact/page.tsx                # Contact form
│   ├── quote/page.tsx                  # Custom quote request
│   ├── design-guidelines/page.tsx      # Design file specs
│   ├── layout.tsx                      # Root layout with header/footer
│   └── page.tsx                        # Homepage
├── components/
│   ├── ui/                             # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   └── label.tsx
│   ├── Header.tsx                      # Site header with cart
│   ├── Footer.tsx                      # Site footer
│   ├── ProductCard.tsx                 # Product display card
│   ├── PriceCalculator.tsx             # Dynamic price calculator
│   └── FileUpload.tsx                  # File upload component
├── lib/
│   ├── constants.ts                    # Products, pricing, business info
│   ├── types.ts                        # TypeScript type definitions
│   ├── utils.ts                        # Helper functions
│   ├── db.ts                           # Neon/Postgres queries
│   ├── storage.ts                      # Vercel Blob file storage
│   ├── square.ts                       # Square SDK configuration
│   └── store.ts                        # Zustand state stores
└── neon-schema.sql                     # Database schema
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Neon account
- Square account

### 1. Clone and Install

```bash
git clone <repository-url>
cd printspark
pnpm install
```

### 2. Set Up Neon Database

1. Create a project at [neon.tech](https://neon.tech)
2. Copy your connection string (Project Dashboard → Connection Details → PSQL)
3. Run the database schema:
   - Open the Neon SQL Editor
   - Copy and paste the contents of `neon-schema.sql`
   - Execute the SQL

### 3. Set Up Square

1. Create a Square account at [squareup.com](https://squareup.com)
2. Go to Developer Dashboard → Applications → Create App
3. Get your credentials:
   - **Application ID** (from Credentials tab)
   - **Location ID** (from Locations tab)
   - **Access Token** (from Credentials tab → Generate token)
4. Configure Webhooks:
   - Go to Webhooks tab → Add webhook endpoint
   - URL: `https://your-domain.com/api/webhooks/square`
   - Subscribe to: `payment.created`, `payment.updated`, `refund.created`

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
```env
# Neon
DATABASE_URL=postgresql://user:pass@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require

# Square
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-...
SQUARE_ACCESS_TOKEN=EAAAl...
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=L...
SQUARE_WEBHOOK_SIGNATURE_KEY=...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Optional)
RESEND_API_KEY=re_...
FROM_EMAIL=orders@printspark.website
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Product Catalog

The platform includes 9 ready-to-sell products:

1. **Business Cards** - $39-$169 (500-5000 cards)
2. **Flyers** - $49-$399 (100-2500 pieces)
3. **Posters** - $29-$349 (various sizes)
4. **Vinyl Banners** - $79-$299 (2x4 to 5x10 feet)
5. **Custom T-Shirts** - $149-$1749 (12-250 shirts)
6. **Brochures** - $99-$599 (100-1000 pieces)
7. **Postcards** - $59-$599 (250-5000 pieces)
8. **Custom Stickers** - $79-$699 (50-1000 pieces)
9. **Yard Signs** - $149-$899 (5-50 signs)

All products include:
- Multiple quantity tiers
- Various material/finish options
- Optional design services
- Turnaround time estimates
- Shipping weight for cost calculation

## API Routes

### POST `/api/checkout`
Process payment and create order via Square
```json
{
  "items": CartItem[],
  "shippingAddress": ShippingAddress,
  "shippingMethod": "standard" | "express" | "overnight",
  "customerEmail": string,
  "paymentToken": string
}
```

### GET `/api/orders?orderNumber=xxx&email=xxx`
Fetch order by order number and email

### PATCH `/api/orders`
Update order status (admin)
```json
{
  "orderId": string,
  "status": string,
  "trackingNumber": string,
  "notes": string
}
```

### POST `/api/shipping/calculate`
Calculate shipping costs
```json
{
  "items": CartItem[],
  "method": "standard" | "express" | "overnight"
}
```

### POST `/api/contact`
Submit contact form
```json
{
  "name": string,
  "email": string,
  "subject": string,
  "message": string
}
```

### POST `/api/quote`
Submit custom quote request
```json
{
  "name": string,
  "email": string,
  "phone": string,
  "productId": string,
  "quantity": number,
  "description": string
}
```

### POST `/api/webhooks/square`
Handle Square webhook events (payment.updated, refund.created, etc.)

## Customization

### Update Business Info
Edit `/lib/constants.ts`:
```typescript
export const BUSINESS_INFO = {
  name: "PrintSpark",
  tagline: "Professional Printing, Delivered Nationwide",
  email: "hello@printspark.website",
  support: "support@printspark.website",
  phone: "(888) 774-6877",
  address: "123 Print Street, Suite 100, New York, NY 10001",
  hours: "Monday - Friday: 9AM - 6PM EST",
};
```

### Add/Modify Products
Edit the `PRODUCTS` array in `/lib/constants.ts`

### Update Pricing
Modify shipping rates and tax rate in `/lib/constants.ts`

### Customize Design
- Colors: Tailwind configuration
- Fonts: `/app/layout.tsx`
- Components: `/components/ui/`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables (DATABASE_URL, Square keys, Vercel Blob token)
4. Deploy

```bash
# Build command (automatic)
pnpm build
```

## TODO / Future Enhancements

- [ ] Admin dashboard for order management
- [ ] Email notifications with Resend
- [ ] Customer accounts and order history
- [ ] Design preview/proofing system
- [ ] Automated shipping label generation
- [ ] Product reviews and ratings
- [ ] Discount codes and promotions
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Inventory management

## License

MIT License - feel free to use for commercial projects.

---

Built with Next.js, TypeScript, Neon, Square, and Vercel Blob.
