import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUSINESS_INFO } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            How we collect, use, and protect your information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">
              We collect information you provide directly to us:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Name, email address, phone number, and shipping address</li>
              <li>Company name and billing information</li>
              <li>Design files and project specifications</li>
              <li>Order history and preferences</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Communicate about your orders and provide support</li>
              <li>Send order confirmations, shipping updates, and tracking information</li>
              <li>Improve our products and services</li>
              <li>Send occasional marketing communications (opt-out anytime)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We use Square to process payments securely. Your payment details are handled
              directly by Square and are never stored on our servers. Square is PCI-DSS
              compliant and uses industry-standard encryption.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your personal information,
              including encryption in transit and at rest, access controls, and regular security audits.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              For questions about this privacy policy or to request data deletion, contact us at{" "}
              <a href={`mailto:${BUSINESS_INFO.email}`} className="text-blue-600 hover:underline">
                {BUSINESS_INFO.email}
              </a>
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">
              Last updated: January 2026
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
