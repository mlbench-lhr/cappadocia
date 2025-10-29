// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserSubscription from "@/lib/mongodb/models/UserSubscription";
import { Resend } from "resend";

const MONGO_URI = process.env.MONGODB_URI as string;
const RESEND_API_KEY =
  (process.env.RESEND_API_KEY as string) ||
  "re_UnbMd7D2_NrJ4Kq9gbN3B8U2ceKHpu1HV";
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@cappadociaplatform.com";

const resend = new Resend(RESEND_API_KEY);

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

async function sendResendEmail(to: string, subject: string, html: string) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("data--------", data);
    return { ok: true, data };
  } catch (err) {
    console.error("Resend email error:", err);
    return { ok: false, error: err };
  }
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

    if (!MONGO_URI || !RESEND_API_KEY) {
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
      <a href="https://cappadociaplatform.com" style="color: #555;">www.cappadociaplatform.com</a>
    </p>
  </div>
`;

    const [userRes] = await Promise.all([
      sendResendEmail(email, "Welcome to Cappadocia!", htmlContent),
    ]);

    if (!userRes.ok) console.error("User email failed:", userRes.error);

    return NextResponse.json({
      success: true,
      message: "Subscription successful",
    });
  } catch (err: unknown) {
    console.error("Error handling subscription:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
