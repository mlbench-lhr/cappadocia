import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Notification from "@/lib/mongodb/models/Notification";
import { verifyToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(token);
    const userId = payload.userId;

    const n = await Notification.findOne({ _id: params.id });
    if (!n) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (n.userId.toString() !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await Notification.deleteOne({ _id: params.id });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
