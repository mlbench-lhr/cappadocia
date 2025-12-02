import { NextResponse } from "next/server";
import "@/lib/mongodb/models/booking";
import "@/lib/mongodb/models/ToursAndActivity";
import "@/lib/mongodb/models/User";
import Payments from "@/lib/mongodb/models/Payments";
import connectDB from "@/lib/mongodb/connection";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await Payments.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    )
      .populate("booking")
      .populate("activity")
      .populate("vendor")
      .populate("user");

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
