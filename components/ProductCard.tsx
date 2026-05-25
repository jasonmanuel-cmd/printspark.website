import Link from "next/link";
import { Product } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const maxPrice = Math.max(...product.variants.map((v) => v.price));

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="aspect-[4/3] relative rounded-lg bg-gray-100 mb-4 overflow-hidden">
          {/* Placeholder for product image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
        </div>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Starting at</span>
            <span className="text-2xl font-bold text-blue-600">
              {minPrice === maxPrice
                ? formatCurrency(minPrice)
                : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{product.turnaroundDays} day turnaround</span>
          </div>

          <div className="space-y-1">
            {product.specifications.slice(0, 3).map((spec, index) => (
              <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button asChild className="w-full">
          <Link href={`/products/${product.id}`}>View Details & Order</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/quote?product=${product.id}`}>Get Custom Quote</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
