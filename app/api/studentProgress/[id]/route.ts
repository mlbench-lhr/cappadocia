// app/api/milestones/progress/route.ts
import { verifyToken } from "@/lib/auth/jwt";
import Milestone from "@/lib/mongodb/models/Milestone";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const reqParams = await params;
    const id = reqParams.id;
    const url = new URL(req.url);
    const grade = url.searchParams.get("grade");
    const season = url.searchParams.get("season");
    const tier = url.searchParams.get("tier");
    let token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    const userId = payload.userId;

    const milestones = await Milestone.find({
      createdBy: userId,
      gradeLevel: grade,
      season,
      tier,
    });

    const total = milestones.length;
    const completed = milestones.filter((m) => m.completed).length;
    const progressPercent = total ? (completed / total) * 100 : 0;

    return NextResponse.json({ total, completed, progressPercent });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
