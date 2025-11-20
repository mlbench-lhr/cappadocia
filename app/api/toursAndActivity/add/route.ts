import { NextRequest, NextResponse } from "next/server";
import ToursAndActivity from "@/lib/mongodb/models/ToursAndActivity";
import connectDB from "@/lib/mongodb/connection";
import { verifyToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    let token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    const userId = payload.userId;

    const body = await req.json();
    console.log("body----", body.toursState);

    const created = await ToursAndActivity.create({
      ...body.toursState,
      vendor: userId,
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.log("error----", error);
  }
}
