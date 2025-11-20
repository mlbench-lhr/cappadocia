import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const item = await ToursAndActivity.findById(params.id).populate("vendor");
  if (!item)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({ data: item });
}
