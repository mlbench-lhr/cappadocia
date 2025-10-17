// pages/api/dashboard/events.ts or app/api/dashboard/events/route.ts
import { verifyToken } from "@/lib/auth/jwt";
import connectDB from "@/lib/mongodb/connection";
import Milestone from "@/lib/mongodb/models/Milestone";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import { NextRequest, NextResponse } from "next/server";

interface DashboardEvent {
  id: string;
  title: string;
  endDate: Date;
  daysLeft: number;
  type: "opportunity" | "milestone";
  category: string;
  source: "opportunity" | "milestone";
}

function calculateDaysLeft(date: Date): number {
  const today = new Date();
  const timeDiff = date.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    let token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    const userId = payload.userId;

    // Get pagination parameters from query
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");

    console.log("userId", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    futureDate.setHours(23, 59, 59, 999);

    // Fetch saved opportunities with upcoming deadlines
    const opportunities = await Opportunity.find({
      $and: [
        { dueDate: { $gte: today, $lte: futureDate } },
        { ignored: false },
      ],
    }).sort({ dueDate: 1 });

    // Fetch user's milestones with upcoming deadlines
    const milestones = await Milestone.find({
      $and: [
        {
          $or: [{ createdBy: userId }],
        },
        { deadLine: { $gte: today, $lte: futureDate } },
      ],
    }).sort({ deadLine: 1 });

    // Transform opportunities to events
    const opportunityEvents: DashboardEvent[] = opportunities.map((opp) => ({
      id: opp._id.toString(),
      title: opp.title,
      endDate: opp.dueDate,
      daysLeft: calculateDaysLeft(opp.dueDate),
      type: "opportunity",
      category: opp.category,
      source: "opportunity",
    }));

    // Transform milestones to events
    const milestoneEvents: DashboardEvent[] = milestones.map((milestone) => ({
      id: milestone._id.toString(),
      title: milestone.title,
      endDate: milestone.deadLine,
      daysLeft: calculateDaysLeft(milestone.deadLine),
      type: "milestone",
      category: milestone.category,
      source: "milestone",
    }));

    // Combine and sort all events by due date
    const allEvents = [...opportunityEvents, ...milestoneEvents].sort(
      (a, b) => a.endDate.getTime() - b.endDate.getTime()
    );

    // Calculate pagination
    const totalEvents = allEvents.length;
    const totalPages = Math.ceil(totalEvents / limit);
    const skip = (page - 1) * limit;
    const paginatedEvents = allEvents.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: {
        upcoming: paginatedEvents,
        total: totalEvents,
        page: page,
        limit: limit,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
