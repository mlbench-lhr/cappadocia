"use client";

import { StudentLayout } from "@/components/student/student-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import Link from "next/link";
import { BookOpen, Search, Clock, Star } from "lucide-react";
import { useState } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
  teacherName: string;
  progress: number;
  nextLesson: string;
  enrolledAt: string;
}

export default function StudentCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error } = useApi<{ courses: Course[]; total: number }>(
    "/api/student/courses"
  );

  const filteredCourses = data?.courses?.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="text-center text-destructive">
          Error loading courses: {error}
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              My Courses
            </h1>
            <p className="text-muted-foreground">
              Manage your enrolled courses and track progress
            </p>
          </div>
          <Button asChild>
            <Link href="/student/courses/browse">Browse Courses</Link>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses?.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {course.description}
                    </CardDescription>
                  </div>
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Instructor: {course.teacherName}</span>
                  <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1" />
                    4.8
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  Next: {course.nextLesson}
                </div>

                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href={`/student/courses/${course.id}`}>
                      Continue Learning
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/student/courses/${course.id}/details`}>
                      Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses?.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No courses found</h3>
            <p className="mt-2 text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms."
                : "You haven't enrolled in any courses yet."}
            </p>
            {!searchTerm && (
              <Button asChild className="mt-4">
                <Link href="/student/courses/browse">
                  Browse Available Courses
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
