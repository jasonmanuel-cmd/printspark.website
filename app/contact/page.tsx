"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/constants";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Contact form error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Have questions? We're here to help. Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a
                      href={`tel:${BUSINESS_INFO.phone}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {BUSINESS_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href={`mailto:${BUSINESS_INFO.email}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors break-all"
                    >
                      {BUSINESS_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">{BUSINESS_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-600">{BUSINESS_INFO.hours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href="/track"
                  className="block text-blue-600 hover:underline"
                >
                  Track Your Order
                </a>
                <a
                  href="/faq"
                  className="block text-blue-600 hover:underline"
                >
                  Frequently Asked Questions
                </a>
                <a
                  href="/shipping"
                  className="block text-blue-600 hover:underline"
                >
                  Shipping Information
                </a>
                <a
                  href="/returns"
                  className="block text-blue-600 hover:underline"
                >
                  Returns & Refunds
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-8 rounded-lg text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Send className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p>Thank you for contacting us. We'll respond to your inquiry shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
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
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <textarea
                        id="message"
                        required
                        rows={6}
                        className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      <Send className="mr-2 h-5 w-5" />
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* FAQ Preview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Common Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">What file formats do you accept?</h4>
                  <p className="text-sm text-gray-600">
                    We accept PDF, AI, EPS, PSD, JPG, and PNG files. For best results, please
                    submit high-resolution files (300 DPI minimum).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">How long does production take?</h4>
                  <p className="text-sm text-gray-600">
                    Most products have a 3-5 business day turnaround time. Rush options are
                    available for faster delivery.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Do you offer design services?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! We offer basic design assistance, custom design services, and rush
                    design options. Select your preference when ordering.
                  </p>
                </div>

                <Button variant="outline" asChild className="w-full">
                  <a href="/faq">View All FAQs</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
