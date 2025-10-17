import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import ProfileFields, {
  ProfileFieldsType,
} from "@/lib/mongodb/models/ProfileFields";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const field = searchParams.get("field");
    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "9");

    const profileFields: any = await ProfileFields.findOne()
      .sort({ createdAt: -1 })
      .lean();

    if (!profileFields) {
      return NextResponse.json({
        fields: {
          race: [],
          annualIncome: [],
          gradeLevel: [],
          dreamSchool: [],
          recognitionLevel: [],
          activityType: [],
        },
        counts: {
          race: 0,
          annualIncome: 0,
          gradeLevel: 0,
          dreamSchool: 0,
          recognitionLevel: 0,
          activityType: 0,
        },
      });
    }

    // If specific field is requested (Load More functionality)
    if (field) {
      const fieldData = profileFields[field] || [];
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
        race: (profileFields.race || []).slice(0, INITIAL_LIMIT),
        annualIncome: (profileFields.annualIncome || []).slice(
          0,
          INITIAL_LIMIT
        ),
        gradeLevel: (profileFields.gradeLevel || []).slice(0, INITIAL_LIMIT),
        dreamSchool: (profileFields.dreamSchool || []).slice(0, INITIAL_LIMIT),
        recognitionLevel: (profileFields.recognitionLevel || []).slice(
          0,
          INITIAL_LIMIT
        ),
        activityType: (profileFields.activityType || []).slice(
          0,
          INITIAL_LIMIT
        ),
      },
      counts: {
        race: (profileFields.race || []).length,
        annualIncome: (profileFields.annualIncome || []).length,
        gradeLevel: (profileFields.gradeLevel || []).length,
        dreamSchool: (profileFields.dreamSchool || []).length,
        recognitionLevel: (profileFields.recognitionLevel || []).length,
        activityType: (profileFields.activityType || []).length,
      },
    });
  } catch (error) {
    console.error("GET /profile-fields error:", error);
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
    const {
      race,
      annualIncome,
      gradeLevel,
      dreamSchool,
      recognitionLevel,
      activityType,
    } = body;

    if (
      !race ||
      !annualIncome ||
      !gradeLevel ||
      !dreamSchool ||
      !recognitionLevel ||
      !activityType
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updated = await ProfileFields.findOneAndUpdate(
      {},
      {
        race,
        annualIncome,
        gradeLevel,
        dreamSchool,
        recognitionLevel,
        activityType,
      },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({
      success: true,
      fields: updated,
    });
  } catch (error: any) {
    console.error("PUT /profile-fields error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
