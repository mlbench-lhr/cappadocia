"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, Clock, Users } from "lucide-react"

const courses = [
  {
    id: "1",
    title: "Introduction to Mathematics",
    instructor: "Dr. Smith",
    progress: 75,
    nextLesson: "Algebra Basics",
    studentsCount: 25,
    timeLeft: "2 days",
    status: "active",
  },
  {
    id: "2",
    title: "English Literature",
    instructor: "Prof. Johnson",
    progress: 45,
    nextLesson: "Shakespeare's Hamlet",
    studentsCount: 18,
    timeLeft: "5 days",
    status: "active",
  },
  {
    id: "3",
    title: "Biology Basics",
    instructor: "Dr. Wilson",
    progress: 90,
    nextLesson: "Final Review",
    studentsCount: 22,
    timeLeft: "1 week",
    status: "completing",
  },
]

export function RecentCourses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Courses</CardTitle>
        <CardDescription>Continue your learning journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="flex items-center space-x-4 rounded-lg border p-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{course.title}</h3>
                <Badge variant={course.status === "active" ? "default" : "secondary"}>{course.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Instructor: {course.instructor}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-1 h-3 w-3" />
                  {course.studentsCount} students
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  Next: {course.timeLeft}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
              <p className="text-sm">Next lesson: {course.nextLesson}</p>
            </div>
            <Button asChild size="sm">
              <Link href={`/student/courses/${course.id}`}>Continue</Link>
            </Button>
          </div>
        ))}
        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href="/student/courses">View All Courses</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
