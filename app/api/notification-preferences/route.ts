import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import User from "@/lib/mongodb/models/User";
import { verifyToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mapToObject(prefs: any) {
  if (!prefs) return {};
  const isMap = typeof prefs?.get === "function" && typeof prefs?.set === "function";
  if (isMap) {
    const out: Record<string, boolean> = {};
    for (const [k, v] of prefs.entries()) out[k] = !!v;
    return out;
  }
  const out: Record<string, boolean> = {};
  for (const k of Object.keys(prefs)) out[k] = !!prefs[k];
  return out;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(token);
    const userId = payload.userId;

    const user = await User.findById(userId).select("notificationPreferences role");
    const prefs = mapToObject(user?.notificationPreferences);
    return NextResponse.json({ prefs, role: user?.role || "user" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(token);
    const userId = payload.userId;

    const body = await req.json();
    const updates: Record<string, boolean> = body || {};
    const user = await User.findById(userId).select("notificationPreferences");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.notificationPreferences) {
      // @ts-ignore
      user.notificationPreferences = new Map<string, boolean>();
    }
    for (const [k, v] of Object.entries(updates)) {
      // @ts-ignore
      user.notificationPreferences.set(k, !!v);
    }
    await user.save();

    const prefs = mapToObject(user.notificationPreferences);
    return NextResponse.json({ prefs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

