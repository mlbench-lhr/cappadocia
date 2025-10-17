// /api/milestones/save.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Milestone from "@/lib/mongodb/models/Milestone";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { milestones, userId } = await req.json();
    console.log("milestones---------", milestones);
    await Milestone.insertMany(milestones);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
