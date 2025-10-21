// /api/admin/users/detail/[id]/blogs/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Blog from "@/lib/mongodb/models/Blog";
import User from "@/lib/mongodb/models/User";
import { getSeason } from "@/lib/helper/timeFunctions";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    const reqParams = await params;
    const userId = reqParams.id;
    const url = new URL(req.url);
    const { blogTier }: any = await User.findById(userId)
      .select("blogTier")
      .lean();
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 7;

    // Get filter parameter (status)
    const statusFilter = url.searchParams.get("status") || "";
    const query: any = {
      createdBy: userId,
      tier: blogTier,
    };
    console.log("query-----", query);

    // Add status filter if provided
    if (statusFilter && statusFilter !== "all") {
      query.status = statusFilter;
      console.log("Filtering by status:", statusFilter);
    }

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(query);

    console.log("Total blogs found:", totalBlogs);

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated blogs
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id createdAt deadLine status title")
      .lean();

    console.log("Blogs returned:", blogs.length);

    return NextResponse.json({
      blogs: blogs,
      total: totalBlogs,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    console.error("User blogs API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
