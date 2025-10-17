"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, MessageSquare, UserPlus, Award } from "lucide-react"

const activities = [
  {
    id: "1",
    type: "submission",
    title: "New assignment submission",
    description: "Sarah Johnson submitted Math Problem Set 1",
    time: "2 minutes ago",
    icon: FileText,
    student: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "2",
    type: "message",
    title: "New message",
    description: "Mike Chen asked a question about Physics Lab 3",
    time: "15 minutes ago",
    icon: MessageSquare,
    student: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "3",
    type: "enrollment",
    title: "New student enrolled",
    description: "Emma Davis joined Advanced Physics course",
    time: "1 hour ago",
    icon: UserPlus,
    student: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "4",
    type: "achievement",
    title: "Student achievement",
    description: "Alex Rodriguez completed all Chemistry assignments",
    time: "3 hours ago",
    icon: Award,
    student: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
]

const getActivityColor = (type: string) => {
  switch (type) {
    case "submission":
      return "text-blue-600"
    case "message":
      return "text-green-600"
    case "enrollment":
      return "text-purple-600"
    case "achievement":
      return "text-orange-600"
    default:
      return "text-gray-600"
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your courses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 rounded-full p-2 ${getActivityColor(activity.type)} bg-muted`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.student.avatar || "/placeholder.svg"} alt={activity.student.name} />
                    <AvatarFallback className="text-xs">
                      {activity.student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{activity.student.name}</span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
