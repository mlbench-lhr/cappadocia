import { TeacherLayout } from "@/components/teacher/teacher-layout";
import { TeacherStats } from "@/components/teacher/teacher-stats";
import { CourseOverview } from "@/components/teacher/course-overview";
import { RecentActivity } from "@/components/teacher/recent-activity";
import { PendingGrades } from "@/components/teacher/pending-grades";

export default function TeacherDashboard() {
  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your courses, students, and assignments
          </p>
        </div>

        <TeacherStats />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <CourseOverview />
          </div>
          <div className="space-y-6">
            <PendingGrades />
            <RecentActivity />
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
