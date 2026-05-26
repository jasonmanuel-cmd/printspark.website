"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, CheckCircle, Clock, Truck, MapPin } from "lucide-react";
import { ORDER_STATUS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/orders?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Order not found");
      }

      const { order } = await response.json();
      setOrder(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case "design-review":
        return <Search className="h-6 w-6 text-blue-600" />;
      case "in-production":
        return <Package className="h-6 w-6 text-purple-600" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-green-600" />;
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      default:
        return <Package className="h-6 w-6 text-gray-600" />;
    }
  };

  const statusSteps = [
    { key: "pending", label: "Order Placed" },
    { key: "design-review", label: "Design Review" },
    { key: "in-production", label: "In Production" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex((step) => step.key === status);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
          <p className="text-xl text-gray-600">
            Enter your order details to check the status
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Lookup</CardTitle>
            <CardDescription>
              Enter your order number and email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  placeholder="PF12345678901"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can find this in your confirmation email
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                <Search className="mr-2 h-5 w-5" />
                {loading ? "Searching..." : "Track Order"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Status */}
        {order && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order #{order.order_number}</CardTitle>
                    <CardDescription>
                      Placed on {formatDateTime(order.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="font-semibold">{ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Status Timeline */}
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500"
                    style={{
                      width: `${(getCurrentStepIndex(order.status) / (statusSteps.length - 1)) * 100}%`,
                    }}
                  />

                  <div className="relative flex justify-between">
                    {statusSteps.map((step, index) => {
                      const isCurrent = step.key === order.status;
                      const isPast = getCurrentStepIndex(order.status) > index;

                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                              isCurrent || isPast
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-white border-gray-300 text-gray-400"
                            }`}
                          >
                            {isPast ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <span className="text-sm font-bold">{index + 1}</span>
                            )}
                          </div>
                          <p className="text-xs text-center mt-2 max-w-[80px]">{step.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tracking Information */}
                {order.tracking_number && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Truck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Tracking Number</h4>
                        <p className="text-blue-800 font-mono text-sm">{order.tracking_number}</p>
                        {order.estimated_delivery && (
                          <p className="text-sm text-blue-700 mt-2">
                            Estimated delivery: {order.estimated_delivery}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      Shipping Address
                    </h4>
                    <div className="text-gray-600 text-sm">
                      {(() => {
                        const addr = typeof order.shipping_address === 'string'
                          ? JSON.parse(order.shipping_address)
                          : order.shipping_address;
                        return (
                          <>
                            <p>{addr.firstName} {addr.lastName}</p>
                            {addr.company && <p>{addr.company}</p>}
                            <p>{addr.address1}</p>
                            {addr.address2 && <p>{addr.address2}</p>}
                            <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Order Notes */}
                {order.notes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-gray-600 text-sm">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  If you have questions about your order, please contact our support team.
                </p>
                <Button variant="outline" asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
