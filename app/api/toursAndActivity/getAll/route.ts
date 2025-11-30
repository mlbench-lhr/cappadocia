import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";
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
  const limit = Number(url.searchParams.get("limit")) || 7;
  const searchTerm = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const category = url.searchParams.get("category");
  const filters = url.searchParams.get("filters") || "";

  const query: any = {};
  if (payload.role === "vendor") {
    query.vendor = userId;
  }
  if (status) {
    query.status = status;
  }
  if (searchTerm) {
    query.title = { $regex: searchTerm, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  if (filters) {
    const filterArray = filters
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    console.log("filterArray-------", filterArray);

    if (filterArray.length > 0) {
      const validStatuses = [
        "pending admin approval",
        "active",
        "rejected",
        "upcoming",
      ];
      const validFilters = filterArray.filter((f) => validStatuses.includes(f));
      if (validFilters.length > 0) {
        query.status = { $in: validFilters };
      }
    }
    const parsed = JSON.parse(filters);

    parsed.forEach((f: any) => {
      if (f.duration) {
        query["slots.startDate"] = { $gte: new Date(f.duration.from) };
        query["slots.endDate"] = { $lte: new Date(f.duration.to) };
      }

      if (f.priceRange) {
        query["slots.adultPrice"] = {
          $gte: f.priceRange.min,
          $lte: f.priceRange.max,
        };
      }

      if (typeof f.rating === "number") {
        query["rating.average"] = { $gte: f.rating };
      }
    });
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
