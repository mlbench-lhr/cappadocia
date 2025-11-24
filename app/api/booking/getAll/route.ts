import { NextRequest, NextResponse } from "next/server";
import Booking from "@/lib/mongodb/models/booking";
import connectDB from "@/lib/mongodb/connection";
import "@/lib/mongodb/models/ToursAndActivity";

export async function GET(req: NextRequest) {
  await connectDB();

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 10;
  const searchTerm = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const filters = url.searchParams.get("filters") || "";

  const query: any = {};

  if (searchTerm) {
    query.$or = [
      { bookingId: { $regex: searchTerm, $options: "i" } },
      { "activity.title": { $regex: searchTerm, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }
  if (filters) {
    const filterArray = filters
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    if (filterArray.length > 0) {
      const validStatuses = [
        "pending",
        "upcoming",
        "completed",
        "cancelled",
        "missed",
      ];
      const validFilters = filterArray.filter((f) => validStatuses.includes(f));
      if (validFilters.length > 0) {
        query.status = { $in: validFilters };
      }
    }
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Booking.find(query)
      .populate("activity")
      .populate("vendor")
      .populate("user")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Booking.countDocuments(query),
  ]);

  return NextResponse.json({
    data: items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
