// /api/stripe/account-status
import { createOnboardingLink } from "@/lib/utils/stripeConnnect";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { stripeAccountId } = await req.json();
    if (!stripeAccountId)
      return Response.json({ error: "Missing accountId" }, { status: 400 });
    let onboardingLink = await createOnboardingLink(stripeAccountId);
    return Response.json({
      onboardingLink,
    });
  } catch (err) {
    return Response.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
