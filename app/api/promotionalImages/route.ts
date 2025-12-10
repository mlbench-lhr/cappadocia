import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";
import AdminSettings from "@/lib/mongodb/models/AdminSettings";

// ---------- GET ----------
export async function GET(req: NextRequest) {
  try {
    await connectDB();

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

  const updatePayload: any = {};
  if (body.promotionalImages) updatePayload.promotionalImages = body.promotionalImages;
  if (body.section1Slides) updatePayload.section1Slides = body.section1Slides;
  if (body.section1SlidesData) updatePayload.section1SlidesData = body.section1SlidesData;
  if (body.section3MainImages) updatePayload.section3MainImages = body.section3MainImages;
  if (body.section3TabIcons) updatePayload.section3TabIcons = body.section3TabIcons;
  if (body.section4Background !== undefined) updatePayload.section4Background = body.section4Background;
  if (body.section4Thumbs) updatePayload.section4Thumbs = body.section4Thumbs;
  if (body.section6Image !== undefined) updatePayload.section6Image = body.section6Image;
  if (body.section7Image !== undefined) updatePayload.section7Image = body.section7Image;
  if (body.section8Background !== undefined) updatePayload.section8Background = body.section8Background;

  const updated = await AdminSettings.findOneAndUpdate(
    {},
    updatePayload,
    { new: true, upsert: true }
  );

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
