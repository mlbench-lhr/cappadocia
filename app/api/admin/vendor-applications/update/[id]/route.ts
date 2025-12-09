import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import User from "@/lib/mongodb/models/User";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const id = params.id;
    const body = await req.json();
    if (body?.isRoleVerified === true) {
      const commissionDot = body?.["vendorDetails.commission"];
      const commissionNested = body?.vendorDetails?.commission;
      const commissionVal =
        typeof commissionDot !== "undefined" ? commissionDot : commissionNested;
      const num = Number(commissionVal);
      if (
        commissionVal === undefined ||
        Number.isNaN(num) ||
        num < 0 ||
        num > 100
      ) {
        return NextResponse.json(
          {
            error: "Commission percentage (0-100) is required to accept vendor",
          },
          { status: 400 }
        );
      }
    }

    // Update only provided fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      msg: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
