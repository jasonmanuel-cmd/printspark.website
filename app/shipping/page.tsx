import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SHIPPING_RATES, BUSINESS_INFO } from "@/lib/constants";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-xl text-gray-600">
            Fast, reliable shipping right to your door
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Methods & Rates</CardTitle>
              <CardDescription>We offer three shipping options to fit your timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(SHIPPING_RATES).map(([key, rate]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg mb-1">{rate.name}</h3>
                    <p className="text-gray-600">Base rate: ${rate.baseRate.toFixed(2)} + ${rate.perLb.toFixed(2)}/lb</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Free standard shipping on orders over $100 within the contiguous United States.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing & Delivery Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-1">Production Time</h3>
                <p className="text-gray-600">
                  Most orders are produced within 3-5 business days. Specific turnaround times
                  are listed on each product page.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-1">Transit Time</h3>
                <p className="text-gray-600">
                  Standard: 5-7 business days | Express: 2-3 business days | Overnight: 1 business day
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li><strong>Shipping within:</strong> Contiguous United States</li>
                <li><strong>Free shipping:</strong> On standard orders over $100</li>
                <li><strong>Tracking:</strong> All orders include tracking information via email</li>
                <li><strong>Delivery:</strong> Weekday delivery to residential and commercial addresses</li>
                <li><strong>PO Boxes:</strong> We ship to PO Boxes via USPS</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Have questions about shipping?</h3>
              <p className="text-gray-600 mb-4">Contact us and we'll help you out.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
