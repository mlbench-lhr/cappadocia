import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Opportunity, {
  OpportunitiesCardType,
} from "@/lib/mongodb/models/Opportunity";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/auth/jwt";
import User from "@/lib/mongodb/models/User";

// API Handler
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("body------", body.opportunities);

    const opportunities: OpportunitiesCardType[] = body.opportunities.map(
      ({ _id, ...rest }: any) => rest
    );
    console.log("opportunities------", opportunities);
    let result = await Opportunity.insertMany(opportunities);
    console.log("result", result);
    return NextResponse.json({
      success: true,
      message: "Demo opportunities inserted successfully 🚀",
    });
  } catch (error: any) {
    console.log("error--------", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Extract query params
    const { searchParams } = new URL(req.url);
    let token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    const userId = payload.userId;
    const category = searchParams.get("category");
    const savedIgnored = searchParams.get("savedIgnored"); // "all", "saved", "ignored"
    const format = searchParams.get("format"); // "Online", "In-Person"
    const location = searchParams.get("location"); // "Local", "Anywhere"
    const favorite = searchParams.get("favorite"); // "All", "Saved"
    const priceType = searchParams.get("priceType"); // "Free", "Paid"
    const searchQuery = searchParams.get("search");

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "4");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    const userData = await User.findById(userId);
    console.log("userData stringify--------", JSON.stringify(userData));

    // Build query object
    let query: any = {};
    // Match by intended majors or general majors
    if (userData?.dreamsAndGoals?.intendedMajors?.length) {
      query.majors = { $in: userData.dreamsAndGoals.intendedMajors };
    } else if (userData?.dreamsAndGoals?.majors?.length) {
      query.majors = { $in: userData.dreamsAndGoals.majors };
    }

    // Match by location (Local if user city/state available)
    if (userData?.personalInfo?.city || userData?.personalInfo?.state) {
      query.location = {
        $regex: new RegExp(
          userData.personalInfo.city || userData.personalInfo.state,
          "i"
        ),
      };
    }

    // Match by category (based on extracurriculars)
    // if (userData?.extracurricularsAndAwards?.extracurricularActivity?.length) {
    //   const categories =
    //     userData.extracurricularsAndAwards.extracurricularActivity.map(
    //       (a: any) => a.activityType
    //     );
    //   query.category = { $in: categories };
    // }
    // Category filter
    if (category && category !== "All Opportunities") {
      query.category = category;
    }

    // Saved/Ignored filter
    if (savedIgnored === "saved") {
      query.savedBy = userId;
    } else if (savedIgnored === "ignored") {
      query.ignoredBy = userId;
    } else if (savedIgnored === "all") {
      // Exclude ignored opportunities
      query.ignoredBy = { $ne: userId };
      query.$or = [
        { ignoredBy: { $exists: false } },
        {
          $and: [
            { ignoredBy: { $ne: userId } },
            { ignoredBy: { $ne: new mongoose.Types.ObjectId(userId) } },
          ],
        },
      ];
    }

    // Format filter
    if (format) {
      query.type = format;
    }

    // Location filter
    if (location === "Local") {
      query.location = "Local";
    }
    // If "Anywhere" is selected, don't filter by location

    // Favorite filter
    if (favorite === "Saved") {
      query.savedBy = userId;
    }

    // Price type filter
    if (priceType === "Free") {
      query.price = 0;
    } else if (priceType === "Paid") {
      query.price = { $gt: 0 };
    }

    // Search query filter
    if (searchQuery && searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { institute: searchRegex },
        { description: searchRegex },
        { majors: searchRegex },
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await Opportunity.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated opportunities
    const opportunities = await Opportunity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        opportunities,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch opportunities", error: error.message },
      { status: 500 }
    );
  }
}
