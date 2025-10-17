// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import User from "@/lib/mongodb/models/User";
import Milestone from "@/lib/mongodb/models/Milestone";
import Applications from "@/lib/mongodb/models/Applications";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req: NextRequest, { params }: any) {
  const reqParams = await params;
  const id = reqParams.id;
  const url = new URL(req.url);
  let token = req.cookies.get("auth_token")?.value;
  const grade = url.searchParams.get("grade");
  const season = url.searchParams.get("season");
  const tier = url.searchParams.get("tier");

  if (!token) {
    return NextResponse.json(
      { error: "Authorization token required" },
      { status: 401 }
    );
  }
  const payload = verifyToken(token);
  const userId = payload.userId;

  try {
    // Opportunities Saved
    const opportunitiesSaved = await Opportunity.countDocuments({
      savedBy: { $in: [userId] },
    });

    // Applications Started
    const applicationsStarted = await Applications.find({
      student: id,
    }).select("applicationsStarted");

    // Milestones Completed
    const milestonesCompleted = await Milestone.countDocuments({
      completed: true,
      createdBy: id,
      gradeLevel: grade,
      season,
      tier,
    });
    const milestonesOfUser = await Milestone.countDocuments({
      createdBy: id,
      gradeLevel: grade,
      season,
      tier,
    });

    // Days until Next Deadline (min date from dueDate or deadLine)
    const nextOpportunity = await Opportunity.find({
      dueDate: { $gte: new Date() },
    })
      .sort({ dueDate: 1 })
      .limit(1)
      .select("title dueDate"); // added title

    const nextMilestone = await Milestone.find({
      deadLine: { $gte: new Date() },
      createdBy: id,
      gradeLevel: grade,
      season,
      tier,
    })
      .sort({ deadLine: 1 })
      .limit(1)
      .select("title deadLine"); // added title

    const nextDates = [
      // nextOpportunity[0]?.dueDate,
      nextMilestone[0]?.deadLine,
    ].filter(Boolean);

    const nextDeadline = nextDates.length
      ? Math.ceil(
          (Math.min(...nextDates.map((d) => d.getTime())) -
            new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;
    let nextItem: { title: string; dueDate: Date; type: string } | null = null;

    if (nextOpportunity[0]?.dueDate && nextMilestone[0]?.deadLine) {
      nextItem =
        nextOpportunity[0].dueDate < nextMilestone[0].deadLine
          ? {
              title: nextOpportunity[0].title,
              dueDate: nextOpportunity[0].dueDate,
              type: "Opportunity",
            }
          : {
              title: nextMilestone[0].title,
              dueDate: nextMilestone[0].deadLine,
              type: "Milestone",
            };
    } else if (nextOpportunity[0]?.dueDate) {
      nextItem = {
        title: nextOpportunity[0].title,
        dueDate: nextOpportunity[0].dueDate,
        type: "Opportunity",
      };
    } else if (nextMilestone[0]?.deadLine) {
      nextItem = {
        title: nextMilestone[0].title,
        dueDate: nextMilestone[0].deadLine,
        type: "Milestone",
      };
    }

    const nextAction = nextItem
      ? `${nextItem.type}: ${nextItem.title} (Next steps due ${nextItem.dueDate})`
      : null;

    // Get user-specific milestones
    const userMilestones = await Milestone.find({
      createdBy: id,
      gradeLevel: grade,
      season,
      tier,
    });

    const totalMilestones: number = userMilestones.length;
    const completedMilestones: number = userMilestones.filter(
      (m) => m.completed
    ).length;
    const progressPercent: number = totalMilestones
      ? (completedMilestones / totalMilestones) * 100
      : 0;

    return NextResponse.json({
      opportunitiesSaved,
      totalMilestones: milestonesOfUser,
      applicationsStarted: applicationsStarted?.length || 0,
      milestonesCompleted,
      daysUntilNextDeadline: nextDeadline,
      nextAction: nextItem
        ? `${
            nextItem.title
          } (Next steps due ${nextItem.dueDate?.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })})`
        : null,
      progressPercent: progressPercent,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
