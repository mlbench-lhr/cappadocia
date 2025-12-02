// pages/api/send-payout.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { stripeAccountId, amount, currency } = await req.json();
    console.log("---------------", { stripeAccountId, amount, currency });

    if (!stripeAccountId || !amount || !currency) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Create a transfer to the connected account
    const transfer = await stripe.transfers.create({
      amount, // in cents
      currency,
      destination: stripeAccountId,
    });

    return NextResponse.json({ message: "Transfer successful", transfer });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
