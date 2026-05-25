"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { ShippingAddress } from "@/lib/types";
import { calculatePriceQuote, formatCurrency, getProductById } from "@/lib/utils";
import { SHIPPING_RATES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Trash2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, shippingMethod, setShippingMethod, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    email: "",
  });

  const quote = items.length > 0 ? calculatePriceQuote(items, shippingMethod) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress,
          shippingMethod,
          customerEmail: shippingAddress.email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild>
            <a href="/products">Browse Products</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Where should we send your order?</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        value={shippingAddress.firstName}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
                        value={shippingAddress.lastName}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      value={shippingAddress.company}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, company: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={shippingAddress.email}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input
                      id="address1"
                      required
                      value={shippingAddress.address1}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address1: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                    <Input
                      id="address2"
                      value={shippingAddress.address2}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address2: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        required
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        required
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        required
                        value={shippingAddress.zipCode}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="pt-4">
                    <Label>Shipping Method *</Label>
                    <Select value={shippingMethod} onValueChange={(value: any) => setShippingMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SHIPPING_RATES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.name} - Starting at {formatCurrency(value.baseRate)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 pb-4 border-b">
                  {items.map((item, index) => {
                    const product = getProductById(item.productId);
                    const variant = product?.variants.find((v) => v.id === item.variantId);
                    const option = product?.options.find((o) => o.id === item.optionId);

                    return (
                      <div key={index} className="flex justify-between items-start gap-2">
                        <div className="flex-grow">
                          <p className="font-medium text-sm">{product?.name}</p>
                          <p className="text-xs text-gray-600">
                            {variant?.quantity} units • {option?.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">
                            {formatCurrency(
                              (variant?.price || 0) + (option?.price || 0)
                            )}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeItem(item.productId, item.variantId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                {quote && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>{formatCurrency(quote.subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping:</span>
                      <span>{formatCurrency(quote.shipping)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span>{formatCurrency(quote.tax)}</span>
                    </div>

                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatCurrency(quote.total)}</span>
                    </div>

                    <p className="text-xs text-gray-500 pt-2">
                      Estimated delivery: {quote.estimatedDelivery}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
