import connectDB from "@/lib/mongodb/connection";
import Reviews from "@/lib/mongodb/models/Reviews";
import { NextRequest, NextResponse } from "next/server";
import "@/lib/mongodb/models/ToursAndActivity";
import "@/lib/mongodb/models/Reviews";
import "@/lib/mongodb/models/User";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const url = new URL(req.url);
  const id = params.id;
  const limit = Number(url.searchParams.get("limit")) || 2;

  await connectDB();

  const reviews = await Reviews.find({ vendor: id })
    .populate("activity vendor user booking")
    .limit(limit)
    .lean();

  // --- Stats ---
  const allReviews = await Reviews.find({ vendor: id }).lean();
  const totalReviews = allReviews.length;

  const averageRating =
    totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
      : 0;

  const breakdown: any = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  allReviews.forEach((r) => {
    breakdown[r.rating]++;
  });

  const ratingBreakdown = Object.fromEntries(
    Object.entries(breakdown).map(([star, count]: any) => [
      star,
      totalReviews ? (count / totalReviews) * 100 : 0,
    ])
  );

  return NextResponse.json({
    data: {
      reviews,
      averageRating,
      totalReviews,
      ratingBreakdown,
    },
  });
}
