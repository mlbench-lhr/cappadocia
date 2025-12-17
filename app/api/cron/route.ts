import { NextRequest, NextResponse } from "next/server";
import moment from "moment";
import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import Notification from "@/lib/mongodb/models/Notification";
import { sendNotification } from "@/lib/pusher/notify";
import User from "@/lib/mongodb/models/User";
import { Resend } from "resend";

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
    const inProgress = await Booking.find({ status: "in-progress" })
      .select("_id activity slotId bookingId")
      .lean();
    console.log("inProgress-----", inProgress);
    const completeIds: string[] = [];
    for (const b of inProgress) {
      try {
        const act = await ToursAndActivity.findById(b.activity)
          .select("slots durationEndTime")
          .lean();
        if (!act || !Array.isArray(act.slots)) continue;
        const slot = (act.slots as any[]).find(
          (s) => s && String(s._id) === String(b.slotId)
        );
        if (!slot || !slot.endDate) continue;
        const [ehh = "0", emm = "0", ess = "0"] = String(
          (act as any).durationEndTime || "23:59:59"
        ).split(":");
        const endMoment = moment(slot.endDate)
          .set("hour", parseInt(ehh))
          .set("minute", parseInt(emm))
          .set("second", parseInt(ess));
        if (endMoment.isBefore(now)) {
          completeIds.push(String(b._id));
        }
      } catch {}
    }
    console.log("completeIds-----", completeIds);
    let completedResultCount = 0;
    if (completeIds.length > 0) {
      const res = await Booking.updateMany(
        { _id: { $in: completeIds } },
        { $set: { status: "completed", completedAt: now.toDate() } }
      );
      completedResultCount = res.modifiedCount || 0;
    }
    console.log("completedResultCount-----", completedResultCount);

    // 2–4) Send user reminders for bookings within next 24 hours (only one per booking)
    const candidates = await Booking.find({
      status: { $in: ["pending", "upcoming"] },
      selectDate: { $in: [todayStr, next24h.format("YYYY-MM-DD")] },
    })
      .select(
        "user vendor activity selectDate pickupLocation paymentStatus bookingId _id slotId"
      )
      .populate({
        path: "activity",
        select: "durationStartTime durationEndTime slots title",
      })
      .lean();

    let userRemindersSent = 0;
    const RESEND_API_KEY = process.env.RESEND_API_KEY as string;
    const EMAIL_FROM =
      process.env.EMAIL_FROM || "noreply@cappadociaplatform.com";
    const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

    for (const b of candidates) {
      let diffHours = Infinity;
      try {
        const act: any = (b as any).activity;
        const slots: any[] = act?.slots || [];
        const slot = slots.find(
          (s) => s && String(s._id) === String((b as any).slotId)
        );
        if (slot && slot.startDate) {
          const [shh = "0", smm = "0", sss = "0"] = String(
            act?.durationStartTime || "00:00:00"
          ).split(":");
          const startMoment = moment(slot.startDate)
            .set("hour", parseInt(shh))
            .set("minute", parseInt(smm))
            .set("second", parseInt(sss));
          diffHours = startMoment.diff(now, "hours");
        }
      } catch {}

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
          endDate: moment(
            (b as any).activity?.slots?.find(
              (s: any) => String(s._id) === String((b as any).slotId)
            )?.startDate
          )
            .set(
              "hour",
              parseInt(
                String(
                  (b as any).activity?.durationStartTime || "00:00:00"
                ).split(":")[0] || "0"
              )
            )
            .set(
              "minute",
              parseInt(
                String(
                  (b as any).activity?.durationStartTime || "00:00:00"
                ).split(":")[1] || "0"
              )
            )
            .set(
              "second",
              parseInt(
                String(
                  (b as any).activity?.durationStartTime || "00:00:00"
                ).split(":")[2] || "0"
              )
            )
            .toDate(),
        });
        if (resend) {
          try {
            const u = await User.findById(b.user)
              .select("email fullName")
              .lean();
            const to = u?.email;
            if (to) {
              const subject = "Booking Reminder: 24 hours remaining";
              const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px;"><h2 style="color: #000;">Hello ${
                u?.fullName || "Traveler"
              },</h2><p style="color: #000;">${message} for booking <strong>#${
                b.bookingId
              }</strong>.</p><p style="color: #000;">View details: <a href="https://cappadocia-alpha.vercel.app/bookings/detail/${b._id.toString()}" style="color:#555">Open booking</a></p></div>`;
              await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
            }
          } catch {}
        }
        userRemindersSent++;
      }
    }

    // 5) Send vendor reminders for tours starting within next 24 hours (only one per tour)
    const upcomingTours = await ToursAndActivity.find({
      "slots.startDate": { $gte: now.toDate(), $lte: next24h.toDate() },
    })
      .select("vendor title slots durationStartTime _id")
      .lean();

    let vendorRemindersSent = 0;

    for (const t of upcomingTours) {
      const slotsInWindow = (t.slots || []).filter((s: any) => {
        const [shh = "0", smm = "0", sss = "0"] = String(
          (t as any).durationStartTime || "00:00:00"
        ).split(":");
        const startMoment = moment(s.startDate)
          .set("hour", parseInt(shh))
          .set("minute", parseInt(smm))
          .set("second", parseInt(sss));
        return startMoment.isBetween(now, next24h, undefined, "[]");
      });
      if (slotsInWindow.length < 1) continue;

      const earliestSlot = slotsInWindow.sort(
        (a: any, b: any) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0];

      const exists = await Notification.findOne({
        userId: t.vendor,
        type: "vendor-reminder-24h",
        relatedId: t._id.toString(),
      }).lean();
      if (exists) continue;

      const [vh = "0", vm = "0", vs = "0"] = String(
        (t as any).durationStartTime || "00:00:00"
      ).split(":");
      const vendorStart = moment(earliestSlot.startDate)
        .set("hour", parseInt(vh))
        .set("minute", parseInt(vm))
        .set("second", parseInt(vs))
        .toDate();
      await sendNotification({
        recipientId: t.vendor.toString(),
        name: "Upcoming Tour Reminder",
        type: "vendor-reminder-24h",
        message: `Your tour "${t.title}" starts within 24 hours`,
        link: "/vendor/tours-and-activities",
        relatedId: t._id.toString(),
        endDate: vendorStart,
      });
      vendorRemindersSent++;
    }

    return NextResponse.json({
      ok: true,
      stats: {
        bookingsMarkedMissed: missedResult.modifiedCount || 0,
        inProgressMarkedCompleted: completedResultCount,
        userRemindersSent,
        vendorRemindersSent,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
