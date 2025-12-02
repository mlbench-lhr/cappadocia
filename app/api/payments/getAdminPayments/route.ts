import { NextResponse } from "next/server";
import "@/lib/mongodb/models/booking";
import "@/lib/mongodb/models/ToursAndActivity";
import "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb/connection";
import Payments from "@/lib/mongodb/models/Payments";

export async function GET() {
  try {
    await connectDB();

    const data = await Payments.find()
      .populate("booking")
      .populate("activity")
      .populate("vendor")
      .populate("user");

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
