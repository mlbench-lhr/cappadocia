import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";

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

  const token = req.cookies.get("auth_token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (!item.isVerified) {
    const vendorId = (item.vendor as any)?._id
      ? (item.vendor as any)._id.toString()
      : (item.vendor as any).toString();
    const isOwner = !!payload && payload.userId === vendorId;
    if (!isOwner) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
  }

  if (!item.active) {
    const vendorId = (item.vendor as any)?._id
      ? (item.vendor as any)._id.toString()
      : (item.vendor as any).toString();
    const isOwner = !!payload && payload.userId === vendorId;
    const isAdmin = !!payload && payload.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
  }

  return NextResponse.json({ data: item });
}
