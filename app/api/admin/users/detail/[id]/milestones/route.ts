// /api/admin/users/detail/[id]/milestones/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Milestone from "@/lib/mongodb/models/Milestone";
import User from "@/lib/mongodb/models/User";
import { getSeason } from "@/lib/helper/timeFunctions";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    const reqParams = await params;
    const userId = reqParams.id;
    const url = new URL(req.url);
    const { milestoneTier }: any = await User.findById(userId)
      .select("milestoneTier")
      .lean();
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 7;

    // Get filter parameter (status)
    const statusFilter = url.searchParams.get("status") || "";
    const query: any = {
      createdBy: userId,
      tier: milestoneTier,
    };
    console.log("query-----", query);

    // Add status filter if provided
    if (statusFilter && statusFilter !== "all") {
      query.status = statusFilter;
      console.log("Filtering by status:", statusFilter);
    }

    // Get total count for pagination
    const totalMilestones = await Milestone.countDocuments(query);

    console.log("Total milestones found:", totalMilestones);

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated milestones
    const milestones = await Milestone.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id createdAt deadLine status title")
      .lean();

    console.log("Milestones returned:", milestones.length);

    return NextResponse.json({
      milestones: milestones,
      total: totalMilestones,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalMilestones / limit),
    });
  } catch (error) {
    console.error("User milestones API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
