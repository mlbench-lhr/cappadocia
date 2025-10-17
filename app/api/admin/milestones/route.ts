import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import connectDB from "@/lib/mongodb/connection";
import Milestone from "@/lib/mongodb/models/Milestone";
import User from "@/lib/mongodb/models/User";

export const GET = withAuth(async (req) => {
  try {
    const url = new URL(req.url);
    
    // Get pagination parameters
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 7;
    const searchTerm = url.searchParams.get("search") || "";
    
    await connectDB();

    // Build search query
    const searchQuery: any = {};
    
    if (searchTerm.trim()) {
      searchQuery.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // IMPORTANT: Get total count BEFORE pagination
    const totalMilestones = await Milestone.countDocuments(searchQuery);
    
    console.log("Total milestones found:", totalMilestones); // Debug log
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated milestones
    const milestones = await Milestone.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log("Milestones returned:", milestones.length); // Debug log

    // Get unique user IDs from current page milestones
    const userIds = milestones.map((m) => m.createdBy);
    
    // Fetch users for current page only
    const users = await User.find(
      { _id: { $in: userIds } },
      "lastName avatar firstName"
    ).lean();

    // Format milestones with user data
    const formattedUsers = milestones.map((m) => {
      const user = users.find((u: any) => u._id.toString() === m.createdBy);
      return {
        id: m._id,
        title: m.title,
        status: m.status,
        dueDate: m.deadLine,
        createdAt: m.createdAt,
        fullName: user?.firstName + " " + user?.lastName || "Unknown User",
        avatar: user?.avatar || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      };
    });

    // Return totalMilestones (from countDocuments), NOT formattedUsers.length
    return NextResponse.json({
      users: formattedUsers,
      total: totalMilestones, // ← Total from database, not array length
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalMilestones / limit),
    });
  } catch (error) {
    console.error("Admin milestones API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
