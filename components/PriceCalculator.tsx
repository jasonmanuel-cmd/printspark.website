"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/constants";
import { calculateItemPrice } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { CartItem } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface PriceCalculatorProps {
  product: Product;
  onConfigChange?: (config: CartItem) => void;
}

export function PriceCalculator({ product, onConfigChange }: PriceCalculatorProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0].id);
  const [selectedOption, setSelectedOption] = useState(product.options[0].id);
  const [designService, setDesignService] = useState<"basic" | "custom" | "rush" | null>(null);

  const cartItem: CartItem = {
    productId: product.id,
    variantId: selectedVariant,
    optionId: selectedOption,
    quantity: 1,
    designService,
  };

  const totalPrice = calculateItemPrice(cartItem);

  const variant = product.variants.find((v) => v.id === selectedVariant);
  const option = product.options.find((o) => o.id === selectedOption);

  useEffect(() => {
    onConfigChange?.(cartItem);
  }, [selectedVariant, selectedOption, designService]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Your Order</CardTitle>
        <CardDescription>
          Customize your product options and see the price update in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quantity Selection */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Select value={selectedVariant} onValueChange={setSelectedVariant}>
            <SelectTrigger id="quantity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {product.variants.map((variant) => (
                <SelectItem key={variant.id} value={variant.id}>
                  {variant.quantity} - {formatCurrency(variant.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            Select the quantity you need
          </p>
        </div>

        {/* Options Selection */}
        <div className="space-y-2">
          <Label htmlFor="options">Options</Label>
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger id="options">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {product.options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                  {option.price > 0 && ` (+${formatCurrency(option.price)})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            Choose your preferred finish or material
          </p>
        </div>

        {/* Design Service (Optional) */}
        {product.requiresDesign && (
          <div className="space-y-2">
            <Label htmlFor="design">Design Service (Optional)</Label>
            <Select
              value={designService || "none"}
              onValueChange={(value) =>
                setDesignService(value === "none" ? null : (value as "basic" | "custom" | "rush"))
              }
            >
              <SelectTrigger id="design">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No design service</SelectItem>
                <SelectItem value="basic">
                  Basic Design Assistance (+$49)
                </SelectItem>
                <SelectItem value="custom">
                  Custom Design (+$149)
                </SelectItem>
                <SelectItem value="rush">
                  Rush Design 24hrs (+$99)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Need help with your design? We offer professional design services
            </p>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Product Price:</span>
            <span className="font-medium">{formatCurrency(variant?.price || 0)}</span>
          </div>

          {option && option.price > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{option.name}:</span>
              <span className="font-medium">+{formatCurrency(option.price)}</span>
            </div>
          )}

          {designService && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Design Service:</span>
              <span className="font-medium">
                +{formatCurrency(
                  designService === "basic" ? 49 :
                  designService === "custom" ? 149 :
                  99
                )}
              </span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total:</span>
            <span className="text-blue-600">{formatCurrency(totalPrice)}</span>
          </div>

          <p className="text-xs text-gray-500 pt-2">
            * Shipping and tax calculated at checkout
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
