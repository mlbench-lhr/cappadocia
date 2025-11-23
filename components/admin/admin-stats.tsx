"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Activity,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "2,847",
    description: "+12% from last month",
    icon: Users,
    color: "text-blue-600",
    trend: "up",
  },
  {
    title: "active Courses",
    value: "156",
    description: "+8 new this week",
    icon: BookOpen,
    color: "text-green-600",
    trend: "up",
  },
  {
    title: "Teachers",
    value: "89",
    description: "+3 this month",
    icon: GraduationCap,
    color: "text-purple-600",
    trend: "up",
  },
  {
    title: "System Load",
    value: "67%",
    description: "Normal operation",
    icon: Activity,
    color: "text-orange-600",
    trend: "stable",
  },
  {
    title: "Revenue",
    value: "$24,580",
    description: "+18% from last month",
    icon: TrendingUp,
    color: "text-emerald-600",
    trend: "up",
  },
  {
    title: "Issues",
    value: "3",
    description: "2 resolved today",
    icon: AlertTriangle,
    color: "text-red-600",
    trend: "down",
  },
];

export function AdminStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
