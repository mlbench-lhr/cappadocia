// app/api/blogs/progress/route.ts
import Blog from "@/lib/mongodb/models/Blog";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  try {
    const reqParams = await params;
    const id = reqParams.id;
    const url = new URL(req.url);
    const grade = url.searchParams.get("grade");
    const season = url.searchParams.get("season");
    console.log("id---", id);

    const blogs = await Blog.find({
      gradeLevel: grade,
      season, // ensure your schema has this field
    });

    const total = blogs.length;
    const completed = blogs.filter((m) => m.completed).length;
    const progressPercent = total ? (completed / total) * 100 : 0;

    return NextResponse.json({ total, completed, progressPercent });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
