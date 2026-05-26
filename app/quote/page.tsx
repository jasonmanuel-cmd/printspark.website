"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRODUCTS, BUSINESS_INFO } from "@/lib/constants";
import { Calculator, Send, CheckCircle } from "lucide-react";

function QuoteContent() {
  const searchParams = useSearchParams();
  const preselectedProduct = searchParams.get("product") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    productId: preselectedProduct,
    quantity: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit quote request");
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          productId: "",
          quantity: "",
          description: "",
        });
      }, 5000);
    } catch (err) {
      console.error("Quote form error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Get a Custom Quote</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Need a custom order or bulk pricing? Fill out the form below and we'll send you a
            personalized quote within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quote Request Form</CardTitle>
                <CardDescription>
                  Tell us about your project and we'll prepare a custom quote
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-8 rounded-lg text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Quote Request Received!</h3>
                    <p className="mb-4">
                      Thank you for your quote request. Our team will review your requirements
                      and send you a detailed quote within 24 hours.
                    </p>
                    <p className="text-sm">
                      Check your email at <strong>{formData.email}</strong>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Contact Information</h3>

                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold text-lg">Project Details</h3>

                      <div>
                        <Label htmlFor="product">Product Type *</Label>
                        <Select
                          value={formData.productId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, productId: value })
                          }
                          required
                        >
                          <SelectTrigger id="product">
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCTS.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">Custom / Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="quantity">Estimated Quantity *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          required
                          placeholder="e.g., 1000"
                          value={formData.quantity}
                          onChange={(e) =>
                            setFormData({ ...formData, quantity: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Project Description *</Label>
                        <textarea
                          id="description"
                          required
                          rows={6}
                          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          placeholder="Please describe your project requirements, including size, materials, colors, turnaround time, and any special requests..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          The more details you provide, the more accurate your quote will be
                        </p>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      <Send className="mr-2 h-5 w-5" />
                      {loading ? "Submitting..." : "Request Quote"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">We Review Your Request</h4>
                    <p className="text-sm text-gray-600">
                      Our team carefully reviews your requirements
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">You Receive a Quote</h4>
                    <p className="text-sm text-gray-600">
                      Get a detailed quote within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Approve & Order</h4>
                    <p className="text-sm text-gray-600">
                      Review, approve, and we start production
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help Now?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Have questions about your project? Contact us directly:
                </p>

                <div className="space-y-2 text-sm">
                  <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                  <a
                    href={`mailto:${BUSINESS_INFO.email}`}
                    className="flex items-center gap-2 text-blue-600 hover:underline break-all"
                  >
                    {BUSINESS_INFO.email}
                  </a>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Need large quantities? We offer special pricing for bulk orders over 1,000 units.
                  Request a quote to get our best rates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <QuoteContent />
    </Suspense>
  );
}
