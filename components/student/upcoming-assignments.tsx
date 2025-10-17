"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Clock, FileText } from "lucide-react"

const assignments = [
  {
    id: "1",
    title: "Math Problem Set 1",
    course: "Introduction to Mathematics",
    dueDate: "2024-01-15",
    timeLeft: "2 days",
    priority: "high",
    type: "homework",
  },
  {
    id: "2",
    title: "Essay on Hamlet",
    course: "English Literature",
    dueDate: "2024-01-18",
    timeLeft: "5 days",
    priority: "medium",
    type: "essay",
  },
  {
    id: "3",
    title: "Lab Report - Cell Division",
    course: "Biology Basics",
    dueDate: "2024-01-20",
    timeLeft: "1 week",
    priority: "low",
    type: "lab",
  },
]

const priorityColors = {
  high: "destructive",
  medium: "default",
  low: "secondary",
} as const

export function UpcomingAssignments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assignments</CardTitle>
        <CardDescription>Stay on top of your deadlines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="flex items-center space-x-4 rounded-lg border p-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <FileText className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{assignment.title}</h3>
                {/* <Badge variant={priorityColors[assignment.priority]}>{assignment.priority}</Badge> */}
              </div>
              <p className="text-sm text-muted-foreground">{assignment.course}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {assignment.timeLeft} left
                </div>
              </div>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/student/assignments/${assignment.id}`}>View</Link>
            </Button>
          </div>
        ))}
        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href="/student/assignments">View All Assignments</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
