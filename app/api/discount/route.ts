import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";
import AdminSettings from "@/lib/mongodb/models/AdminSettings";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const settings = await AdminSettings.findOne().lean();
    return NextResponse.json(
      { data: settings?.discount || null },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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
    const percentage = body?.percentage;
    const text = body?.text;
    const startDateRaw = body?.startDate;
    const endDateRaw = body?.endDate;
    const image = body?.image;

    if (typeof percentage !== "number" || percentage < 0 || percentage > 100) {
      return NextResponse.json(
        { error: "Percentage must be a number between 0 and 100" },
        { status: 400 }
      );
    }
    if (typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const startDate = startDateRaw ? new Date(startDateRaw) : null;
    const endDate = endDateRaw ? new Date(endDateRaw) : null;
    if (
      !startDate ||
      !endDate ||
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      return NextResponse.json(
        { error: "Valid startDate and endDate are required" },
        { status: 400 }
      );
    }
    if (startDate > endDate) {
      return NextResponse.json(
        { error: "startDate must be before or equal to endDate" },
        { status: 400 }
      );
    }

    const payload: any = { percentage, text, startDate, endDate };
    if (typeof image === "string") payload.image = image;

    const updated = await AdminSettings.findOneAndUpdate(
      {},
      { discount: payload },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { data: updated?.discount || null },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
