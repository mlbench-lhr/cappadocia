import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import User, { IUser } from "@/lib/mongodb/models/User";
import { hashPassword } from "@/lib/auth/password";
import { generateOTP, getOTPExpiryTime } from "@/lib/auth/otp";
import { sendVerificationEmail } from "@/lib/email/email-service";
import { z } from "zod";
import {
  createConnectedAccount,
  createOnboardingLink,
} from "@/lib/utils/stripeConnnect";

export const CoordinatesSchema = z.object({
  lat: z
    .number()
    .min(-90, { message: "lat must be >= -90" })
    .max(90, { message: "lat must be <= 90" }),
  lng: z
    .number()
    .min(-180, { message: "lng must be >= -180" })
    .max(180, { message: "lng must be <= 180" }),
});

export const AddressSchema = z.object({
  address: z.string().min(1, { message: "address is required" }),
  coordinates: CoordinatesSchema.nullable(),
});

export const PaymentInfoSchema = z.object({
  ibanNumber: z.string().min(1, { message: "IBAN is required" }),
  bankName: z.string().min(1, { message: "bankName is required" }),
  accountHolderName: z
    .string()
    .min(1, { message: "accountHolderName is required" }),
  currency: z.string().min(1, { message: "currency is required" }),
});

const VendorDetailsSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "password must be at least 8 characters" }),
    companyName: z.string().min(1, { message: "companyName is required" }),
    contactPersonName: z
      .string()
      .min(1, { message: "contactPersonName is required" }),
    businessEmail: z
      .string()
      .email({ message: "businessEmail must be a valid email" }),
    contactPhoneNumber: z
      .string()
      .min(5, { message: "contactPhoneNumber is required" }),
    tursabNumber: z.string().min(1, { message: "tursabNumber is required" }),
    address: AddressSchema,
    documents: z.array(z.string()), // change to z.string().url() if these are URLs
    aboutUs: z.string(),
    languages: z
      .array(z.string())
      .min(1, { message: "at least one language is required" }),
    paymentInfo: PaymentInfoSchema,
  })
  .optional();

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string(),
  vendorDetails: VendorDetailsSchema,
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("body------", body);
    const validatedData = signupSchema.parse(body);

    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({
      email: validatedData.email,
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Check if user already exists by phoneNumber
    const existingUserByPhone = await User.findOne({
      phoneNumber: validatedData.phoneNumber,
    });
    if (existingUserByPhone) {
      return NextResponse.json(
        { error: "User with this phoneNumber number already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    const emailVerificationOTP = generateOTP();
    const emailVerificationOTPExpires = getOTPExpiryTime();

    // Create user
    const user: IUser = new User({
      email: validatedData.email,
      password: hashedPassword,
      fullName: validatedData.fullName,
      phoneNumber: validatedData.phoneNumber,
      isEmailVerified: false,
      emailVerificationOTP: emailVerificationOTP,
      emailVerificationOTPExpires: emailVerificationOTPExpires,
    });
    if (validatedData.vendorDetails) {
      const stripeAccountId = await createConnectedAccount();
      user.vendorDetails = {
        ...validatedData.vendorDetails,
        stripeAccountId,
      };
      user.role = "vendor";
      await user.save();
    }
    await user.save();

    try {
      await sendVerificationEmail(user.email, emailVerificationOTP);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with signup process even if email fails
    }

    // Return success message without token
    return NextResponse.json({
      message:
        "Account created successfully! Please check your email for the verification OTP code.",
      requiresVerification: true,
    });
  } catch (error: any) {
    console.error("Signup error:", error);

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
