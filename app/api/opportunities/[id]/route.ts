import { verifyToken } from "@/lib/auth/jwt";
import connectDB from "@/lib/mongodb/connection";
import Opportunity from "@/lib/mongodb/models/Opportunity";
import { NextRequest, NextResponse } from "next/server";

// GET single opportunity
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const opportunity = await Opportunity.findById(params.id);

    if (!opportunity) {
      return NextResponse.json(
        { message: "Opportunity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunity, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch opportunity", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    let token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    const userId = payload.userId;
    console.log("body---------", body);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    let updateOperation = {};
    if (body.saved !== undefined) {
      if (body.saved) {
        updateOperation = {
          ...updateOperation,
          $addToSet: { savedBy: userId },
        };
      } else {
        updateOperation = {
          ...updateOperation,
          $pull: { savedBy: userId },
        };
      }
    }
    if (body.ignored !== undefined) {
      if (body.ignored) {
        updateOperation = {
          ...updateOperation,
          $addToSet: { ignoredBy: userId },
        };
      } else {
        updateOperation = {
          ...updateOperation,
          $pull: { ignoredBy: userId },
        };
      }
    }

    const otherFields = { ...body };
    delete otherFields.saved;
    delete otherFields.ignored;

    if (Object.keys(otherFields).length > 0) {
      updateOperation = {
        ...updateOperation,
        $set: otherFields,
      };
    }

    const updated = await Opportunity.findByIdAndUpdate(
      params.id,
      updateOperation,
      { new: true }
    ).populate("savedBy ignoredBy");

    if (!updated) {
      return NextResponse.json(
        { message: "Opportunity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update opportunity", error: error.message },
      { status: 500 }
    );
  }
}

// ----------- PUT update milestone -----------
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const updated = await Opportunity.deleteOne({
      _id: params.id,
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Milestone not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update milestone", error: error.message },
      { status: 500 }
    );
  }
}
