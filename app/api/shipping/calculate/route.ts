import { NextRequest, NextResponse } from "next/server";
import { calculateShipping } from "@/lib/utils";
import { CartItem } from "@/lib/types";
import { SHIPPING_RATES } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, method }: { items: CartItem[]; method: "standard" | "express" | "overnight" } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    if (!method || !["standard", "express", "overnight"].includes(method)) {
      return NextResponse.json(
        { error: "Valid shipping method is required" },
        { status: 400 }
      );
    }

    const shippingCost = calculateShipping(items, method);
    const shippingInfo = SHIPPING_RATES[method];

    return NextResponse.json({
      cost: shippingCost,
      method,
      name: shippingInfo.name,
      estimatedDays:
        method === "overnight" ? "1" :
        method === "express" ? "2-3" :
        "5-7",
    });
  } catch (error) {
    console.error("Shipping calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate shipping" },
      { status: 500 }
    );
  }
}

// GET - Get all available shipping methods
export async function GET() {
  try {
    const methods = Object.entries(SHIPPING_RATES).map(([key, value]) => ({
      id: key,
      name: value.name,
      baseRate: value.baseRate,
      perLb: value.perLb,
    }));

    return NextResponse.json({ methods });
  } catch (error) {
    console.error("Error fetching shipping methods:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping methods" },
      { status: 500 }
    );
  }
}
