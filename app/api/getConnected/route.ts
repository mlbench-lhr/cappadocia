// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserSubscription from "@/lib/mongodb/models/UserSubscription";

const MONGO_URI = process.env.MONGODB_URI as string;
const BREVO_API_KEY = process.env.BREVO_API_KEY as string;
const EMAIL_FROM = process.env.EMAIL_FROM || "mlbenchpvtltd@gmail.com";

// Helper: ensure required env vars exist (optional runtime guard)
if (!MONGO_URI) {
  console.error("MONGODB_URI is not defined in env");
}
if (!BREVO_API_KEY) {
  console.error("BREVO_API_KEY is not defined in env");
}

async function connectToDatabase(): Promise<void> {
  // 1 = connected
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && email.includes("@");
}

async function sendBrevoEmail(payload: {
  to: string;
  subject: string;
  htmlContent: string;
  senderName?: string;
}) {
  const body = {
    sender: { email: EMAIL_FROM, name: payload.senderName || "Cappadocia" },
    to: [{ email: payload.to }],
    subject: payload.subject,
    htmlContent: payload.htmlContent,
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const email = body?.email;

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!MONGO_URI || !BREVO_API_KEY) {
      console.error("Missing required env vars");
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 }
      );
    }

    await connectToDatabase();

    const existing = await UserSubscription.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json(
        { message: "Already subscribed" },
        { status: 409 }
      );
    }

    const newSub = new UserSubscription({ email });
    await newSub.save();
    console.log("New subscription saved:", email);

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 40px;">
    <h1 style="color: #000;">Cappadocia Activities & Tours</h1>  
    <h2 style="color: #000;">Welcome to <span style="color: #b32053;">Cappadocia</span>!</h2>
    <p style="color: #000;">Dear Traveler,</p>
    <p style="color: #000;">
      Welcome to Cappadocia’s official activities and tours marketplace! Discover amazing balloon rides, cultural tours, and outdoor adventures — all bookable in one place.
    </p>
    <p style="color: #000;">
      Manage your bookings, explore trusted operators, and enjoy secure payments — your journey starts here!
    </p>
    <hr />
    <p style="font-size: 12px; color:#000;">
      <a href="https://cappadocia-alpha.vercel.app" style="color: #555;">www.cappadocia-alpha.vercel.app</a>
    </p>
  </div>
`;

    // Prepare requests (run in parallel)
    const teamEmailPromise = sendBrevoEmail({
      to: "Info@stelomic.com",
      subject: "New Newsletter Subscriber",
      htmlContent: `<p>A new user subscribed: <strong>${email}</strong></p>`,
      senderName: "Cappadocia",
    });

    const userEmailPromise = sendBrevoEmail({
      to: email,
      subject: "Welcome to Cappadocia!",
      htmlContent,
      senderName: "Cappadocia",
    });

    const [teamRes, userRes] = await Promise.all([
      teamEmailPromise,
      userEmailPromise,
    ]);

    console.log("Team email response:", teamRes);
    console.log("User email response:", userRes);

    // If Brevo returned an error for either, log but still consider subscription saved.
    if (!teamRes.ok) {
      console.error("Team email failed:", teamRes.status, teamRes.data);
    }
    if (!userRes.ok) {
      console.error("User email failed:", userRes.status, userRes.data);
    }

    return NextResponse.json({
      success: true,
      message: "Subscription successful",
    });
  } catch (err: unknown) {
    console.error("Error handling subscription:", err);
    const message =
      err instanceof Error && err.message
        ? err.message
        : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
