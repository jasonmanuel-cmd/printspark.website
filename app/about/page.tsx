import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Truck, Award, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">About PrintSpark</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Print Fast. Look Amazing. We're a nationwide print-on-demand service delivering
            premium quality printing with fast turnaround times.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h2>Our Story</h2>
          <p>
            PrintSpark was founded with a simple mission: make professional printing accessible,
            fast, and reliable for businesses of all sizes. We believe that great print materials
            shouldn't require weeks of waiting or premium agency prices.
          </p>
          <p>
            From business cards to banners, t-shirts to trade show displays, we handle it all
            under one roof with a commitment to quality that's earned us thousands of happy customers.
          </p>

          <h2>Why Choose PrintSpark?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast Turnaround</h3>
            <p className="text-gray-600">
              Most orders ship within 3-5 business days. Need it faster? Express and overnight
              options are available for rush orders.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600">
              Professional-grade printing on quality materials with state-of-the-art equipment
              and rigorous quality control at every step.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Satisfaction Guaranteed</h3>
            <p className="text-gray-600">
              We stand behind every order with a 100% satisfaction guarantee. If you're not
              happy, we'll make it right.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
            <p className="text-gray-600">
              Our friendly team is here to help from design to delivery. We'll guide you
              through every step of the process.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/products">Browse Our Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
