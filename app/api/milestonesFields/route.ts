import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import MilestoneFields from "@/lib/mongodb/models/MilestoneFields";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const field = searchParams.get("field");
    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "9");

    const milestonesFields: any = await MilestoneFields.findOne()
      .sort({ createdAt: -1 })
      .lean();

    if (!milestonesFields) {
      return NextResponse.json({
        fields: {
          tier: [],
          type: [],
          category: [],
        },
        counts: {
          tier: 0,
          type: 0,
          category: 0,
        },
      });
    }

    // If specific field is requested (Load More functionality)
    if (field) {
      const fieldData = milestonesFields[field] || [];
      const paginatedItems = fieldData.slice(offset, offset + limit);

      return NextResponse.json({
        success: true,
        items: paginatedItems,
        total: fieldData.length,
        offset,
        limit,
      });
    }

    // Initial load - return only first 9 items of each field
    const INITIAL_LIMIT = 9;

    return NextResponse.json({
      fields: {
        tier: (milestonesFields.tier || []).slice(0, INITIAL_LIMIT),
        type: (milestonesFields.type || []).slice(0, INITIAL_LIMIT),
        category: (milestonesFields.category || []).slice(0, INITIAL_LIMIT),
      },
      counts: {
        tier: (milestonesFields.tier || []).length,
        type: (milestonesFields.type || []).length,
        category: (milestonesFields.category || []).length,
      },
    });
  } catch (error) {
    console.error("Admin fields API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { tier, type, category } = body;

    if (!tier || !type || !category) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const updated = await MilestoneFields.findOneAndUpdate(
      {},
      { tier, type, category },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json(
      { success: true, milestone: updated },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
