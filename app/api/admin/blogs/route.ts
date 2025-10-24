import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Blog from "@/lib/mongodb/models/Blog";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 7;
    const searchTerm = url.searchParams.get("search") || "";
    await connectDB();
    const searchQuery: any = {};
    if (searchTerm.trim()) {
      searchQuery.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
      ];
    }
    const totalBlogs = await Blog.countDocuments(searchQuery);
    const skip = (page - 1) * limit;
    const blogs = await Blog.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-text")
      .lean();
    const blogsWithSrNo = blogs.map((blog, index) => ({
      ...blog,
      srNo: skip + index + 1,
    }));
    return NextResponse.json({
      blogs: blogsWithSrNo,
      total: totalBlogs,
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
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { coverImage, title, text } = body;
    console.log("coverImage, title, text ---------", coverImage, title, text);
    if (!title || !coverImage || !text) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newBlog = new Blog({
      coverImage,
      title,
      text,
    });

    await newBlog.save();

    return NextResponse.json(
      { message: "Blog added successfully", blog: newBlog },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add blog", error: error.message },
      { status: 500 }
    );
  }
}
