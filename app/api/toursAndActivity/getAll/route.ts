import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";

export async function GET(req: NextRequest) {
  await connectDB();

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 7;
  const searchTerm = url.searchParams.get("search") || "";

  const query: any = {};

  if (searchTerm) {
    query.title = { $regex: searchTerm, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    ToursAndActivity.find(query)
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
