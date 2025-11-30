import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";
import Reviews from "@/lib/mongodb/models/Reviews";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const created = await Reviews.create(body);
  let booking = await Booking.findOneAndUpdate(
    { _id: body.booking },
    { $set: { review: created._id } }
  );
  console.log("booking--", booking);
  return NextResponse.json(created);
}
