import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";
import Booking from "@/lib/mongodb/models/booking";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );

    const payload = verifyToken(token);
    const vendorId = payload.userId;

    const bookings = await Booking.find({
      vendor: vendorId,
      paymentStatus: "paid",
    }).lean();

    // ---------------- MONTH LIST ----------------
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyTotals = months.map((m) => ({ month: m, amount: 0 }));

    // ---------------- CHART DATA ----------------
    bookings.forEach((b) => {
      const date = new Date(b.createdAt);
      const monthIndex = date.getMonth();
      const amount = b.paymentDetails?.amount || 0;
      monthlyTotals[monthIndex].amount += amount;
    });

    // ---------------- TOTAL REVENUE ----------------
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.paymentDetails?.amount || 0),
      0
    );

    // ---------------- % CHANGE ----------------
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const lastMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;

    const currentMonthRevenue = monthlyTotals[currentMonthIndex].amount;
    const lastMonthRevenue = monthlyTotals[lastMonthIndex].amount;

    const percentChange =
      lastMonthRevenue === 0
        ? 100
        : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    const percentageChange = Number(percentChange.toFixed(2));
    const incremented = currentMonthRevenue >= lastMonthRevenue;

    // ---------------- RESPONSE ----------------
    return NextResponse.json({
      totalRevenue,
      percentageChange,
      incremented,
      chartData: monthlyTotals,
    });
  } catch (error) {
    console.error("Revenue graph API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
