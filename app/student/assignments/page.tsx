"use client";

import { StudentLayout } from "@/components/student/student-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/hooks/use-api";
import Link from "next/link";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  courseTitle: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade: number | null;
}

export default function StudentAssignmentsPage() {
  const { data, loading, error } = useApi<{
    assignments: Assignment[];
    total: number;
  }>("/api/student/assignments");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "submitted":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "graded":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "destructive";
      case "submitted":
        return "default";
      case "graded":
        return "secondary";
      default:
        return "outline";
    }
  };

  const filterAssignments = (status?: string) => {
    if (!data?.assignments) return [];
    if (!status) return data.assignments;
    return data.assignments.filter(
      (assignment) => assignment.status === status
    );
  };

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
          Error loading assignments: {error}
        </div>
      </StudentLayout>
    );
  }

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => (
    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center">
              {getStatusIcon(assignment.status)}
              <span className="ml-2">{assignment.title}</span>
            </CardTitle>
            <CardDescription className="mt-1">
              {assignment.courseTitle}
            </CardDescription>
          </div>
          <Badge variant={getStatusColor(assignment.status) as any}>
            {assignment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </div>
          {assignment.grade && (
            <div className="font-medium text-primary">
              Grade: {assignment.grade}%
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button asChild className="flex-1">
            <Link href={`/student/assignments/${assignment.id}`}>
              {assignment.status === "pending"
                ? "Start Assignment"
                : "View Details"}
            </Link>
          </Button>
          {assignment.status === "pending" && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/student/assignments/${assignment.id}/submit`}>
                Submit
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Assignments
          </h1>
          <p className="text-muted-foreground">
            Track and manage your course assignments
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All ({data?.assignments?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({filterAssignments("pending").length})
            </TabsTrigger>
            <TabsTrigger value="submitted">
              Submitted ({filterAssignments("submitted").length})
            </TabsTrigger>
            <TabsTrigger value="graded">
              Graded ({filterAssignments("graded").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data?.assignments?.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterAssignments("pending").map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submitted" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterAssignments("submitted").map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="graded" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterAssignments("graded").map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {data?.assignments?.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No assignments yet</h3>
            <p className="mt-2 text-muted-foreground">
              Assignments from your enrolled courses will appear here.
            </p>
            <Button asChild className="mt-4">
              <Link href="/student/courses">Browse Courses</Link>
            </Button>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
