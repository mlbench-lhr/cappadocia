import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";
import { sendNotification } from "@/lib/pusher/notify";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const updates = await req.json();

  const existing = await Booking.findById(params.id);
  const booking = await Booking.findByIdAndUpdate(
    params.id,
    { $set: updates },
    { new: true }
  );

  if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

  try {
    if (
      typeof updates.status !== "undefined" &&
      updates.status === "cancelled" &&
      existing &&
      existing.status !== "cancelled"
    ) {
      await sendNotification({
        recipientId: booking.user.toString(),
        name: "Booking Cancelled",
        type: "booking-cancellation",
        message: `Your booking #${booking.bookingId} was cancelled`,
        link: `/bookings/detail/${booking._id.toString()}`,
        relatedId: booking._id.toString(),
        endDate: new Date(booking.selectDate),
      });
      await sendNotification({
        recipientId: booking.vendor.toString(),
        name: "Booking Cancelled",
        type: "vendor-booking-cancelled",
        message: `Booking #${booking.bookingId} cancelled by user`,
        link: "/vendor/reservations",
        relatedId: booking._id.toString(),
        endDate: new Date(booking.selectDate),
      });
    }
  } catch {}

  return Response.json(booking);
}
