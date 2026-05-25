# PrintFlow Deployment Guide

This guide will walk you through deploying your PrintFlow print-on-demand platform to production.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Supabase account
- Stripe account
- Vercel account (recommended) or another hosting platform

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Set project name: `printflow-prod`
5. Generate a strong database password (save it securely)
6. Choose a region close to your customers
7. Wait for the project to be provisioned (~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Open `supabase-schema.sql` from your project
3. Copy and paste the entire contents
4. Click "Run" to execute the schema
5. Verify all tables were created in the Table Editor

### 1.3 Get Your Supabase Credentials

1. Go to Project Settings → API
2. Copy the following:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Anon/Public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Service Role key (`SUPABASE_SERVICE_ROLE_KEY`) - Keep this SECRET!

### 1.4 Set Up Storage Bucket

The schema creates the bucket automatically, but verify:
1. Go to Storage in Supabase
2. Confirm `design-files` bucket exists
3. If not, create it manually with:
   - Name: `design-files`
   - Public: No
   - File size limit: 52428800 (50MB)

## Step 2: Stripe Setup

### 2.1 Get API Keys

1. Go to [stripe.com/dashboard](https://dashboard.stripe.com)
2. Navigate to Developers → API keys
3. Copy:
   - Publishable key (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
   - Secret key (`STRIPE_SECRET_KEY`)

### 2.2 Configure Webhook

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Description: "PrintFlow order webhooks"
5. Events to send:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
6. Click "Add endpoint"
7. Copy the Signing Secret (`STRIPE_WEBHOOK_SECRET`)

## Step 3: Deployment (Vercel)

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Framework Preset: Next.js (auto-detected)
5. Root Directory: `./` (leave default)

### 3.2 Configure Environment Variables

Add the following environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional: Email
RESEND_API_KEY=re_...
FROM_EMAIL=orders@printflow.co
```

### 3.3 Deploy

1. Click "Deploy"
2. Wait for build to complete (~3-5 minutes)
3. Your site will be live at `https://your-project.vercel.app`

## Step 4: Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `printflow.com`)
3. Follow DNS configuration instructions

### 4.2 Update Webhook URL

1. Go back to Stripe Dashboard → Webhooks
2. Edit your webhook endpoint
3. Update URL to: `https://your-domain.com/api/webhooks/stripe`

### 4.3 Update Environment Variables

1. In Vercel, update `NEXT_PUBLIC_APP_URL` to your custom domain
2. Redeploy

## Step 5: Testing

### 5.1 Test Stripe Integration

1. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
2. Complete a test order
3. Verify order appears in Supabase database
4. Check webhook delivery in Stripe Dashboard

### 5.2 Test File Uploads

1. Create a test order with a design file
2. Verify file uploads to Supabase Storage
3. Check file size limits work (max 50MB)

### 5.3 Test Order Tracking

1. Use the order number from test order
2. Go to `/track` page
3. Enter order number and email
4. Verify order details display correctly

## Step 6: Go Live

### 6.1 Switch to Production Stripe

1. In Stripe Dashboard, toggle from Test Mode to Live Mode
2. Get new API keys (they start with `pk_live_` and `sk_live_`)
3. Update environment variables in Vercel
4. Redeploy

### 6.2 Enable Production Features

- Set up email notifications (configure Resend API key)
- Configure production logging and monitoring
- Set up analytics (Google Analytics, Plausible, etc.)
- Enable error tracking (Sentry, LogRocket)

## Step 7: Ongoing Maintenance

### 7.1 Monitor Orders

- Check Supabase dashboard daily for new orders
- Set up email notifications for new orders
- Review design files and approve/reject

### 7.2 Update Order Status

Use the API or create an admin dashboard:
```bash
# Update order status
PATCH /api/orders
{
  "orderId": "uuid",
  "status": "in-production",
  "notes": "Started printing"
}
```

### 7.3 Backup Database

1. In Supabase Dashboard → Settings → Database
2. Enable daily backups (included in Pro plan)
3. Download manual backups weekly

## Alternative Deployment Options

### Netlify

1. Connect repository
2. Build command: `pnpm build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

### Railway

1. Create new project from GitHub
2. Add environment variables
3. Deploy automatically

### Self-Hosted

1. Build: `pnpm build`
2. Start: `pnpm start`
3. Use PM2 or similar for process management
4. Set up nginx reverse proxy
5. Configure SSL with Let's Encrypt

## Security Checklist

- [ ] All API keys are in environment variables (not code)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is kept secret
- [ ] `STRIPE_SECRET_KEY` is kept secret
- [ ] Stripe webhooks use signature verification
- [ ] Row Level Security (RLS) enabled on Supabase tables
- [ ] File upload size limits enforced
- [ ] HTTPS/SSL configured
- [ ] CSP headers configured
- [ ] Rate limiting implemented

## Troubleshooting

### Build Fails

- Check all environment variables are set
- Verify TypeScript compilation: `pnpm tsc --noEmit`
- Check build logs for specific errors

### Webhook Not Receiving Events

- Verify webhook URL is correct and accessible
- Check Stripe webhook signing secret
- Review webhook delivery logs in Stripe Dashboard
- Ensure endpoint is POST-only

### Orders Not Saving

- Check Supabase service role key is correct
- Verify database schema is up to date
- Review API route logs
- Check RLS policies

### File Uploads Failing

- Verify Supabase storage bucket exists
- Check file size (must be under 50MB)
- Verify allowed file types
- Check storage policies

## Support

For issues or questions:
- Check the main README.md
- Review API documentation
- Check error logs in Vercel
- Review Supabase logs

---

Last updated: 2026-05-25
