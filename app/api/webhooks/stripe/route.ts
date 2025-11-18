import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.log("[Stripe Webhook] Incoming request");

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    console.error("Missing Stripe keys");
    return NextResponse.json(
      { error: "Missing Stripe environment variables" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecret);
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature header" },
      { status: 400 }
    );
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    console.log("[Stripe Webhook] Event type:", event.type);
  } catch (err: any) {
    console.error("Invalid signature:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("=== DEMO MODE ===");
        console.log("Checkout completed");
        console.log("Session ID:", session.id);
        console.log("Customer:", session.customer_details);
        console.log("Metadata:", session.metadata);

        // Fetch line items for demo purposes
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(
            session.id,
            { limit: 50 }
          );
          console.log("Line items:", lineItems.data);
        } catch (err) {
          console.log("Line item lookup failed (demo safe).");
        }

        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;

        console.log("=== DEMO MODE ===");
        console.log("Payment Intent succeeded");
        console.log("PI ID:", pi.id);
        console.log("Amount received:", pi.amount_received);
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Processing error:", err.message);
    return NextResponse.json(
      { error: err.message || "Processing error" },
      { status: 500 }
    );
  }
}
