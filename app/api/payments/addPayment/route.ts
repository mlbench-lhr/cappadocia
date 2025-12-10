import { NextResponse } from "next/server";
import "@/lib/mongodb/models/booking";
import "@/lib/mongodb/models/ToursAndActivity";
import "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb/connection";
import Payments from "@/lib/mongodb/models/Payments";
import User from "@/lib/mongodb/models/User";
import { sendNotification } from "@/lib/pusher/notify";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newPayment = await Payments.create(body);

    try {
      const admins = await User.find({ role: "admin" }).select("_id").lean();
      const vendor = await User.findById(body.vendor).select("vendorDetails fullName").lean();
      const vendorName = vendor?.vendorDetails?.companyName || vendor?.fullName || "Vendor";
      for (const a of admins) {
        await sendNotification({
          recipientId: a._id.toString(),
          name: "New Payout Request",
          type: "admin-payout-request",
          message: `Payout request from ${vendorName}`,
          link: "/admin/payments",
          relatedId: newPayment._id.toString(),
          endDate: new Date(),
        });
      }
    } catch {}

    return NextResponse.json({ success: true, data: newPayment });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
