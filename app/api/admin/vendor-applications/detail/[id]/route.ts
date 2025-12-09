// /api/admin/users/detail/[id]/route.ts
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import connectDB from "@/lib/mongodb/connection";
import User, { IUser } from "@/lib/mongodb/models/User";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const reqParams = await params;
    const id = reqParams.id;

    await connectDB();
    console.log("Fetching user with id:", id);

    // Get user details
    const user: any = await User.findOne({ _id: id })
      .select("vendorDetails isRoleVerified roleRejected")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user);

    return NextResponse.json({
      user: user?.vendorDetails,
      isRoleVerified: !!user?.isRoleVerified,
      isRejected: !!user?.roleRejected?.isRoleRejected,
    });
  } catch (error) {
    console.error("User detail API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
