import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";
import User from "@/lib/mongodb/models/User";
import { sendNotification } from "@/lib/pusher/notify";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    let token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    const userId = payload.userId;

    const body = await req.json();
    console.log("body----", body.toursState);

    const vendor = await User.findById(userId).select("isRoleVerified").lean();

    const created = await ToursAndActivity.create({
      ...body.toursState,
      vendor: userId,
      isVerified: !!vendor?.isRoleVerified,
      status: vendor?.isRoleVerified ? "active" : "pending admin approval",
    });

    try {
      const admins = await User.find({ role: "admin" }).select("_id").lean();
      for (const a of admins) {
        await sendNotification({
          recipientId: a._id.toString(),
          name: "New Tour Publish Request",
          type: "admin-tour-request",
          message: `New tour submitted: ${created.title}`,
          link: `/admin/tours-and-activities/detail/${created._id.toString()}`,
          relatedId: created._id.toString(),
          endDate: new Date(),
        });
      }
    } catch {}

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.log("error----", error);
  }
}
