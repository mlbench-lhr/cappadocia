import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Notification from "@/lib/mongodb/models/Notification";
import { verifyToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(token);
    const userId = payload.userId;

    const items = await Notification.find({ userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
