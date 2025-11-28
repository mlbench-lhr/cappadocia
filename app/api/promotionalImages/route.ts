import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";
import AdminSettings from "@/lib/mongodb/models/AdminSettings";

// ---------- GET ----------
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );

    verifyToken(token);

    const settings = await AdminSettings.findOne();
    return NextResponse.json({ data: settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ---------- PUT ----------
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );

    verifyToken(token);

    const body = await req.json();

    const updated = await AdminSettings.findOneAndUpdate(
      {},
      { promotionalImages: body.promotionalImages },
      { new: true, upsert: true }
    );

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
