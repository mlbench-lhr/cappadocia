import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"

export const GET = withAuth(async (req) => {
  try {
    // Mock data for now - replace with actual database queries
    const courses = [
      {
        id: "1",
        title: "Introduction to Mathematics",
        description: "Basic mathematical concepts and operations",
        teacherId: req.user?.id,
        studentCount: 25,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Advanced Physics",
        description: "Complex physics theories and applications",
        teacherId: req.user?.id,
        studentCount: 18,
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      courses,
      total: courses.length,
    })
  } catch (error) {
    console.error("Teacher courses API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = withAuth(async (req) => {
  try {
    const { title, description } = await req.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    // Mock course creation - replace with actual database insertion
    const newCourse = {
      id: Date.now().toString(),
      title,
      description,
      teacherId: req.user?.id,
      studentCount: 0,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      course: newCourse,
      message: "Course created successfully",
    })
  } catch (error) {
    console.error("Create course API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
