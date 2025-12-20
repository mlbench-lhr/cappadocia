import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const token =
    req.headers.get("authorization")?.startsWith("Bearer ")
      ? req.headers.get("authorization")!.substring(7)
      : req.cookies.get("auth_token")?.value || "";
  if (!token)
    return NextResponse.json(
      { error: "Authorization required" },
      { status: 401 }
    );

  const payload = verifyToken(token);
  if (payload.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const deleted = await ToursAndActivity.findByIdAndDelete(params.id);
  if (!deleted)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({ message: "Deleted successfully" });
}
