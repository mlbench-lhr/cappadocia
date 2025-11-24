import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const updates = await req.json();

  const booking = await Booking.findByIdAndUpdate(
    params.id,
    { $set: updates },
    { new: true }
  );

  if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(booking);
}
