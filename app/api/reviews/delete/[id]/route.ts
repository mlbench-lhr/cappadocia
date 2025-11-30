import connectDB from "@/lib/mongodb/connection";
import Reviews from "@/lib/mongodb/models/Reviews";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Reviews.findByIdAndDelete(params.id);

  return Response.json({ message: "Deleted" });
}
