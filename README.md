# PrintFlow - Professional Print-on-Demand Platform

A complete, production-ready print-on-demand e-commerce platform built with Next.js 14, TypeScript, Supabase, and Stripe.

## Features

### Customer-Facing
- **Product Catalog** - 9 different printing products (business cards, flyers, posters, banners, t-shirts, brochures, postcards, stickers, yard signs)
- **Real-time Price Calculator** - Instant quotes based on quantity, options, and design services
- **File Upload System** - Drag-and-drop design file upload with validation
- **Shopping Cart** - Persistent cart with Zustand state management
- **Stripe Checkout** - Secure payment processing
- **Order Tracking** - Real-time order status tracking
- **Custom Quote Requests** - Form for bulk orders and special requests
- **Responsive Design** - Mobile-first, fully responsive UI

### Business Features
- **Automated Order Management** - Order creation, status updates, tracking
- **Design File Storage** - Supabase storage for customer uploads
- **Webhook Integration** - Stripe webhooks for payment notifications
- **Email Notifications** - Customer confirmations and updates (ready to integrate)
- **Shipping Calculator** - Dynamic shipping cost calculation
- **Tax Calculation** - Automatic sales tax computation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **File Storage**: Supabase Storage
- **Email**: Resend (optional)

## Project Structure

```
print-shack-website/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts          # Create Stripe checkout session
│   │   ├── orders/route.ts            # Order CRUD operations
│   │   ├── shipping/calculate/route.ts # Shipping cost calculation
│   │   └── webhooks/stripe/route.ts   # Stripe webhook handler
│   ├── products/
│   │   ├── [id]/page.tsx              # Product detail page
│   │   └── page.tsx                   # Products listing
│   ├── checkout/page.tsx              # Checkout flow
│   ├── track/page.tsx                 # Order tracking
│   ├── contact/page.tsx               # Contact form
│   ├── quote/page.tsx                 # Custom quote request
│   ├── layout.tsx                     # Root layout with header/footer
│   └── page.tsx                       # Homepage
├── components/
│   ├── ui/                            # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   └── label.tsx
│   ├── Header.tsx                     # Site header with cart
│   ├── Footer.tsx                     # Site footer
│   ├── ProductCard.tsx                # Product display card
│   ├── PriceCalculator.tsx            # Dynamic price calculator
│   └── FileUpload.tsx                 # File upload component
├── lib/
│   ├── constants.ts                   # Products, pricing, business info
│   ├── types.ts                       # TypeScript type definitions
│   ├── utils.ts                       # Helper functions
│   ├── supabase.ts                    # Supabase client & queries
│   ├── stripe.ts                      # Stripe configuration
│   └── store.ts                       # Zustand state stores
└── supabase-schema.sql                # Database schema
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Stripe account

### 1. Clone and Install

```bash
git clone <repository-url>
cd print-shack-website
pnpm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database schema:
   - Go to SQL Editor in Supabase Dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the SQL
3. Create a storage bucket:
   - Go to Storage in Supabase Dashboard
   - The schema already creates the bucket, but verify it exists
   - Bucket name: `design-files`

### 3. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard → Developers → API keys
3. Set up a webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen to:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Optional)
RESEND_API_KEY=re_...
FROM_EMAIL=orders@printflow.co
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
Create a Stripe checkout session
```json
{
  "items": CartItem[],
  "shippingAddress": ShippingAddress,
  "shippingMethod": "standard" | "express" | "overnight",
  "customerEmail": string
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

### POST `/api/webhooks/stripe`
Handle Stripe webhook events

## Customization

### Update Business Info
Edit `/lib/constants.ts`:
```typescript
export const BUSINESS_INFO = {
  name: "PrintFlow",
  tagline: "Professional Printing, Delivered Nationwide",
  email: "orders@printflow.co",
  support: "support@printflow.co",
  phone: "(888) 555-7746",
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
3. Add environment variables
4. Deploy

```bash
# Build command (automatic)
pnpm build

# Deploy
vercel --prod
```

### Other Platforms

The app works on any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- Self-hosted

## Testing Stripe Webhooks Locally

Use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
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

## Contributing

This is a production-ready starting point. Customize and extend as needed for your business.

## License

MIT License - feel free to use for commercial projects.

## Support

For questions or issues:
- Email: orders@printflow.co
- Phone: (888) 555-7746

---

Built with Next.js, TypeScript, Supabase, and Stripe.
