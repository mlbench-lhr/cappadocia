// Demo milestones API with pagination and filters
import { getSeason } from "@/lib/helper/timeFunctions";
import connectDB from "@/lib/mongodb/connection";
import Milestone from "@/lib/mongodb/models/Milestone";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      image,
      title,
      organization,
      type,
      category,
      gradeLevel,
      deadLine,
      description,
      dependencies,
      linkedOpportunities,
      createdBy, // user ID
      season,
      tier,
      majors,
      aiGenerated,
    } = body;
    console.log("createdBy---------", createdBy);

    if (body.opportunityId) {
      let OpportunityUpdate = await Opportunity.findByIdAndUpdate(
        body.opportunityId,
        {
          $addToSet: { milestoneAddedBy: createdBy },
        }
      );
      console.log("OpportunityUpdate--------", OpportunityUpdate);
    }

    if (!title || !type || !category || !gradeLevel || !deadLine) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMilestone = new Milestone({
      image,
      title,
      organization,
      majors,
      type,
      category,
      gradeLevel,
      deadLine,
      description,
      dependencies: dependencies || [],
      linkedOpportunities: linkedOpportunities || [],
      createdBy,
      aiGenerated: aiGenerated || false,
      skipped: false,
      saved: false,
      markedAsDone: false,
      applied: false,
      price: 0, // default value
      perHour: false, // default value
      status: "not_started",
      tier: tier,
      season: season || getSeason(),
      ...(body.opportunityId ? { opportunityId: body.opportunityId } : {}),
    });

    await newMilestone.save();

    return NextResponse.json(
      { message: "Milestone added successfully", milestone: newMilestone },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add milestone", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    // Extract query params from request URL
    const { searchParams } = new URL(req.url);
    const tier = searchParams.get("tier");
    const gradeLevel = searchParams.get("grade");
    const season = searchParams.get("season");
    const userId = searchParams.get("userId");

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Build query object
    let query: any = {
      createdBy: userId,
      tier: tier,
      skipped: false,
    };

    // Add optional filters only if provided
    if (gradeLevel) {
      query.gradeLevel = gradeLevel;
    }
    if (season) {
      query.season = season;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    console.log("query-------", query);

    const totalCount = await Milestone.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated milestones
    const milestones = await Milestone.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        milestones,
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
      { message: "Failed to fetch milestones", error: error.message },
      { status: 500 }
    );
  }
}
