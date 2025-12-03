// pages/api/send-payout.ts
import Payments from "@/lib/mongodb/models/Payments";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { stripeAccountId, amount, currency, payment_id } = await req.json();

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

    await Payments.updateOne(
      { _id: payment_id },
      { $set: { paymentStatus: "paid" } }
    );
    return NextResponse.json({ message: "Transfer successful", transfer });
  } catch (error: any) {
    console.log("error in accepting-----", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
