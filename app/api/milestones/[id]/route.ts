import connectDB from "@/lib/mongodb/connection";
import Milestone from "@/lib/mongodb/models/Milestone";
import { NextResponse } from "next/server";

// ----------- GET single milestone -----------
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const milestone = await Milestone.findById(params.id);

    if (!milestone) {
      return NextResponse.json(
        { message: "Milestone not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(milestone, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch milestone", error: error.message },
      { status: 500 }
    );
  }
}

// ----------- PUT update milestone -----------
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await Milestone.findByIdAndUpdate(
      params.id,
      { $set: body }, // update any field(s) passed
      { new: true } // return updated document
    );

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

// ----------- PUT update milestone -----------
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const updated = await Milestone.deleteOne({
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
