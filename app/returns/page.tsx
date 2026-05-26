import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
          <p className="text-xl text-gray-600">
            We stand behind every order with our satisfaction guarantee
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Guarantee</CardTitle>
              <CardDescription>100% satisfaction or we make it right</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                At PrintSpark, we're committed to delivering exceptional quality. If something
                isn't right, we'll fix it — whether that means a reprint, a refund, or another
                solution that works for you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li><strong>Defects & Errors:</strong> If your order has a printing defect, color issue, or error on our part, we'll reprint or refund at no cost.</li>
                <li><strong>Damage:</strong> If your order arrives damaged, contact us within 48 hours with photos for a replacement.</li>
                <li><strong>Design Issues:</strong> We perform a pre-flight check on all files, but final approval of design accuracy is the customer's responsibility. Please carefully review proofs.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Request a Return or Refund</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-gray-600 list-decimal list-inside">
                <li>Contact us within 7 days of receiving your order</li>
                <li>Provide your order number and a description of the issue</li>
                <li>Include photos if reporting damage or defects</li>
                <li>Our team will review and respond within 24 hours</li>
                <li>We'll arrange a reprint, refund, or replacement</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Non-Returnable Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Custom-printed items that were produced exactly to your specifications and are not
                defective are generally not returnable. This includes orders where design proofs
                were approved before production.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Need to start a return?</h3>
              <p className="text-gray-600 mb-4">Contact our support team and we'll take care of you.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:support@printspark.website">Email Us</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
