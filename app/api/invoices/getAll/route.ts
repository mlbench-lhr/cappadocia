import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import "@/lib/mongodb/models/ToursAndActivity";
import "@/lib/mongodb/models/booking";
import "@/lib/mongodb/models/User";
import Invoice from "@/lib/mongodb/models/Invoice";

export async function GET(req: NextRequest) {
  await connectDB();

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 10;
  const searchTerm = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";

  const query: any = {};

  if (searchTerm) {
    query.$or = [{ invoicesId: { $regex: searchTerm, $options: "i" } }];
  }

  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Invoice.find(query)
      .populate("booking")
      .populate("activity")
      .populate("vendor")
      .populate("user")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Invoice.countDocuments(query),
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
