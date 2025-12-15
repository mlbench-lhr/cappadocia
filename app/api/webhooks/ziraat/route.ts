import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";
import Invoice from "@/lib/mongodb/models/Invoice";
import Notification from "@/lib/mongodb/models/Notification";
import { sendNotification } from "@/lib/pusher/notify";
import { NextRequest, NextResponse } from "next/server";

function parseFormBody(text: string): Record<string, string> {
  const params = new URLSearchParams(text);
  const obj: Record<string, string> = {};
  params.forEach((v, k) => (obj[k] = v));
  return obj;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const ct = req.headers.get("content-type") || "";
    let data: Record<string, string> = {};
    if (ct.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      data = parseFormBody(text);
    } else if (ct.includes("application/json")) {
      data = (await req.json()) as Record<string, string>;
    } else {
      const text = await req.text();
      data = parseFormBody(text);
    }

    const q = req.nextUrl.searchParams;
    const resultFlag = q.get("result") || data["result"] || "";

    const bookingId = data["orderId"] || data["oid"] || data["bookingId"] || "";
    if (!bookingId) {
      return NextResponse.json({ error: "Missing booking reference" }, { status: 400 });
    }

    const approved =
      resultFlag === "ok" ||
      data["mdstatus"] === "1" ||
      (data["Response"] || "").toLowerCase() === "approved";

    const amount = Number(data["amount"] || "0");
    const currency = data["currency"] || "TRY";
    const transId = data["TransId"] || data["transactionId"] || `ZIRAAT-${Date.now()}`;

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { bookingId },
      {
        $set: {
          "paymentDetails.paymentIntentId": transId,
          "paymentDetails.customerId": "",
          "paymentDetails.amount": amount || booking.paymentDetails.amount,
          "paymentDetails.currency": currency,
          "paymentDetails.status": approved ? "succeeded" : "failed",
          paymentStatus: approved ? "paid" : "pending",
          status: approved ? "upcoming" : booking.status,
        },
      },
      { new: true }
    );

    if (updatedBooking && approved) {
      const existingInvoice = await Invoice.findOne({ booking: updatedBooking._id });
      if (!existingInvoice) {
        await Invoice.create({
          booking: updatedBooking._id,
          activity: updatedBooking.activity,
          vendor: updatedBooking.vendor,
          user: updatedBooking.user,
          invoicesId: `INV-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        });
      }

      const hasUserConfirm = await Notification.findOne({
        userId: updatedBooking.user,
        type: "booking-confirmation",
        relatedId: updatedBooking._id.toString(),
      }).lean();
      if (!hasUserConfirm) {
        await sendNotification({
          recipientId: updatedBooking.user.toString(),
          name: "Booking Confirmed",
          type: "booking-confirmation",
          message: `Your booking #${updatedBooking.bookingId} is confirmed`,
          link: `/bookings/detail/${updatedBooking._id.toString()}`,
          relatedId: updatedBooking._id.toString(),
          endDate: new Date(updatedBooking.selectDate),
        });
      }

      const hasVendorPayment = await Notification.findOne({
        userId: updatedBooking.vendor,
        type: "vendor-booking-payment",
        relatedId: updatedBooking._id.toString(),
      }).lean();
      if (!hasVendorPayment) {
        await sendNotification({
          recipientId: updatedBooking.vendor.toString(),
          name: "Booking Payment Confirmed",
          type: "vendor-booking-payment",
          message: `Payment confirmed for booking #${updatedBooking.bookingId}`,
          link: "/vendor/reservations",
          relatedId: updatedBooking._id.toString(),
          endDate: new Date(updatedBooking.selectDate),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Processing error" }, { status: 500 });
  }
}
