import { verifyToken } from "@/lib/auth/jwt";
import { getSeason } from "@/lib/helper/timeFunctions";
import connectDB from "@/lib/mongodb/connection";
import Milestone from "@/lib/mongodb/models/Milestone";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import User, { IUser } from "@/lib/mongodb/models/User";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  let token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Authorization token required" },
      { status: 401 }
    );
  }
  const payload = verifyToken(token);
  const user: IUser | null | any = await User.findById(payload?.userId);
  const currentSeason = getSeason();

  try {
    const milestones = await Milestone.find({
      status: { $ne: "done" },
      createdBy: payload?.userId,
      tier: user?.milestoneTier,
      gradeLevel: user?.academicInfo?.gradeLevel,
      season: currentSeason,
    }).lean();
    const opportunities = await Opportunity.find({}).lean();
    const formattedMilestones = milestones.map((milestone) => {
      return {
        id: milestone._id,
        title: milestone.title,
        date: moment(milestone.deadLine).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        type: milestone?.category || "milestone",
      };
    });
    const formattedOpportunities = opportunities.map((opportunity) => {
      return {
        id: opportunity._id,
        title: opportunity.title,
        date: moment(opportunity.dueDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        type: opportunity.category,
      };
    });

    // const allEvents = [...formattedMilestones, ...formattedOpportunities];
    const allEvents = formattedMilestones;
    return NextResponse.json(allEvents, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
