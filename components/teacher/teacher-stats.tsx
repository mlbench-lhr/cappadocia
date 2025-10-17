"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, FileText, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Active Courses",
    value: "4",
    description: "Currently teaching",
    icon: BookOpen,
    color: "text-blue-600",
  },
  {
    title: "Total Students",
    value: "127",
    description: "Across all courses",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Pending Grades",
    value: "23",
    description: "Assignments to review",
    icon: FileText,
    color: "text-orange-600",
  },
  {
    title: "Avg. Performance",
    value: "84%",
    description: "Class average",
    icon: TrendingUp,
    color: "text-purple-600",
  },
]

export function TeacherStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
