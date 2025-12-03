import { NextRequest, NextResponse } from "next/server";
import Booking from "@/lib/mongodb/models/booking";
import Payments from "@/lib/mongodb/models/Payments";
import { verifyToken } from "@/lib/auth/jwt";
import connectDB from "@/lib/mongodb/connection";
import Reviews from "@/lib/mongodb/models/Reviews";
import { ReportsCardsData } from "@/app/(VendorLayout)/vendor/(Protected)/reports/page";
import mongoose from "mongoose";

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
          vendor: new mongoose.Types.ObjectId(userId), // Convert to ObjectId
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
          vendor: new mongoose.Types.ObjectId(userId), // Convert to ObjectId
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
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    sixtyDaysAgo.setHours(0, 0, 0, 0);

    // Revenue change - FIXED: Use correct date field (createdAt or requestedAt)
    const [recentRevenue, previousRevenue] = await Promise.all([
      Payments.aggregate([
        {
          $match: {
            vendor: new mongoose.Types.ObjectId(userId),
            paymentStatus: "paid",
            createdAt: { $gte: thirtyDaysAgo }, // Using createdAt from schema
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
            vendor: new mongoose.Types.ObjectId(userId),
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
        : recentRevenueValue > 0
        ? 100
        : 0;

    // Bookings change - FIXED: Only count completed/upcoming bookings
    const [recentBookings, previousBookings] = await Promise.all([
      Booking.countDocuments({
        vendor: userId,
        status: { $in: ["upcoming", "completed"] },
        createdAt: { $gte: thirtyDaysAgo },
      }),
      Booking.countDocuments({
        vendor: userId,
        status: { $in: ["upcoming", "completed"] },
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      }),
    ]);

    const bookingsChange =
      previousBookings > 0
        ? ((recentBookings - previousBookings) / previousBookings) * 100
        : recentBookings > 0
        ? 100
        : 0;

    // Rating change - FIXED: Handle cases with no previous reviews
    const [recentRating, previousRating] = await Promise.all([
      Reviews.aggregate([
        {
          $match: {
            vendor: new mongoose.Types.ObjectId(userId),
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
            vendor: new mongoose.Types.ObjectId(userId),
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

    const recentRatingValue = recentRating[0]?.avg || averageRating || 0;
    const previousRatingValue = previousRating[0]?.avg || averageRating || 0;

    // Calculate rating change differently
    let ratingChange = 0;
    if (previousRatingValue > 0 && recentRatingValue > 0) {
      ratingChange =
        ((recentRatingValue - previousRatingValue) / previousRatingValue) * 100;
    } else if (recentRatingValue > 0 && previousRatingValue === 0) {
      // New reviews in recent period
      ratingChange = 100;
    } else if (recentRatingValue === 0 && previousRatingValue > 0) {
      // No recent reviews but had previous ones
      ratingChange = -100;
    }

    // Format response data to match ReportsCardsData type
    const responseData: ReportsCardsData[] = [
      {
        title: `$${totalRevenue.toFixed(2)}`,
        description: "Total Revenue",
        progress: {
          value: parseFloat(Math.abs(revenueChange).toFixed(1)),
          increment: revenueChange >= 0,
        },
      },
      {
        title: totalBookings.toString(),
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
      //   {
      //     title: upcomingTrips.toString(),
      //     description: "Upcoming Trips",
      //     progress: {
      //       value: 0,
      //       increment: true,
      //     },
      //   },
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
