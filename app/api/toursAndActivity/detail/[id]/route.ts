import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const awaitedParam = await params;
  const id = awaitedParam.id;

  console.log("id-----------", id);

  const item = await ToursAndActivity.findOne({ _id: id }).populate("vendor");
  console.log("item--------", item);

  if (!item)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({ data: item });
}
