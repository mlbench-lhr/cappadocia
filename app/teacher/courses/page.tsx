"use client";

import { TeacherLayout } from "@/components/teacher/teacher-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Users,
  Calendar,
  Plus,
  Settings,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  studentCount: number;
  createdAt: string;
}

export default function TeacherCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error } = useApi<{ courses: Course[]; total: number }>(
    "/api/teacher/courses"
  );

  const filteredCourses = data?.courses?.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </TeacherLayout>
    );
  }

  if (error) {
    return (
      <TeacherLayout>
        <div className="text-center text-destructive">
          Error loading courses: {error}
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              My Courses
            </h1>
            <p className="text-muted-foreground">
              Create and manage your courses
            </p>
          </div>
          <Button asChild>
            <Link href="/teacher/courses/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Link>
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
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    {course.studentCount} students
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    Created {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href={`/teacher/courses/${course.id}`}>Manage</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/teacher/courses/${course.id}/settings`}>
                      <Settings className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/teacher/courses/${course.id}/analytics`}>
                      <BarChart3 className="h-4 w-4" />
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
                : "You haven't created any courses yet."}
            </p>
            {!searchTerm && (
              <Button asChild className="mt-4">
                <Link href="/teacher/courses/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Course
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
