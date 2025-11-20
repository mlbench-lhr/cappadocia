import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY =
  process.env.RESEND_API_KEY || "re_UnbMd7D2_NrJ4Kq9gbN3B8U2ceKHpu1HV";
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@cappadociaplatform.com";
const EMAIL_TO = process.env.EMAIL_TO as string;

const resend = new Resend(RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!RESEND_API_KEY || !EMAIL_TO) {
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 }
      );
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: email, // This allows you to reply directly to the sender
      subject: "Contact Us",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Email error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
