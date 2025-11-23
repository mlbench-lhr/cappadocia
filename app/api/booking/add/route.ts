// src/app/api/bookings/route.ts
import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();

  const booking = await Booking.create(data);
  return Response.json(booking, { status: 201 });
}
