import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";
import User from "@/lib/mongodb/models/User";

export async function GET(req: NextRequest) {
  await connectDB();

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 7;
  const searchTerm = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category");
  const filters = url.searchParams.get("filters") || "";

  let token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Authorization token required" },
      { status: 401 }
    );
  }
  const payload = verifyToken(token);
  const userId = payload.userId;
  const favoriteIds: any = await User.findById(userId)
    .select("favorites -_id")
    .lean();
  const query: any = {};
  query.active = true;
  query.isVerified = true;
  if (filters) {
    const filterArray = filters
      .replace("tour", "Tour")
      .replace("activity", "Activity")
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    console.log("filterArray--", filterArray);

    if (filterArray.length > 0) {
      const validStatuses = ["Tour", "Activity"];
      const validFilters = filterArray.filter((f) => validStatuses.includes(f));
      if (validFilters.length > 0) {
        query.category = { $in: validFilters };
      }
    }
  }

  console.log("favoriteIds----", favoriteIds);

  if (favoriteIds?.favorites && favoriteIds?.favorites?.length > 0) {
    query._id = { $in: favoriteIds.favorites };
  } else {
    return NextResponse.json({
      data: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: Math.ceil(0 / limit),
      },
    });
  }

  if (searchTerm) {
    query.title = { $regex: searchTerm, $options: "i" };
  }
  if (category) {
    query.category = category;
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
