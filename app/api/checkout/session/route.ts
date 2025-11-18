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
    } = body;

    // DEMO safeguard
    if (!items.length) {
      return NextResponse.json(
        { error: "No items provided (demo mode)" },
        { status: 400 }
      );
    }

    const origin = req.nextUrl.origin;
    const orderNumber = `DEMO-${Date.now()}`;

    // Build DEMO line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item: any) => ({
        price_data: {
          currency,
          product_data: { name: item.title || "Demo Item" },
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

    const successUrl = `${origin}/demo-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/demo-cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        demo: "true",
        orderNumber,
        total: String(total || 0),
      },
    });

    return NextResponse.json({
      id: session.id,
      url: session.url,
      demo: true,
    });
  } catch (error: any) {
    console.error("Stripe error (demo):", error);
    return NextResponse.json(
      { error: error?.message || "Failed to start checkout" },
      { status: 500 }
    );
  }
}
