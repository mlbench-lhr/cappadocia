import connectDB from "@/lib/mongodb/connection";
import Reviews from "@/lib/mongodb/models/Reviews";
import { NextResponse } from "next/server";
import "@/lib/mongodb/models/ToursAndActivity";
import "@/lib/mongodb/models/Reviews";
import "@/lib/mongodb/models/User";

export async function GET() {
  await connectDB();
  const reviews = await Reviews.find()
    .populate("activity")
    .populate("vendor")
    .populate("user")
    .populate("booking")
    .lean();
  return NextResponse.json({ data: reviews });
}
