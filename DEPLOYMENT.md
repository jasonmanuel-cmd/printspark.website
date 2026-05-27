# PrintSpark Deployment Guide

This guide will walk you through deploying your PrintSpark print-on-demand platform to production.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Neon account
- Square account
- Vercel account (recommended) or another hosting platform

## Step 1: Database Setup (Neon)

### 1.1 Create Neon Project

1. Go to [neon.tech](https://neon.tech) and sign in
2. Click "New Project"
3. Set project name: `printspark-prod`
4. Choose a region close to your customers
5. Wait for the project to be provisioned

### 1.2 Run Database Schema

1. In your Neon dashboard, open the SQL Editor
2. Open `neon-schema.sql` from your project
3. Copy and paste the entire contents
4. Click "Run" to execute the schema
5. Verify all tables were created

### 1.3 Get Your Neon Connection String

1. Go to Project Dashboard → Connection Details
2. Copy the connection string (PSQL format)
3. Format: `postgresql://user:pass@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require`

## Step 2: Square Setup

### 2.1 Get API Keys

1. Go to [developer.squareup.com](https://developer.squareup.com)
2. Create or select your application
3. Navigate to Credentials tab
4. Copy:
   - Application ID (`NEXT_PUBLIC_SQUARE_APPLICATION_ID`)
   - Access Token (`SQUARE_ACCESS_TOKEN`)
5. Note your Location ID from the Locations tab (`SQUARE_LOCATION_ID`)

### 2.2 Configure Webhook

1. Go to Webhooks tab
2. Click "Add webhook"
3. Endpoint URL: `https://your-domain.com/api/webhooks/square`
4. Subscribe to events:
   - `payment.created`
   - `payment.updated`
   - `refund.created`
5. Copy the Webhook Signature Key (`SQUARE_WEBHOOK_SIGNATURE_KEY`)

## Step 3: Deployment (Vercel)

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Framework Preset: Next.js (auto-detected)

### 3.2 Configure Environment Variables

Add the following environment variables:

```env
# Neon
DATABASE_URL=postgresql://user:pass@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require

# Square
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-...
SQUARE_ACCESS_TOKEN=EAAAl...
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=L...
SQUARE_WEBHOOK_SIGNATURE_KEY=...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional: Email
RESEND_API_KEY=re_...
FROM_EMAIL=hello@printspark.website
```

### 3.3 Deploy

1. Click "Deploy"
2. Wait for build to complete (~3-5 minutes)
3. Your site will be live at `https://your-project.vercel.app`

## Step 4: Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `printspark.website`)
3. Follow DNS configuration instructions

### 4.2 Update Webhook URL

1. Go back to Square Developer Dashboard → Webhooks
2. Edit your webhook endpoint
3. Update URL to: `https://your-domain.com/api/webhooks/square`

### 4.3 Update Environment Variables

1. In Vercel, update `NEXT_PUBLIC_APP_URL` to your custom domain
2. Redeploy

## Step 5: Testing

### 5.1 Test Square Integration

1. Square test card numbers work in sandbox mode
2. Complete a test order
3. Verify order appears in Neon database
4. Check webhook delivery in Square Developer Dashboard

### 5.2 Test File Uploads

1. Create a test order with a design file
2. Verify file uploads to Vercel Blob
3. Check file size limits work (max 50MB)

### 5.3 Test Order Tracking

1. Use the order number from test order
2. Go to `/track` page
3. Enter order number and email
4. Verify order details display correctly

## Step 6: Go Live

### 6.1 Switch to Production Square

1. In Square Developer Dashboard, create production credentials
2. Update environment variables in Vercel
3. Redeploy

### 6.2 Enable Production Features

- Set up email notifications (configure Resend API key)
- Configure production logging and monitoring
- Set up analytics (Google Analytics, Plausible, etc.)
- Enable error tracking (Sentry, LogRocket)

## Step 7: Ongoing Maintenance

### 7.1 Monitor Orders

- Check Neon dashboard daily for new orders
- Set up email notifications for new orders
- Review design files and approve/reject

### 7.2 Update Order Status

Use the API:
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

Neon provides automated backups — check the Backup section in your project dashboard.

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
- [ ] `DATABASE_URL` is kept secret
- [ ] `SQUARE_ACCESS_TOKEN` is kept secret
- [ ] Square webhooks use signature verification
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
- Check Square webhook signing secret
- Review webhook delivery logs in Square Developer Dashboard
- Ensure endpoint is POST-only

### Orders Not Saving

- Check `DATABASE_URL` is correct
- Verify database schema is up to date
- Review API route logs

### File Uploads Failing

- Verify Vercel Blob token is configured
- Check file size (must be under 50MB)
- Verify allowed file types

## Support

For issues or questions:
- Check the main README.md
- Review API documentation
- Check error logs in Vercel

---

Last updated: 2026-05-27
