"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const [displayOrderNumber, setDisplayOrderNumber] = useState<string | null>(null);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
    if (orderNumber) {
      setDisplayOrderNumber(orderNumber);
    }
  }, [orderNumber, clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-green-800">
            Thank you for your order. We've received your payment and will begin processing your order shortly.
          </p>
        </div>

        {orderNumber && displayOrderNumber && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>
                Your order has been successfully placed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-1">Order Number</p>
                <p className="text-2xl font-bold text-blue-600 font-mono">{displayOrderNumber}</p>
                <p className="text-sm text-blue-700 mt-2">
                  Save this number to track your order
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Confirmation Email</h4>
                    <p className="text-sm text-gray-600">
                      We've sent a confirmation email with your order details and receipt.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Package className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">What's Next?</h4>
                    <p className="text-sm text-gray-600">
                      Our team will review your design and begin production.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <h4 className="font-semibold mb-1">Design Review</h4>
                  <p className="text-sm text-gray-600">
                    Our design team will review your files to ensure they meet print specifications.
                    We'll contact you if any adjustments are needed.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <h4 className="font-semibold mb-1">Production</h4>
                  <p className="text-sm text-gray-600">
                    Once approved, your order goes into production. Most orders are completed within 3-5 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <h4 className="font-semibold mb-1">Shipping</h4>
                  <p className="text-sm text-gray-600">
                    Your order will be shipped to the address you provided. You'll receive a tracking number via email.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</div>
                <div>
                  <h4 className="font-semibold mb-1">Delivery</h4>
                  <p className="text-sm text-gray-600">
                    Your professionally printed products arrive at your door, ready to use!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button size="lg" asChild>
            <Link href={displayOrderNumber ? `/track?orderNumber=${displayOrderNumber}` : "/track"}>
              <Package className="mr-2 h-5 w-5" />
              Track Your Order
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" asChild>
                <a href="mailto:support@printspark.website">Email Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:(888)774-6877">Call Us</a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Form</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
