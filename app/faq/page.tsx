import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    category: "Orders & Pricing",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse our products, configure your options (quantity, finish, etc.), upload your design, and proceed to checkout. We'll review your files and start production after payment is confirmed.",
      },
      {
        q: "Can I get a sample before ordering?",
        a: "Yes, we offer sample packs for most products. Contact our sales team to request samples before placing a bulk order.",
      },
      {
        q: "Do you offer bulk discounts?",
        a: "Absolutely! Larger quantities get better per-unit pricing. You can see the price breaks for each product in the product configurator. For orders over 1,000 units, contact us for custom pricing.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Square.",
      },
    ],
  },
  {
    category: "Design & Files",
    questions: [
      {
        q: "What file formats do you accept?",
        a: "We accept PDF, AI, EPS, PSD, JPG, and PNG files. For best results, submit high-resolution files at 300 DPI minimum.",
      },
      {
        q: "Do I need to include bleed in my design?",
        a: "Yes, we recommend 0.125 inches of bleed on all sides. Our upload system will verify your files and let you know if adjustments are needed.",
      },
      {
        q: "Can you help me design my print materials?",
        a: "Yes! We offer three design service tiers: Basic Design Assistance ($49) for minor adjustments, Custom Design ($149) for professional designs from scratch, and Rush Design ($99) for fast-track projects.",
      },
      {
        q: "How do I ensure my colors print correctly?",
        a: "Design in CMYK color mode for best results. Our team performs a pre-flight check on all files and will flag any color space issues before production begins.",
      },
    ],
  },
  {
    category: "Production & Shipping",
    questions: [
      {
        q: "How long does production take?",
        a: "Production times vary by product — most items are completed in 3-5 business days. You can find the specific turnaround time on each product page.",
      },
      {
        q: "What shipping options are available?",
        a: "We offer Standard (5-7 business days), Express (2-3 business days), and Overnight shipping within the US. Free standard shipping on orders over $100.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently we ship within the United States. Contact us for international shipping inquiries and we'll do our best to accommodate.",
      },
      {
        q: "How can I track my order?",
        a: "Use our Track Order page with your order number and email address. You'll also receive tracking information via email when your order ships.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We stand behind our quality with a 100% satisfaction guarantee. If there's a defect or error on our part, we'll reprint or refund. See our Returns & Refunds page for details.",
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled before they enter production. Once production begins, cancellation may not be possible. Contact us immediately if you need to cancel.",
      },
      {
        q: "What if my order arrives damaged?",
        a: "If your order arrives damaged, please contact us within 48 hours with photos of the damage. We'll arrange a reprint or refund right away.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about ordering from PrintSpark
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {category.questions.map((faq, i) => (
                  <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                    <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">
              We're here to help. Reach out to our friendly support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/shipping">Shipping Information</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
