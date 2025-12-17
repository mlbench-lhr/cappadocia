import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    const body = await req.json();
    const {
      items = [],
      deliveryFee = 0,
      serviceFee = 0,
      total = 0,
      currency = "eur",
      bookingId, // ⭐ Add bookingId to the request body
      customerEmail, // Optional: pre-fill customer email
    } = body;

    // Validation
    if (!items.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId is required" },
        { status: 400 }
      );
    }

    const origin = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    const orderNumber = `ORDER-${Date.now()}`;

    // Build line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item: any) => ({
        price_data: {
          currency,
          product_data: {
            name: item.title || "Item",
            description: item.description || undefined,
          },
          unit_amount: Math.round(Number(item.price || 1) * 100),
        },
        quantity: item.quantity || 1,
      }));

    if (deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency,
          product_data: { name: "Delivery Fee" },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    if (serviceFee > 0) {
      line_items.push({
        price_data: {
          currency,
          product_data: { name: "Service Fee" },
          unit_amount: Math.round(serviceFee * 100),
        },
        quantity: 1,
      });
    }

    // Success and cancel URLs
    const successUrl = `${origin}/bookings`;
    const cancelUrl = `${origin}/bookings`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail || undefined,
      metadata: {
        bookingId, // ⭐ Critical: Pass bookingId in metadata
        orderNumber,
        total: String(total || 0),
      },
    });

    return NextResponse.json({
      id: session.id,
      url: session.url,
      bookingId,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
