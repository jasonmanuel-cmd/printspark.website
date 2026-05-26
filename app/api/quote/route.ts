import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, productId, quantity, description } = body;

    if (!name || !email || !phone || !productId || !quantity || !description) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    console.log("Quote request:", { name, email, phone, company, productId, quantity, description });

    return NextResponse.json({
      success: true,
      message: "Quote request received. We'll send you a detailed quote within 24 hours.",
    });
  } catch (error) {
    console.error("Quote request error:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
