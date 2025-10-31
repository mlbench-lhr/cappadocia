import connectDB from "@/lib/mongodb/connection";
import Blog from "@/lib/mongodb/models/Blog";
import { NextResponse } from "next/server";

// ----------- GET single blog -----------
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { title } = await req.json();
    const blog = await Blog.findOne({ title: title });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch blog", error: error.message },
      { status: 500 }
    );
  }
}

// ----------- PUT update blog -----------
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await Blog.findByIdAndUpdate(
      params.id,
      { $set: body }, // update any field(s) passed
      { new: true } // return updated document
    );

    if (!updated) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update blog", error: error.message },
      { status: 500 }
    );
  }
}

// ----------- PUT update blog -----------
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const updated = await Blog.deleteOne({
      _id: params.id,
    });

    if (!updated) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update blog", error: error.message },
      { status: 500 }
    );
  }
}
