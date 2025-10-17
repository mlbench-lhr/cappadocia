import { type NextRequest, NextResponse } from "next/server";
import { GoogleOAuth } from "@/lib/auth/google";
import connectDB from "@/lib/mongodb/connection";
import User from "@/lib/mongodb/models/User";
import { generateToken } from "@/lib/auth/jwt";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;

    if (error) {
      console.error("Google OAuth error:", error);
      return NextResponse.redirect(
        `${baseUrl}/auth/login?error=oauth_cancelled`
      );
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/auth/login?error=oauth_error`);
    }

    const googleOAuth = new GoogleOAuth();

    // Exchange code for tokens
    const tokens = await googleOAuth.exchangeCodeForTokens(code);

    // Get user info from Google
    const googleUser = await googleOAuth.getUserInfo(tokens.access_token);

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ email: googleUser.email }, { googleId: googleUser.id }],
    });

    if (user) {
      // Update existing user with Google ID if not set
      if (!user.googleId) {
        user.googleId = googleUser.id;
        user.avatar = googleUser.picture;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        email: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        googleId: googleUser.id,
        avatar: googleUser.picture,
        isEmailVerified: googleUser.verified_email,
        role: "user",
        // No password needed for Google OAuth users
      });

      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user);

    const redirectUrl = new URL(`${baseUrl}/auth/callback`);
    redirectUrl.searchParams.set("token", token);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error: any) {
    console.error("Google OAuth callback error:", error);
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
    return NextResponse.redirect(`${baseUrl}/auth/login?error=oauth_error`);
  }
}
