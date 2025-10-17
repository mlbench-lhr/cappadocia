"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Database, Server, Wifi, CheckCircle } from "lucide-react"

const systemMetrics = [
  {
    name: "CPU Usage",
    value: 67,
    status: "normal",
    icon: Activity,
    description: "Average load across all servers",
  },
  {
    name: "Memory Usage",
    value: 82,
    status: "warning",
    icon: Server,
    description: "RAM utilization",
  },
  {
    name: "Database Performance",
    value: 94,
    status: "good",
    icon: Database,
    description: "Query response time",
  },
  {
    name: "Network Latency",
    value: 23,
    status: "good",
    icon: Wifi,
    description: "Average response time (ms)",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "good":
      return "text-green-600"
    case "warning":
      return "text-orange-600"
    case "critical":
      return "text-red-600"
    default:
      return "text-blue-600"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "good":
      return <Badge className="bg-green-100 text-green-800">Good</Badge>
    case "warning":
      return <Badge className="bg-orange-100 text-orange-800">Warning</Badge>
    case "critical":
      return <Badge className="bg-red-100 text-red-800">Critical</Badge>
    default:
      return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
  }
}

export function SystemHealth() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time platform performance metrics</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-600 font-medium">All Systems Operational</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                  <span className="font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {metric.name === "Network Latency" ? `${metric.value}ms` : `${metric.value}%`}
                  </span>
                  {getStatusBadge(metric.status)}
                </div>
              </div>
              <Progress value={metric.name === "Network Latency" ? 100 - metric.value : metric.value} className="h-2" />
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
