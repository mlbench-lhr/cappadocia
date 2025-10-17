"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Clock, FileText } from "lucide-react"

const pendingGrades = [
  {
    id: "1",
    assignmentTitle: "Math Problem Set 1",
    courseName: "Introduction to Mathematics",
    studentName: "Sarah Johnson",
    studentAvatar: "/placeholder.svg?height=32&width=32",
    submittedAt: "2 hours ago",
    priority: "high",
  },
  {
    id: "2",
    assignmentTitle: "Physics Lab Report",
    courseName: "Advanced Physics",
    studentName: "Mike Chen",
    studentAvatar: "/placeholder.svg?height=32&width=32",
    submittedAt: "1 day ago",
    priority: "medium",
  },
  {
    id: "3",
    assignmentTitle: "Chemistry Essay",
    courseName: "Chemistry Fundamentals",
    studentName: "Emma Davis",
    studentAvatar: "/placeholder.svg?height=32&width=32",
    submittedAt: "3 days ago",
    priority: "low",
  },
]

const priorityColors = {
  high: "destructive",
  medium: "default",
  low: "secondary",
} as const

export function PendingGrades() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pending Grades</CardTitle>
            <CardDescription>Assignments waiting for review</CardDescription>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/teacher/grading">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingGrades.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 rounded-lg border p-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <FileText className="h-4 w-4 text-accent" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{item.assignmentTitle}</h4>
                {/* <Badge variant={priorityColors[item.priority]} className="text-xs">
                  {item.priority}
                </Badge> */}
              </div>
              <p className="text-xs text-muted-foreground">{item.courseName}</p>
              <div className="flex items-center space-x-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={item.studentAvatar || "/placeholder.svg"} alt={item.studentName} />
                  <AvatarFallback className="text-xs">
                    {item.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{item.studentName}</span>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {item.submittedAt}
                </div>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href={`/teacher/grading/${item.id}`}>Grade</Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
