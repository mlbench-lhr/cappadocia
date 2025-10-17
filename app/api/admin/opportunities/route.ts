import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import connectDB from "@/lib/mongodb/connection";
import Opportunity, {
  OpportunitiesCardType,
} from "@/lib/mongodb/models/Opportunity";

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
    const totalOpportunities = await Opportunity.countDocuments(searchQuery);

    console.log("Total opportunities found:", totalOpportunities); // Debug log

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated opportunities
    const opportunities = await Opportunity.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    console.log("Opportunities returned:", opportunities.length); // Debug log

    // Format opportunities
    const formattedUsers = opportunities.map((opp) => {
      return {
        id: opp._id,
        title: opp.title,
        category: opp.category,
        dueDate: opp.dueDate,
        difficulty: opp.difficulty,
      };
    });

    // Return totalOpportunities (from countDocuments), NOT formattedUsers.length
    return NextResponse.json({
      users: formattedUsers, // Keep "users" key for backward compatibility
      total: totalOpportunities, // ← Total from database, not array length
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalOpportunities / limit),
    });
  } catch (error) {
    console.error("Admin opportunities API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
