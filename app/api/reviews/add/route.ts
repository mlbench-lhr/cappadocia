import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";
import Reviews from "@/lib/mongodb/models/Reviews";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import User from "@/lib/mongodb/models/User";
import { NextRequest, NextResponse } from "next/server";
import { sendNotification } from "@/lib/pusher/notify";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const created = await Reviews.create(body);
  await Booking.findOneAndUpdate(
    { _id: body.booking },
    { $set: { review: created._id } }
  );
  const activityReviews = await Reviews.find({ activity: body.activity });
  const activityRatingCount = activityReviews.length;
  const activityAvg =
    activityReviews.reduce((s, r) => s + r.rating, 0) / activityRatingCount;
  await ToursAndActivity.findByIdAndUpdate(body.activity, {
    $set: {
      "rating.average": activityAvg,
      "rating.total": activityRatingCount,
    },
  });
  const vendorReviews = await Reviews.find({ vendor: body.vendor });
  const vendorRatingCount = vendorReviews.length;
  const vendorAvg =
    vendorReviews.reduce((s, r) => s + r.rating, 0) / vendorRatingCount;
  await User.findByIdAndUpdate(body.vendor, {
    $set: {
      "vendorDetails.rating.average": vendorAvg,
      "vendorDetails.rating.total": vendorRatingCount,
    },
  });
  try {
    await sendNotification({
      recipientId: body.vendor,
      name: "New Review Submitted",
      type: "vendor-review-new",
      message: "You received a new review",
      link: "/vendor/reports",
      relatedId: created._id.toString(),
      endDate: created.createdAt,
    });
  } catch {}
  return NextResponse.json(created);
}
