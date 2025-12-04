import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import User from "@/lib/mongodb/models/User";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;
    const user = await User.findById(id)
      .select("fullName avatar role vendorDetails")
      .lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const displayName =
      user.role === "vendor"
        ? user.vendorDetails?.companyName || user.fullName
        : user.fullName;
    return NextResponse.json({
      user: {
        id: id,
        fullName: displayName,
        avatar: user.avatar || "/placeholderDp.png",
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
