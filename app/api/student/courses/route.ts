import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"

export const GET = withAuth(async (req) => {
  try {
    // Mock data for now - replace with actual database queries
    const enrolledCourses = [
      {
        id: "1",
        title: "Introduction to Mathematics",
        description: "Basic mathematical concepts and operations",
        teacherName: "Dr. Smith",
        progress: 75,
        nextLesson: "Algebra Basics",
        enrolledAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "English Literature",
        description: "Classic and modern literature analysis",
        teacherName: "Prof. Johnson",
        progress: 45,
        nextLesson: "Shakespeare's Hamlet",
        enrolledAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      courses: enrolledCourses,
      total: enrolledCourses.length,
    })
  } catch (error) {
    console.error("Student courses API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
