import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import connectDB from "@/lib/mongodb/connection";
import User from "@/lib/mongodb/models/User";
import Blog from "@/lib/mongodb/models/Blog";

export const GET = withAuth(async (req) => {
  try {
    const url = new URL(req.url);

    // Get pagination parameters
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 7;
    const searchTerm = url.searchParams.get("search") || "";

    await connectDB();

    // Build search query
    const searchQuery: any = { role: "user" };

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
    const users = await User.find(searchQuery, {
      password: 0,
      resetPasswordToken: 0,
      resetPasswordExpires: 0,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedUsers = await Promise.all(
      users.map(async (user) => {
        const blogs = await Blog.find({
          createdBy: user._id,
        });
        console.log("user._id", user._id);
        const total = blogs?.length;
        const completed = blogs.filter((m) => m.completed)?.length;
        const progressPercent = total ? (completed / total) * 100 : 0;

        return {
          id: user._id,
          email: user.email,
          fullName: user.firstName + user.lastName,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          progressPercent: progressPercent,
        };
      })
    );

    return NextResponse.json({
      users: formattedUsers,
      total: totalUsers,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
