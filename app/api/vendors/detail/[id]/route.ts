import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import User from "@/lib/mongodb/models/User";
import ToursAndActivity, {
  ToursAndActivity as ToursAndActivityType,
} from "@/lib/mongodb/models/ToursAndActivity";
import Booking from "@/lib/mongodb/models/booking";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const paramsAwaited = await params;
    const id = await paramsAwaited.id;
    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ----------- Fetch vendor data additions here --------------

    // latest tour uploads
    const latestTour: any = await ToursAndActivity.findOne({
      vendor: id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const latestUploads = latestTour?.uploads || [];

    // total bookings of vendor
    const totalBookings = await Booking.countDocuments({ vendor: id });

    // active tours
    const activeTours = await ToursAndActivity.countDocuments({
      vendor: id,
      status: "active",
    });

    // -----------------------------------------------------------

    return NextResponse.json({
      user: { ...user, latestUploads, totalBookings, activeTours },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
