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
  const category = url.searchParams.get("category");

  const query: any = {};
  if (payload.role === "vendor") {
    query.vendor = userId;
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
