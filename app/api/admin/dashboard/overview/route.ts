import connectDB from "@/lib/mongodb/connection";
import Milestone from "@/lib/mongodb/models/Milestone";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import User from "@/lib/mongodb/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const now = new Date();
  const lastMonth = new Date(now);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  // --- Current Counts ---
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalOpportunities = await Opportunity.countDocuments();
  const totalCompletedMilestones = await Milestone.countDocuments({
    completed: true,
  });

  // --- Previous Counts (for % change) ---
  const prevUsers = await User.countDocuments({
    createdAt: { $lt: lastMonth },
  });
  const prevOpportunities = await Opportunity.countDocuments({
    createdAt: { $lt: lastMonth },
  });
  const prevMilestones = await Milestone.countDocuments({
    completed: true,
    createdAt: { $lt: lastMonth },
  });

  const getChange = (current: number, prev: number) => {
    if (prev === 0) return { percent: 100, increased: true };
    const diff = current - prev;
    return {
      percent: Math.round((diff / prev) * 100),
      increased: diff >= 0,
    };
  };

  const usersChange = getChange(totalUsers, prevUsers);
  const oppChange = getChange(totalOpportunities, prevOpportunities);
  const milestoneChange = getChange(totalCompletedMilestones, prevMilestones);

  // --- Milestone overview ---
  const totalMilestones = await Milestone.countDocuments();
  const inProgress = await Milestone.countDocuments({ status: "in_progress" });
  const completed = await Milestone.countDocuments({ status: "done" });
  const overdue = await Milestone.countDocuments({
    deadLine: { $lt: now },
    completed: false,
  });

  // --- Users & Milestones Overview by Month ---
  const pipeline = [
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ];

  const userStats = await User.aggregate(pipeline);
  const milestoneStats = await Milestone.aggregate(pipeline);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const overview = months.map((m, i) => ({
    month: m,
    users: userStats.find((u) => u._id.month === i + 1)?.count || 0,
    milestones: milestoneStats.find((m) => m._id.month === i + 1)?.count || 0,
  }));

  return NextResponse.json({
    sinceLastMonth: {
      users: { total: totalUsers, ...usersChange },
      opportunities: { total: totalOpportunities, ...oppChange },
      milestones: { total: totalCompletedMilestones, ...milestoneChange },
    },
    milestoneOverview: {
      inProgress: ((inProgress / totalMilestones) * 100).toFixed(2),
      completed: ((completed / totalMilestones) * 100).toFixed(2),
      overdue: overdue,
    },
    overview,
  });
}
