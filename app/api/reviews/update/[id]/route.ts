import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Reviews from "@/lib/mongodb/models/Reviews";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();
  const updated = await Reviews.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}
