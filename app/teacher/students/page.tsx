"use client";

import { TeacherLayout } from "@/components/teacher/teacher-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Search, Users, Mail, MessageSquare, BarChart3 } from "lucide-react";
import { useState } from "react";

const students = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    courses: ["Introduction to Mathematics", "Advanced Physics"],
    averageGrade: 92,
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    courses: ["Advanced Physics", "Chemistry Fundamentals"],
    averageGrade: 87,
    status: "active",
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.davis@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    courses: ["Chemistry Fundamentals"],
    averageGrade: 95,
    status: "active",
    lastActive: "3 hours ago",
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    courses: ["Introduction to Mathematics"],
    averageGrade: 78,
    status: "inactive",
    lastActive: "1 week ago",
  },
];

export default function TeacherStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      courseFilter === "all" ||
      student.courses.some((course) =>
        course.toLowerCase().includes(courseFilter.toLowerCase())
      );
    return matchesSearch && matchesCourse;
  });

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Students
            </h1>
            <p className="text-muted-foreground">
              Manage and track your students' progress
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </Button>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Class Analytics
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="mathematics">
                Introduction to Mathematics
              </SelectItem>
              <SelectItem value="physics">Advanced Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry Fundamentals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredStudents.map((student) => (
            <Card
              key={student.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={student.avatar || "/placeholder.svg"}
                      alt={student.name}
                    />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{student.name}</h3>
                      <Badge
                        variant={
                          student.status === "active" ? "default" : "secondary"
                        }
                      >
                        {student.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {student.email}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Courses: {student.courses.join(", ")}</span>
                      <span>Last active: {student.lastActive}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Average Grade
                    </div>
                    <div
                      className={`text-2xl font-bold ${getGradeColor(
                        student.averageGrade
                      )}`}
                    >
                      {student.averageGrade}%
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button asChild size="sm">
                      <Link href={`/teacher/students/${student.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/teacher/students/${student.id}/analytics`}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No students found</h3>
            <p className="mt-2 text-muted-foreground">
              {searchTerm || courseFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No students are enrolled in your courses yet."}
            </p>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
