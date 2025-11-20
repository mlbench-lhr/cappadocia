import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const updates = await req.json();

  const updated = await ToursAndActivity.findByIdAndUpdate(
    params.id,
    { $set: updates }, // <-- only updates what you pass
    { new: true }
  );

  if (!updated)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({ data: updated });
}
