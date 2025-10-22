import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/connection";
import Blog from "@/lib/mongodb/models/Blog";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const idParams = params;
    const id = idParams.id;
    const { coverImage, title, text } = body;

    if (!id || !title || !coverImage || !text) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { coverImage, title, text },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog updated successfully", blog: updatedBlog },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update blog", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;

    if (!id) {
      return NextResponse.json({ message: "Missing blog ID" }, { status: 400 });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully", blog: deletedBlog },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete blog", error: error.message },
      { status: 500 }
    );
  }
}
