import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import connectDB from "@/lib/mongodb/connection";
import User, { IUser } from "@/lib/mongodb/models/User";

export const GET = withAuth(async (req) => {
  try {
    const url = new URL(req.url);

    // Get pagination parameters
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 7;
    const searchTerm = url.searchParams.get("search") || "";
    const filtersParam = url.searchParams.get("filters") || "pending";
    const filters = filtersParam.split(",").filter(Boolean);

    await connectDB();

    // Build search query
    const searchQuery: any = { role: "vendor" };

    if (filters.includes("approved")) {
      searchQuery.isRoleVerified = true;
    } else if (filters.includes("rejected")) {
      searchQuery["roleRejected.isRoleRejected"] = true;
      searchQuery.isRoleVerified = false;
    } else {
      // pending by default
      searchQuery.isRoleVerified = false;
      searchQuery["roleRejected.isRoleRejected"] = { $ne: true };
    }

    if (searchTerm.trim()) {
      searchQuery.$or = [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { fullName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated users
    const users: any = await User.find(searchQuery, {
      password: 0,
      resetPasswordToken: 0,
      resetPasswordExpires: 0,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedUsers = await Promise.all(
      users.map(async (user: IUser) => {
        return {
          _id: user._id,
          email: user.email,
          businessName: user.vendorDetails.companyName,
          dateApplied: user.createdAt,
          contactPerson: user.vendorDetails.contactPhoneNumber,
          tursabNumber: user.vendorDetails.tursabNumber,
          createdAt: user.createdAt,
        };
      })
    );

    return NextResponse.json({
      data: formattedUsers,
      pagination: {
        total: totalUsers,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
