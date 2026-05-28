import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            Our terms and conditions for using PrintSpark services
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              By accessing or using PrintSpark services, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>2. Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              PrintSpark provides custom printing services including but not limited to business cards,
              flyers, posters, apparel, and marketing materials. We reserve the right to
              refuse service for any order that violates our content policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>3. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You retain all rights to the designs and content you upload. By submitting designs,
              you warrant that you have the legal right to reproduce them. PrintSpark is not
              responsible for copyright or trademark violations in customer-provided designs.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>4. Pricing & Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              All prices are listed in USD. Payment is due at the time of order. We accept major
              credit cards through Square. Prices are subject to change without notice, but
              quoted prices on confirmed orders are guaranteed.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>5. Shipping & Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Estimated delivery dates are provided in good faith but are not guaranteed. PrintSpark
              is not responsible for delays caused by shipping carriers or unforeseen circumstances.
              Risk of loss passes to the customer upon delivery to the carrier.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>6. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              PrintSpark's liability is limited to the value of the affected order. We are not
              liable for indirect, incidental, or consequential damages arising from the use
              of our products or services.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">
              Last updated: January 2026. For questions about these terms, contact{" "}
              <a href="mailto:support@printspark.website" className="text-blue-600 hover:underline">
                support@printspark.website
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
