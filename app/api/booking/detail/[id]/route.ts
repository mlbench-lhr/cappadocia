// src/app/api/bookings/[id]/route.ts
import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const booking = await Booking.findById(params.id)
    .populate("activity")
    .populate("vendor")
    .populate("user")
    .lean();
  if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(booking);
}
