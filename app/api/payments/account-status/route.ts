// /api/stripe/account-status
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { stripeAccountId } = await req.json();

    if (!stripeAccountId)
      return Response.json({ error: "Missing accountId" }, { status: 400 });

    const account = await stripe.accounts.retrieve(stripeAccountId);

    return NextResponse.json({
      connected: true,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      transfers_active: account.capabilities?.transfers === "active",
      sellerCountry: account.country,
    });
  } catch (err) {
    return Response.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
