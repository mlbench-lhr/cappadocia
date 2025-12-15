import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const startOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    const startOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const revenuePipeline = (start: Date, end: Date) => [
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: "$paymentDetails.amount" },
        },
      },
    ];

    const commissionPipeline = (start: Date, end: Date) => [
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "vendor",
          foreignField: "_id",
          as: "vendorDoc",
        },
      },
      { $addFields: { vendorDoc: { $arrayElemAt: ["$vendorDoc", 0] } } },
      {
        $addFields: {
          commissionPct: {
            $ifNull: ["$vendorDoc.vendorDetails.commission", 15],
          },
        },
      },
      {
        $project: {
          amount: "$paymentDetails.amount",
          commissionPct: 1,
        },
      },
      {
        $group: {
          _id: null,
          amount: {
            $sum: {
              $multiply: ["$amount", { $divide: ["$commissionPct", 100] }],
            },
          },
        },
      },
    ];

    const [currentRevenueAgg, lastRevenueAgg, currentCommissionAgg, lastCommissionAgg] =
      await Promise.all([
        Booking.aggregate(revenuePipeline(startOfCurrentMonth, startOfNextMonth)),
        Booking.aggregate(revenuePipeline(startOfLastMonth, startOfCurrentMonth)),
        Booking.aggregate(commissionPipeline(startOfCurrentMonth, startOfNextMonth)),
        Booking.aggregate(commissionPipeline(startOfLastMonth, startOfCurrentMonth)),
      ]);

    const currentRevenue = Number(currentRevenueAgg[0]?.amount || 0);
    const lastRevenue = Number(lastRevenueAgg[0]?.amount || 0);
    const currentCommission = Number(currentCommissionAgg[0]?.amount || 0);
    const lastCommission = Number(lastCommissionAgg[0]?.amount || 0);

    const calcChange = (cur: number, prev: number) => {
      if (prev > 0) return ((cur - prev) / prev) * 100;
      if (cur > 0) return 100;
      return 0;
    };

    const revenueChange = calcChange(currentRevenue, lastRevenue);
    const commissionChange = calcChange(currentCommission, lastCommission);

    const currentNet = currentRevenue - currentCommission;
    const lastNet = lastRevenue - lastCommission;
    const netChange = calcChange(currentNet, lastNet);

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: {
          amount: Math.round(currentRevenue * 100) / 100,
          percentageChange: Math.abs(Number(revenueChange.toFixed(2))),
          incremented: currentRevenue >= lastRevenue,
        },
        platformCommission: {
          amount: Math.round(currentCommission * 100) / 100,
          percentageChange: Math.abs(Number(commissionChange.toFixed(2))),
          incremented: currentCommission >= lastCommission,
        },
        vendorNet: {
          amount: Math.round(currentNet * 100) / 100,
          percentageChange: Math.abs(Number(netChange.toFixed(2))),
          incremented: currentNet >= lastNet,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

