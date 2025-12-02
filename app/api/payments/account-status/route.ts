// /api/stripe/account-status
import { NextRequest } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { stripeAccountId } = await req.json();

    if (!stripeAccountId)
      return Response.json({ error: "Missing accountId" }, { status: 400 });

    const account = await stripe.accounts.retrieve(stripeAccountId);

    return Response.json(account);
  } catch (err) {
    return Response.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
