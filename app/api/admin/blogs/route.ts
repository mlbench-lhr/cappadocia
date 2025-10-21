import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import connectDB from "@/lib/mongodb/connection";
import Blog from "@/lib/mongodb/models/Blog";
import User from "@/lib/mongodb/models/User";

export const GET = withAuth(async (req) => {
  try {
    const url = new URL(req.url);

    // Get pagination parameters
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 7;
    const searchTerm = url.searchParams.get("search") || "";

    await connectDB();

    // Build search query
    const searchQuery: any = {};

    if (searchTerm.trim()) {
      searchQuery.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // IMPORTANT: Get total count BEFORE pagination
    const totalBlogs = await Blog.countDocuments(searchQuery);

    console.log("Total blogs found:", totalBlogs); // Debug log

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated blogs
    const blogs = await Blog.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log("Blogs returned:", blogs.length); // Debug log

    // Get unique user IDs from current page blogs
    const userIds = blogs.map((m) => m.createdBy);

    // Fetch users for current page only
    const users = await User.find(
      { _id: { $in: userIds } },
      "lastName avatar firstName"
    ).lean();

    // Format blogs with user data
    const formattedUsers = blogs.map((m) => {
      const user = users.find((u: any) => u._id.toString() === m.createdBy);
      return {
        id: m._id,
        title: m.title,
        status: m.status,
        dueDate: m.deadLine,
        createdAt: m.createdAt,
        fullName: user?.firstName + " " + user?.lastName || "Unknown User",
        avatar:
          user?.avatar ||
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      };
    });

    // Return totalBlogs (from countDocuments), NOT formattedUsers.length
    return NextResponse.json({
      users: formattedUsers,
      total: totalBlogs, // ← Total from database, not array length
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    console.error("Admin blogs API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
