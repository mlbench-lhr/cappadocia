import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Reviews from "@/lib/mongodb/models/Reviews";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import User from "@/lib/mongodb/models/User";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();

  // update review
  const updated = await Reviews.findByIdAndUpdate(params.id, body, {
    new: true,
  });

  // recalc activity rating
  const actReviews = await Reviews.find({ activity: updated.activity });
  const actCount = actReviews.length;
  const actAvg = Number(
    (actReviews.reduce((s, r) => s + r.rating, 0) / actCount).toFixed(1)
  );

  await ToursAndActivity.findByIdAndUpdate(updated.activity, {
    $set: { "rating.average": actAvg, "rating.total": actCount },
  });

  // recalc vendor rating
  const vendorReviews = await Reviews.find({ vendor: updated.vendor });
  const vCount = vendorReviews.length;
  const vAvg = Number(
    (vendorReviews.reduce((s, r) => s + r.rating, 0) / vCount).toFixed(1)
  );

  await User.findByIdAndUpdate(updated.vendor, {
    $set: {
      "vendorDetails.rating.average": vAvg,
      "vendorDetails.rating.total": vCount,
    },
  });

  return NextResponse.json(updated);
}
