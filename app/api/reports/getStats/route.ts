import { NextRequest, NextResponse } from "next/server";
import Booking from "@/lib/mongodb/models/booking";
import Payments from "@/lib/mongodb/models/Payments";
import { verifyToken } from "@/lib/auth/jwt";
import connectDB from "@/lib/mongodb/connection";
import Reviews from "@/lib/mongodb/models/Reviews";
import { ReportsCardsData } from "@/app/(VendorLayout)/vendor/(Protected)/reports/page";

export async function GET(req: NextRequest) {
  try {
    // Get and verify token
    let token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    const userId = payload.userId;

    // Connect to database
    await connectDB();

    // Get total revenue from paid payments
    const revenueData = await Payments.aggregate([
      {
        $match: {
          vendor: userId,
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$vendorPayment" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Get total bookings count
    const totalBookings = await Booking.countDocuments({
      vendor: userId,
      status: { $in: ["upcoming", "completed"] },
    });

    // Get average rating from reviews
    const ratingData = await Reviews.aggregate([
      {
        $match: {
          vendor: userId,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const averageRating = ratingData[0]?.averageRating || 0;
    const formattedRating = averageRating ? averageRating.toFixed(1) : "0.0";

    // Get upcoming trips count
    const upcomingTrips = await Booking.countDocuments({
      vendor: userId,
      status: "upcoming",
    });

    // Calculate percentage changes (comparing last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Revenue change
    const [recentRevenue, previousRevenue] = await Promise.all([
      Payments.aggregate([
        {
          $match: {
            vendor: userId,
            paymentStatus: "paid",
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$vendorPayment" },
          },
        },
      ]),
      Payments.aggregate([
        {
          $match: {
            vendor: userId,
            paymentStatus: "paid",
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$vendorPayment" },
          },
        },
      ]),
    ]);

    const recentRevenueValue = recentRevenue[0]?.total || 0;
    const previousRevenueValue = previousRevenue[0]?.total || 0;
    const revenueChange =
      previousRevenueValue > 0
        ? ((recentRevenueValue - previousRevenueValue) / previousRevenueValue) *
          100
        : 0;

    // Bookings change
    const [recentBookings, previousBookings] = await Promise.all([
      Booking.countDocuments({
        vendor: userId,
        createdAt: { $gte: thirtyDaysAgo },
      }),
      Booking.countDocuments({
        vendor: userId,
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      }),
    ]);

    const bookingsChange =
      previousBookings > 0
        ? ((recentBookings - previousBookings) / previousBookings) * 100
        : 0;

    // Rating change
    const [recentRating, previousRating] = await Promise.all([
      Reviews.aggregate([
        {
          $match: {
            vendor: userId,
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: null,
            avg: { $avg: "$rating" },
          },
        },
      ]),
      Reviews.aggregate([
        {
          $match: {
            vendor: userId,
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: null,
            avg: { $avg: "$rating" },
          },
        },
      ]),
    ]);

    const recentRatingValue = recentRating[0]?.avg || averageRating;
    const previousRatingValue = previousRating[0]?.avg || averageRating;
    const ratingChange =
      previousRatingValue > 0
        ? ((recentRatingValue - previousRatingValue) / previousRatingValue) *
          100
        : 0;

    // Format response data to match ReportsCardsData type
    const responseData: ReportsCardsData[] = [
      {
        title: `${totalRevenue.toFixed(2)}`,
        description: "Total Revenue",
        progress: {
          value: parseFloat(Math.abs(revenueChange).toFixed(1)),
          increment: revenueChange >= 0,
        },
      },
      {
        title: totalBookings,
        description: "Total Bookings",
        progress: {
          value: parseFloat(Math.abs(bookingsChange).toFixed(1)),
          increment: bookingsChange >= 0,
        },
      },
      {
        title: formattedRating,
        description: "Average Rating",
        progress: {
          value: parseFloat(Math.abs(ratingChange).toFixed(1)),
          increment: ratingChange >= 0,
        },
      },
    ];

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching vendor stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor statistics" },
      { status: 500 }
    );
  }
}
