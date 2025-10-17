import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import User from "@/lib/mongodb/models/User";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reqParams = await params;
    const id = reqParams.id;
    await connectDB();
    console.log("id----", id);

    await User.deleteOne({ _id: id });
    return NextResponse.json({
      msg: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
