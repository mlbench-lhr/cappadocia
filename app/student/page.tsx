import { StudentLayout } from "@/components/student/student-layout";
import { DashboardStats } from "@/components/student/dashboard-stats";
import { RecentCourses } from "@/components/student/recent-courses";
import { UpcomingAssignments } from "@/components/student/upcoming-assignments";
import { ProgressChart } from "@/components/student/progress-chart";

export default function StudentDashboard() {
  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your studies today.
          </p>
        </div>

        <DashboardStats />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <RecentCourses />
          </div>
          <div className="space-y-6">
            <UpcomingAssignments />
            <ProgressChart />
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
