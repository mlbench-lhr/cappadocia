import connectDB from "@/lib/mongodb/connection";
import Reviews from "@/lib/mongodb/models/Reviews";
import { NextRequest, NextResponse } from "next/server";
import "@/lib/mongodb/models/ToursAndActivity";
import "@/lib/mongodb/models/Reviews";
import "@/lib/mongodb/models/User";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  let token = req.cookies.get("auth_token")?.value;
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit")) || 7;
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
  const query: any = {};
  if (payload.role === "user") {
    query.user = userId;
  } else if (payload.role === "vendor") {
    query.vendor = userId;
  }

  const reviews = await Reviews.find(query)
    .populate("activity")
    .populate("vendor")
    .populate("user")
    .populate("booking")
    .limit(limit)
    .lean();
  return NextResponse.json({ data: reviews });
}
