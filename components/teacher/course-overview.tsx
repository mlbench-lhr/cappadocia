"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { BookOpen, Users, Calendar, Plus } from "lucide-react"

const courses = [
  {
    id: "1",
    title: "Introduction to Mathematics",
    description: "Basic mathematical concepts and operations",
    studentCount: 25,
    completionRate: 78,
    nextClass: "Today, 2:00 PM",
    status: "active",
  },
  {
    id: "2",
    title: "Advanced Physics",
    description: "Complex physics theories and applications",
    studentCount: 18,
    completionRate: 65,
    nextClass: "Tomorrow, 10:00 AM",
    status: "active",
  },
  {
    id: "3",
    title: "Chemistry Fundamentals",
    description: "Introduction to chemical principles",
    studentCount: 22,
    completionRate: 85,
    nextClass: "Friday, 1:00 PM",
    status: "active",
  },
]

export function CourseOverview() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Manage your active courses</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/teacher/courses/create">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        </div>
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
                <Badge variant="secondary">{course.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{course.description}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-1 h-3 w-3" />
                  {course.studentCount} students
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {course.nextClass}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Completion Rate</span>
                  <span>{course.completionRate}%</span>
                </div>
                <Progress value={course.completionRate} className="h-2" />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button asChild size="sm">
                <Link href={`/teacher/courses/${course.id}`}>Manage</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/teacher/courses/${course.id}/students`}>Students</Link>
              </Button>
            </div>
          </div>
        ))}
        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href="/teacher/courses">View All Courses</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
