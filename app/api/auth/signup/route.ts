import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/User"
import { hashPassword } from "@/lib/auth/password"
import { generateOTP, getOTPExpiryTime } from "@/lib/auth/otp"
import { sendVerificationEmail } from "@/lib/email/email-service"
import { z } from "zod"

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    const emailVerificationOTP = generateOTP()
    const emailVerificationOTPExpires = getOTPExpiryTime()

    // Create user
    const user = new User({
      email: validatedData.email,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      isEmailVerified: false,
      emailVerificationOTP: emailVerificationOTP,
      emailVerificationOTPExpires: emailVerificationOTPExpires,
    })

    await user.save()

    try {
      await sendVerificationEmail(user.email, emailVerificationOTP)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Continue with signup process even if email fails
    }

    // Return success message without token
    return NextResponse.json({
      message: "Account created successfully! Please check your email for the verification OTP code.",
      requiresVerification: true,
    })
  } catch (error: any) {
    console.error("Signup error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
