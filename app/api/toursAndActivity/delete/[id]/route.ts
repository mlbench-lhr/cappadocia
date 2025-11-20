import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const deleted = await ToursAndActivity.findByIdAndDelete(params.id);
  if (!deleted)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({ message: "Deleted successfully" });
}
