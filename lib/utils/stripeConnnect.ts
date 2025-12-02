import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createConnectedAccount() {
  const account = await stripe.accounts.create({
    type: "express",
    country: "NL",
    capabilities: {
      transfers: { requested: true },
      card_payments: { requested: true },
    },
  });

  return account.id;
}

export async function createOnboardingLink(accountId: string) {
  console.log(
    "https://cappadocia-alpha.vercel.app----",
    "https://cappadocia-alpha.vercel.app",
    accountId
  );

  let link: any = "";
  try {
    link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `https://cappadocia-alpha.vercel.app/vendor/payments`,
      return_url: `https://cappadocia-alpha.vercel.app/vendor/payments`,
      type: "account_onboarding",
    });
  } catch (error) {
    console.log("createOnboardingLink----------", error);
  }

  return link.url;
}
