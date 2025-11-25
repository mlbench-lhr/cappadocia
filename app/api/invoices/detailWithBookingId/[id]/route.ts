// src/app/api/bookings/[id]/route.ts
import connectDB from "@/lib/mongodb/connection";
import Invoice from "@/lib/mongodb/models/Invoice";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const reqParams = await params;
  const id = reqParams.id;
  await connectDB();
  const booking = await Invoice.findOne({ booking: id })
    .populate("booking")
    .populate("activity")
    .populate("vendor")
    .populate("user")
    .lean();
  if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(booking);
}
