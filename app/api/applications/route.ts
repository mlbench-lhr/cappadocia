import connectDB from "@/lib/mongodb/connection";
import Applications from "@/lib/mongodb/models/Applications";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, opportunityId } = await req.json();

    if (!userId || !opportunityId) {
      return NextResponse.json(
        { error: "userId and opportunityId are required" },
        { status: 400 }
      );
    }

    // Create Application
    const application = await Applications.create({
      student: userId,
      opportunity: opportunityId,
      status: "applied",
    });

    // Update opportunity with applied flag (or array of users)
    let OpportunityUpdate = await Opportunity.findByIdAndUpdate(opportunityId, {
      $addToSet: { appliedBy: userId },
    });

    return NextResponse.json({
      success: true,
      message: "Applied successfully",
      application,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
