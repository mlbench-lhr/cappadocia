import connectDB from "@/lib/mongodb/connection";
import Booking from "@/lib/mongodb/models/booking";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Booking.findByIdAndDelete(params.id);

  return Response.json({ message: "Deleted" });
}
