import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"

export const GET = withAuth(async (req) => {
  try {
    // Mock data for now - replace with actual database queries
    const assignments = [
      {
        id: "1",
        title: "Math Problem Set 1",
        courseTitle: "Introduction to Mathematics",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        status: "pending",
        grade: null,
      },
      {
        id: "2",
        title: "Essay on Hamlet",
        courseTitle: "English Literature",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        status: "submitted",
        grade: 85,
      },
      {
        id: "3",
        title: "Science Lab Report",
        courseTitle: "Biology Basics",
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        status: "graded",
        grade: 92,
      },
    ]

    return NextResponse.json({
      assignments,
      total: assignments.length,
    })
  } catch (error) {
    console.error("Student assignments API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
