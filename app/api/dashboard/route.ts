import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";
import Booking from "@/lib/mongodb/models/booking";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    let token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    const userId = payload.userId;
    const bookings = await Booking.find({ user: userId }).lean();
    const totalBookings: number = bookings.length;
    const upcomingTrips: number = bookings.filter(
      (item) => item.status === "upcoming"
    ).length;
    const paymentsDone = bookings
      .filter((item) => item.paymentStatus === "paid")
      .reduce((sum, item) => sum + (item.paymentDetails?.amount || 0), 0);

    const pendingPayments = bookings
      .filter((item) => item.paymentStatus === "pending")
      .reduce((sum, item) => sum + (item.paymentDetails?.amount || 0), 0);

    return NextResponse.json({
      totalBookings,
      upcomingTrips,
      paymentsDone,
      pendingPayments,
    });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
