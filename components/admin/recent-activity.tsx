"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, BookOpen, AlertTriangle, Settings } from "lucide-react"

const activities = [
  {
    id: "1",
    type: "user_registration",
    title: "New user registered",
    description: "Sarah Johnson created an account",
    time: "2 minutes ago",
    icon: UserPlus,
    severity: "info",
    user: "Sarah Johnson",
  },
  {
    id: "2",
    type: "course_created",
    title: "Course created",
    description: "Dr. Smith created 'Advanced Mathematics'",
    time: "15 minutes ago",
    icon: BookOpen,
    severity: "info",
    user: "Dr. Smith",
  },
  {
    id: "3",
    type: "security_alert",
    title: "Security alert",
    description: "Multiple failed login attempts detected",
    time: "1 hour ago",
    icon: AlertTriangle,
    severity: "warning",
    user: "System",
  },
  {
    id: "4",
    type: "user_update",
    title: "Profile updated",
    description: "Mike Chen updated his profile information",
    time: "2 hours ago",
    icon: Settings,
    severity: "info",
    user: "Mike Chen",
  },
  {
    id: "5",
    type: "system_update",
    title: "System configuration updated",
    description: "Email notification settings modified",
    time: "3 hours ago",
    icon: Settings,
    severity: "info",
    user: "Admin",
  },
]

const getActivityColor = (type: string, severity: string) => {
  if (severity === "warning") return "text-orange-600"
  if (severity === "error") return "text-red-600"

  switch (type) {
    case "user_registration":
      return "text-green-600"
    case "course_created":
      return "text-blue-600"
    case "security_alert":
      return "text-orange-600"
    case "user_update":
      return "text-blue-600"
    case "system_update":
      return "text-gray-600"
    default:
      return "text-gray-600"
  }
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "warning":
      return (
        <Badge variant="destructive" className="text-xs">
          Warning
        </Badge>
      )
    case "error":
      return (
        <Badge variant="destructive" className="text-xs">
          Error
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="text-xs">
          Info
        </Badge>
      )
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system events and user actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 rounded-full p-2 ${getActivityColor(activity.type, activity.severity)} bg-muted`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(activity.severity)}
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src="/placeholder.svg" alt={activity.user} />
                    <AvatarFallback className="text-xs">
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{activity.user}</span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
