# Square Payment Setup Guide

Your PrintFlow platform now uses **Square** for payment processing! Square is perfect for print businesses with lower fees and easy POS integration.

## 🎯 Why Square Instead of Stripe?

**Better Rates:**
- Square: 2.6% + 10¢ per transaction
- Stripe: 2.9% + 30¢ per transaction
- **Save ~$40 per $1,000 in sales!**

**Print Business Benefits:**
- Integrated POS system (if you expand to retail)
- Better for physical goods/local businesses
- Simpler setup for beginners
- Can accept in-person payments with Square Reader
- Great for craft fairs, trade shows, retail expansion

## 🚀 Setup Steps (15 Minutes)

### Step 1: Create Square Account

1. Go to [squareup.com/signup](https://squareup.com/signup)
2. Enter your business info
3. Verify your email
4. Complete business verification (tax ID, address)

**Free Account Includes:**
- Online payments
- Unlimited transactions
- Payment processing
- Basic analytics
- Customer directory

### Step 2: Get Your Credentials

#### A. Application ID & Location ID

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Click "+" to create a new application
3. Name it "PrintFlow" (or your business name)
4. You'll see:
   - **Application ID** (starts with "sq0idp-" for production or "sandbox-sq0idb-" for sandbox)
   - Copy this → `NEXT_PUBLIC_SQUARE_APPLICATION_ID`

5. Click on your app → "Locations" tab
6. Copy your **Location ID** (starts with "L")
   - Copy this → `NEXT_PUBLIC_SQUARE_LOCATION_ID` and `SQUARE_LOCATION_ID`

#### B. Access Token

1. In your app, go to "OAuth" tab
2. Scroll to "Personal Access Token"
3. For **Sandbox** (testing):
   - Click "Sandbox Test Credentials"
   - Copy the Sandbox Access Token
   - This is `SQUARE_ACCESS_TOKEN`
   - Set `SQUARE_ENVIRONMENT=sandbox`

4. For **Production** (real money):
   - Click "Production Credentials"
   - Copy the Production Access Token
   - This is `SQUARE_ACCESS_TOKEN`
   - Set `SQUARE_ENVIRONMENT=production`

#### C. Webhook Signature Key

1. In your app, go to "Webhooks" tab
2. Click "Add Webhook Subscription"
3. Enter your webhook URL:
   ```
   https://your-domain.com/api/webhooks/square
   ```
4. Select events to subscribe to:
   - ✅ payment.created
   - ✅ payment.updated
   - ✅ refund.created
   - ✅ refund.updated
5. Click "Save"
6. Copy the **Signature Key** that appears
   - This is `SQUARE_WEBHOOK_SIGNATURE_KEY`

### Step 3: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```bash
# Square - Get from developer.squareup.com
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-XXXXXXXXX
NEXT_PUBLIC_SQUARE_LOCATION_ID=LXXXXXXXXX
SQUARE_ACCESS_TOKEN=EAAAl... (long token)
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=LXXXXXXXXX
SQUARE_WEBHOOK_SIGNATURE_KEY=your-signature-key

# For production, change to:
# NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-XXXXXXXXX (no "sandbox-")
# SQUARE_ENVIRONMENT=production
```

### Step 4: Test Payments (Sandbox Mode)

**Test Card Numbers:**
```
Card: 4111 1111 1111 1111 (Visa)
Card: 5105 1051 0510 5100 (Mastercard)  
Card: 3782 822463 10005 (Amex)
Exp: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

**Test the Flow:**
1. Add products to cart
2. Go to checkout
3. Enter test card
4. Complete payment
5. Check order in admin dashboard
6. Verify webhook received (check Vercel logs)

### Step 5: Go Live (Production Mode)

When ready for real payments:

1. Update environment variables:
   ```bash
   SQUARE_ENVIRONMENT=production
   NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-... (production ID)
   SQUARE_ACCESS_TOKEN=EAAA... (production token)
   ```

2. Redeploy in Vercel

3. Complete Square account verification:
   - Add bank account for payouts
   - Verify business identity
   - Set payout schedule (daily, weekly)

4. Test with a real $1 transaction

5. Refund the test transaction

6. You're live! 🎉

## 💳 Payment Flow

**How It Works:**

1. **Customer adds items to cart**
2. **Goes to checkout page**
3. **Square Web SDK loads** (client-side)
4. **Customer enters card info** (never touches your server!)
5. **Square tokenizes card** (generates secure token)
6. **Token sent to your API** (`/api/checkout`)
7. **Your server processes payment** with Square API
8. **Order created** and customer redirected to success page
9. **Webhooks handle async updates** (payment status changes)

## 🔒 Security Features

✅ **PCI Compliance** - Square handles all card data  
✅ **Tokenization** - Card numbers never hit your server  
✅ **Webhook verification** - HMAC signature validation  
✅ **3D Secure** - Extra authentication for high-risk payments  
✅ **Fraud detection** - Square's built-in fraud tools  

## 📊 Square Dashboard Features

**What You Get:**
- Real-time sales tracking
- Customer directory
- Refund management
- Dispute handling
- Payout schedule
- Tax reporting
- Receipt sending
- Analytics & reports

## 💰 Pricing Breakdown

**Online Payments:**
- 2.9% + 30¢ per transaction (if not verified)
- 2.6% + 10¢ per transaction (after verification)
- No monthly fees
- No setup fees
- No hidden fees

**In-Person Payments** (if you get Square Reader):
- 2.6% + 10¢ per swipe/dip
- 3.5% + 15¢ per manually entered card
- Square Reader: $49 (one-time)

**Instant Deposits:**
- 1.5% per deposit
- Money in minutes instead of 1-2 days

## 🆘 Troubleshooting

### Payment Fails with "Invalid Location ID"
- Make sure `SQUARE_LOCATION_ID` matches your actual location
- Check you're using the right environment (sandbox vs production)

### Webhook Not Receiving Events
- Verify webhook URL is publicly accessible (not localhost)
- Check signature key is correct
- Look at Vercel function logs for errors
- Test webhook in Square Dashboard → Webhooks → Send Test Event

### "Application Not Found"
- Verify `NEXT_PUBLIC_SQUARE_APPLICATION_ID` is correct
- Make sure it matches your environment (sandbox starts with "sandbox-")
- Check the app isn't disabled in Square Dashboard

### Payment Succeeds But Order Shows "Pending"
- Check webhook is configured and receiving events
- Look for errors in Vercel function logs (`/api/webhooks/square`)
- Verify `payment.updated` event is subscribed

### Testing in Sandbox Doesn't Work
- Make sure all credentials are from **Sandbox** section
- Use test card numbers (real cards won't work in sandbox)
- Check `SQUARE_ENVIRONMENT=sandbox`

## 📞 Support

**Square Support:**
- Developer docs: [developer.squareup.com](https://developer.squareup.com)
- Email: developers@squareup.com
- Phone: 1-855-700-6000

**Common Questions:**
- [Square API Reference](https://developer.squareup.com/reference/square)
- [Web SDK Guide](https://developer.squareup.com/docs/web-payments/overview)
- [Webhook Events](https://developer.squareup.com/docs/webhooks/overview)

## 🎉 You're All Set!

Your PrintFlow platform now has:
- ✅ Lower payment processing fees (save $$)
- ✅ Square's trusted payment infrastructure
- ✅ Option to expand to in-person sales
- ✅ Better rates than Stripe

**Next Steps:**
1. Set up Square account (15 min)
2. Add credentials to Vercel (5 min)
3. Test with sandbox (10 min)
4. Go live and start making money! 💰

---

**Cost Comparison Example:**

If you do $10,000/month in sales:
- **With Stripe:** $290 + $300 = $590/month in fees
- **With Square:** $260 + $100 = $360/month in fees
- **You save: $230/month = $2,760/year!** 🎉
