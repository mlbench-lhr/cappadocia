import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";
import Payments from "@/lib/mongodb/models/Payments";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import mongoose from "mongoose";

export interface BarChartItem {
  tourName: string;
  bookings: number;
  revenue: number;
}

export interface BarChartResponse {
  totalRevenue: number;
  percentageChange: number;
  incremented: boolean;
  chartData: BarChartItem[];
}

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

    // Convert userId to ObjectId
    const vendorObjectId = new mongoose.Types.ObjectId(userId);

    // Get current period (last 30 days)
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Get previous period (31-60 days ago)
    const sixtyDaysAgo = new Date(currentDate);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    sixtyDaysAgo.setHours(0, 0, 0, 0);

    // Calculate total revenue for current period (last 30 days)
    const currentRevenueData = await Payments.aggregate([
      {
        $match: {
          vendor: vendorObjectId,
          paymentStatus: "paid",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$vendorPayment" },
        },
      },
    ]);

    const currentRevenue = currentRevenueData[0]?.totalRevenue || 0;

    // Calculate total revenue for previous period (31-60 days ago)
    const previousRevenueData = await Payments.aggregate([
      {
        $match: {
          vendor: vendorObjectId,
          paymentStatus: "paid",
          createdAt: {
            $gte: sixtyDaysAgo,
            $lt: thirtyDaysAgo,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$vendorPayment" },
        },
      },
    ]);

    const previousRevenue = previousRevenueData[0]?.totalRevenue || 0;

    // Calculate percentage change
    let percentageChange = 0;
    if (previousRevenue > 0) {
      percentageChange =
        ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    } else if (currentRevenue > 0) {
      percentageChange = 100; // First time revenue
    }

    const incremented = percentageChange >= 0;

    // Get all active tours/activities for this vendor
    const vendorActivities = await ToursAndActivity.find({
      vendor: vendorObjectId,
      status: { $in: ["active", "upcoming"] }, // Only active or upcoming activities
    }).select("_id title");

    // If no activities, return empty response
    if (vendorActivities.length === 0) {
      const response: BarChartResponse = {
        totalRevenue: Math.round(currentRevenue),
        percentageChange: parseFloat(Math.abs(percentageChange).toFixed(1)),
        incremented,
        chartData: [],
      };
      return NextResponse.json(response);
    }

    // Get performance data for each activity
    const performancePromises = vendorActivities.map(async (activity) => {
      const activityId = activity._id;

      // Get bookings count for this activity
      const bookingsCount = await Booking.countDocuments({
        activity: activityId,
        vendor: vendorObjectId,
        status: { $in: ["upcoming", "completed"] },
      });

      // Skip if no bookings
      if (bookingsCount === 0) {
        return null;
      }

      // Get revenue for this activity from paid payments
      const revenueData = await Payments.aggregate([
        {
          $match: {
            activity: activityId,
            vendor: vendorObjectId,
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

      const revenue = revenueData[0]?.totalRevenue || 0;

      return {
        tourName: activity.title,
        bookings: bookingsCount,
        revenue: revenue,
      };
    });

    // Wait for all performance data
    const performanceResults = await Promise.all(performancePromises);

    // Filter out null results and activities with no revenue
    const validPerformanceData = performanceResults.filter(
      (item) => item !== null && (item.bookings > 0 || item.revenue > 0)
    ) as BarChartItem[];

    // Sort by revenue (descending) and limit to top 10
    const sortedChartData = validPerformanceData
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((item) => ({
        ...item,
        revenue: Math.round(item.revenue * 100) / 100, // Round to 2 decimal places
      }));

    // Alternative: If you want data for specific time period (last 30 days)
    // Uncomment this section if you want time-filtered data
    /*
    const timeFilteredPerformancePromises = vendorActivities.map(async (activity) => {
      const activityId = activity._id;

      // Get bookings count for last 30 days
      const recentBookings = await Booking.countDocuments({
        activity: activityId,
        vendor: vendorObjectId,
        status: { $in: ["upcoming", "completed"] },
        createdAt: { $gte: thirtyDaysAgo },
      });

      // Get revenue for last 30 days
      const recentRevenueData = await Payments.aggregate([
        {
          $match: {
            activity: activityId,
            vendor: vendorObjectId,
            paymentStatus: "paid",
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$vendorPayment" },
          },
        },
      ]);

      const recentRevenue = recentRevenueData[0]?.totalRevenue || 0;

      return {
        tourName: activity.title,
        bookings: recentBookings,
        revenue: recentRevenue,
      };
    });

    const timeFilteredResults = await Promise.all(timeFilteredPerformancePromises);
    const validTimeFilteredData = timeFilteredResults.filter(
      (item) => item !== null && (item.bookings > 0 || item.revenue > 0)
    ) as BarChartItem[];
    */

    // Prepare response
    const response: BarChartResponse = {
      totalRevenue: Math.round(currentRevenue * 100) / 100,
      percentageChange: parseFloat(Math.abs(percentageChange).toFixed(1)),
      incremented,
      chartData: sortedChartData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching bar graph data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch bar graph data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
