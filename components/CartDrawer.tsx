"use client";

import { useCartStore, useUIStore } from "@/lib/store";
import { getProductById, formatCurrency, calculateCartSubtotal } from "@/lib/utils";
import { Button } from "./ui/button";
import { X, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export function CartDrawer() {
  const { items, removeItem } = useCartStore();
  const { cartDrawerOpen, setCartDrawerOpen } = useUIStore();

  const subtotal = calculateCartSubtotal(items);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (cartDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [cartDrawerOpen]);

  if (!cartDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => setCartDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            <span className="text-sm text-gray-500">({items.length})</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCartDrawerOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">
                Add some products to get started
              </p>
              <Button asChild onClick={() => setCartDrawerOpen(false)}>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => {
                const product = getProductById(item.productId);
                const variant = product?.variants.find((v) => v.id === item.variantId);
                const option = product?.options.find((o) => o.id === item.optionId);

                if (!product || !variant) return null;

                const itemPrice = (variant.price + (option?.price || 0));

                return (
                  <div
                    key={`${item.productId}-${item.variantId}-${index}`}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Product Image Placeholder */}
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        Quantity: {variant.quantity}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        {option?.name || "Standard"}
                      </p>
                      {item.designService && (
                        <p className="text-xs text-blue-600">
                          + Design Service
                        </p>
                      )}
                      <p className="font-bold text-blue-600 mt-2">
                        {formatCurrency(itemPrice)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => removeItem(item.productId, item.variantId)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Subtotal:</span>
              <span className="text-blue-600">{formatCurrency(subtotal)}</span>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Shipping and tax calculated at checkout
            </p>

            <div className="space-y-2">
              <Button
                size="lg"
                className="w-full"
                asChild
                onClick={() => setCartDrawerOpen(false)}
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => setCartDrawerOpen(false)}
                asChild
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
