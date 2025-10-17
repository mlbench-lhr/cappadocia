import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import User from "@/lib/mongodb/models/User";
import { isOTPExpired } from "@/lib/auth/otp";
import { z } from "zod";

const verifyResetOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = verifyResetOTPSchema.parse(body);

    const user = await User.findOne({
      email: validatedData.email,
      resetPasswordOTP: validatedData.otp,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (
      !user.resetPasswordOTPExpires ||
      isOTPExpired(user.resetPasswordOTPExpires)
    ) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "OTP verified successfully",
    });
  } catch (error: any) {
    console.error("OTP verification error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
