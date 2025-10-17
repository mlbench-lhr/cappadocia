"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown } from "lucide-react"

const analyticsData = [
  {
    title: "User Growth",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    description: "Total registered users",
    progress: 75,
  },
  {
    title: "Course Completion Rate",
    value: "78.3%",
    change: "+5.2%",
    trend: "up",
    description: "Average completion rate",
    progress: 78,
  },
  {
    title: "Active Sessions",
    value: "1,234",
    change: "-2.1%",
    trend: "down",
    description: "Current active users",
    progress: 65,
  },
  {
    title: "Teacher Engagement",
    value: "89.7%",
    change: "+8.3%",
    trend: "up",
    description: "Weekly active teachers",
    progress: 90,
  },
]

export function PlatformAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Analytics</CardTitle>
        <CardDescription>Key performance indicators and trends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {analyticsData.map((item) => (
          <div key={item.title} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-2xl font-bold">{item.value}</p>
                <div className="flex items-center space-x-1">
                  {item.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
            <Progress value={item.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
