"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Clock, Trophy } from "lucide-react"

const stats = [
  {
    title: "Enrolled Courses",
    value: "6",
    description: "Active courses",
    icon: BookOpen,
    color: "text-blue-600",
  },
  {
    title: "Pending Assignments",
    value: "3",
    description: "Due this week",
    icon: FileText,
    color: "text-orange-600",
  },
  {
    title: "Study Hours",
    value: "24.5",
    description: "This month",
    icon: Clock,
    color: "text-green-600",
  },
  {
    title: "Average Grade",
    value: "87%",
    description: "Overall performance",
    icon: Trophy,
    color: "text-purple-600",
  },
]

export function DashboardStats() {
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
