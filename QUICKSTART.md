# PrintFlow - Quick Start Guide

Get your print-on-demand platform running in under 15 minutes.

## What You're Getting

A complete, production-ready print-on-demand e-commerce platform with:
- 9 ready-to-sell printing products
- Shopping cart and checkout
- Stripe payment integration
- Order tracking system
- File upload for customer designs
- Full TypeScript, Next.js 14, Supabase, and Stripe integration

## Prerequisites

```bash
Node.js 18+
pnpm (or npm/yarn)
```

## 5-Minute Local Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with temporary values for local development:
```env
# Use placeholders for local dev
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## What Works Without Setup

- Homepage with product catalog ✅
- Product detail pages ✅
- Shopping cart ✅
- Price calculator ✅
- Contact form UI ✅
- Order tracking UI ✅

## What Needs Setup

To enable full functionality:

### Required for Checkout:
1. **Supabase** - For database and file storage
2. **Stripe** - For payment processing

## 10-Minute Production Setup

### Step 1: Supabase (5 minutes)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Copy/paste contents of `supabase-schema.sql`
5. Execute
6. Copy credentials from Project Settings → API

### Step 2: Stripe (5 minutes)

1. Create account at [stripe.com](https://stripe.com)
2. Go to Developers → API keys
3. Copy test keys
4. Set up webhook at `https://your-domain.com/api/webhooks/stripe`
5. Select events: `checkout.session.completed`, `payment_intent.succeeded`
6. Copy webhook secret

### Step 3: Update Environment Variables

Update `.env.local` with real credentials.

### Step 4: Test Full Flow

1. Browse products
2. Add to cart
3. Checkout (use test card: `4242 4242 4242 4242`)
4. View order confirmation
5. Track order

## Deploy to Production (Vercel)

```bash
# 1. Push to GitHub
git push

# 2. Import in Vercel
# - Go to vercel.com
# - Import repository
# - Add environment variables
# - Deploy

# Done! Your site is live
```

## File Structure

```
print-shack-website/
├── app/                    # Next.js pages
│   ├── api/               # API routes
│   ├── products/          # Product pages
│   ├── checkout/          # Checkout flow
│   └── ...
├── components/            # React components
├── lib/                   # Core logic
│   ├── constants.ts       # Products & pricing
│   ├── stripe.ts          # Stripe config
│   ├── supabase.ts        # Database
│   └── ...
└── supabase-schema.sql    # Database schema
```

## Customization

### Change Business Info
Edit `/lib/constants.ts`:
```typescript
export const BUSINESS_INFO = {
  name: "Your Business Name",
  email: "orders@yourbusiness.com",
  // ...
};
```

### Modify Products
Edit the `PRODUCTS` array in `/lib/constants.ts`

### Update Pricing
Adjust prices in product variants and options

### Change Colors/Styling
Modify Tailwind classes in components

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm lint             # Run linter
```

## Testing Payment Flow

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires auth: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC.

## Support & Documentation

- **Full Documentation**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **File Overview**: See `FILES_CREATED.md`

## What's Included

### 9 Complete Products
1. Business Cards ($39-$169)
2. Flyers ($49-$399)
3. Posters ($29-$349)
4. Vinyl Banners ($79-$299)
5. Custom T-Shirts ($149-$1749)
6. Brochures ($99-$599)
7. Postcards ($59-$599)
8. Custom Stickers ($79-$699)
9. Yard Signs ($149-$899)

### Features
- Real-time price calculator
- File upload with validation
- Shopping cart with persistence
- Stripe checkout
- Order tracking
- Custom quotes
- Contact forms
- Responsive design

## Troubleshooting

**Port already in use?**
```bash
pnpm dev --port 3001
```

**Build errors?**
```bash
rm -rf .next
pnpm install
pnpm build
```

**Environment variables not working?**
- Restart dev server after changing `.env.local`
- Variables starting with `NEXT_PUBLIC_` are client-side
- Other variables are server-side only

## Next Steps

1. ✅ Get local dev running
2. ✅ Set up Supabase
3. ✅ Configure Stripe
4. ✅ Test complete order flow
5. ✅ Deploy to Vercel
6. ✅ Add custom domain
7. ✅ Go live!

---

**Questions?** Check the full README.md for detailed documentation.

**Ready to deploy?** See DEPLOYMENT.md for step-by-step instructions.
