import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";

export async function GET(req: NextRequest) {
  await connectDB();

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 7;
  const searchTerm = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category");
  const filterDate = url.searchParams.get("date"); // Expected format: ISO date string

  const query: any = {};
  query.active = true;
  query.isVerified = true;

  // Text search filter
  if (searchTerm) {
    query.title = { $regex: searchTerm, $options: "i" };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Date filter - check if any slot matches the date and has availability
  if (filterDate) {
    const searchDate = new Date(filterDate);
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    query.slots = {
      $elemMatch: {
        startDate: { $lte: endOfDay },
        endDate: { $gte: startOfDay },
        seatsAvailable: { $gt: 0 },
      },
    };
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    ToursAndActivity.find(query)
      .populate("vendor")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    ToursAndActivity.countDocuments(query),
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
