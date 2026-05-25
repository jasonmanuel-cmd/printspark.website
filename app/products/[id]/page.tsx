"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/constants";
import { useCartStore } from "@/lib/store";
import { CartItem } from "@/lib/types";
import { PriceCalculator } from "@/components/PriceCalculator";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const product = PRODUCTS.find((p) => p.id === params.id);
  const [cartConfig, setCartConfig] = useState<CartItem | null>(null);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!cartConfig) return;

    const itemToAdd: CartItem = {
      ...cartConfig,
      designFile: designFile
        ? {
            name: designFile.name,
            url: URL.createObjectURL(designFile),
            size: designFile.size,
          }
        : undefined,
    };

    addItem(itemToAdd);
    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Info */}
          <div>
            {/* Product Image */}
            <div className="aspect-square bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
              <Package className="h-32 w-32 text-gray-400" />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-xl text-gray-600 mb-6">
                {product.longDescription}
              </p>

              {/* Key Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Fast Turnaround</h3>
                    <p className="text-gray-600">
                      {product.turnaroundDays} business day{product.turnaroundDays !== 1 ? "s" : ""} production time
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Premium Quality</h3>
                    <p className="text-gray-600">
                      Professional-grade materials and printing
                    </p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                  <CardDescription>Product details and requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Configuration & Order */}
          <div className="space-y-6">
            {/* Price Calculator */}
            <PriceCalculator product={product} onConfigChange={setCartConfig} />

            {/* File Upload */}
            {product.requiresDesign && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Design</CardTitle>
                  <CardDescription>
                    Upload your print-ready design file
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFileSelect={setDesignFile}
                    onFileRemove={() => setDesignFile(null)}
                  />
                </CardContent>
              </Card>
            )}

            {/* Add to Cart Button */}
            <div className="sticky top-24">
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.requiresDesign && !designFile && !cartConfig?.designService}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Added to Cart!
                  </>
                ) : (
                  "Add to Cart"
                )}
              </Button>

              {product.requiresDesign && !designFile && !cartConfig?.designService && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Please upload a design or select a design service
                </p>
              )}

              <div className="mt-4 space-y-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    handleAddToCart();
                    setTimeout(() => router.push("/checkout"), 500);
                  }}
                  disabled={product.requiresDesign && !designFile && !cartConfig?.designService}
                >
                  Buy Now
                </Button>

                <Button size="lg" variant="ghost" className="w-full" asChild>
                  <Link href={`/quote?product=${product.id}`}>
                    Request Custom Quote
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
