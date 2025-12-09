import { NextRequest, NextResponse } from "next/server";
import moment from "moment";
import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import Notification from "@/lib/mongodb/models/Notification";
import { sendNotification } from "@/lib/pusher/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const now = moment();
    const todayStr = now.format("YYYY-MM-DD");
    const next24h = moment().add(24, "hours");

    // 1) Mark bookings as missed if their selected date has passed
    const missedResult = await Booking.updateMany(
      {
        status: { $nin: ["completed", "cancelled", "missed"] },
        selectDate: { $lt: todayStr },
      },
      { $set: { status: "missed" } }
    );

    // 2–4) Send user reminders for bookings within next 24 hours (only one per booking)
    const candidates = await Booking.find({
      status: { $in: ["pending", "upcoming"] },
      selectDate: { $in: [todayStr, next24h.format("YYYY-MM-DD")] },
    })
      .select(
        "user vendor activity selectDate pickupLocation paymentStatus bookingId _id"
      )
      .lean();

    let userRemindersSent = 0;

    for (const b of candidates) {
      const startOfDay = moment(b.selectDate, "YYYY-MM-DD").startOf("day");
      const diffHours = startOfDay.diff(now, "hours");

      if (diffHours >= 0 && diffHours < 24) {
        const exists = await Notification.findOne({
          userId: b.user,
          type: "booking-reminder-24h",
          relatedId: b._id.toString(),
        }).lean();
        if (exists) continue;

        let message = "you have a booking after 24 hours";
        if (b.paymentStatus !== "paid") {
          message = "please confirm your payment";
        } else if (!b.pickupLocation) {
          message = "please select your pickup location";
        }

        await sendNotification({
          recipientId: b.user.toString(),
          name: "Booking Reminder",
          type: "booking-reminder-24h",
          message,
          link: `/bookings/detail/${b._id.toString()}`,
          relatedId: b._id.toString(),
          endDate: startOfDay.toDate(),
        });
        userRemindersSent++;
      }
    }

    // 5) Send vendor reminders for tours starting within next 24 hours (only one per tour)
    const upcomingTours = await ToursAndActivity.find({
      "slots.startDate": { $gte: now.toDate(), $lte: next24h.toDate() },
    })
      .select("vendor title slots _id")
      .lean();

    let vendorRemindersSent = 0;

    for (const t of upcomingTours) {
      const slotsInWindow = (t.slots || []).filter(
        (s: any) => moment(s.startDate).isBetween(now, next24h, undefined, "[]")
      );
      if (slotsInWindow.length < 1) continue;

      const earliestSlot = slotsInWindow.sort(
        (a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0];

      const exists = await Notification.findOne({
        userId: t.vendor,
        type: "vendor-reminder-24h",
        relatedId: t._id.toString(),
      }).lean();
      if (exists) continue;

      await sendNotification({
        recipientId: t.vendor.toString(),
        name: "Upcoming Tour Reminder",
        type: "vendor-reminder-24h",
        message: `Your tour "${t.title}" starts within 24 hours`,
        link: "/vendor/tours-and-activities",
        relatedId: t._id.toString(),
        endDate: new Date(earliestSlot.startDate),
      });
      vendorRemindersSent++;
    }

    return NextResponse.json({
      ok: true,
      stats: {
        bookingsMarkedMissed: missedResult.modifiedCount || 0,
        userRemindersSent,
        vendorRemindersSent,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

