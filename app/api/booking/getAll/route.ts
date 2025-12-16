import { NextRequest, NextResponse } from "next/server";
import Booking from "@/lib/mongodb/models/booking";
import connectDB from "@/lib/mongodb/connection";
import "@/lib/mongodb/models/ToursAndActivity";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  let token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Authorization token required" },
      { status: 401 }
    );
  }
  const payload = verifyToken(token);
  const userId = payload.userId;
  console.log("userId------", payload);
  await connectDB();

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 10;
  const searchTerm = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const filters = url.searchParams.get("filters") || "";
  console.log("searchTerm------", searchTerm);

  const query: any = {};
  if (payload.role === "user") {
    query.user = userId;
  } else if (payload.role === "vendor") {
    query.vendor = userId;
  }

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
        "in-progress",
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
