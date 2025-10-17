"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const subjects = [
  { name: "Mathematics", progress: 85, grade: "A-" },
  { name: "English Literature", progress: 78, grade: "B+" },
  { name: "Biology", progress: 92, grade: "A" },
  { name: "History", progress: 73, grade: "B" },
  { name: "Chemistry", progress: 88, grade: "A-" },
]

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Progress</CardTitle>
        <CardDescription>Your performance across all subjects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{subject.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">{subject.progress}%</span>
                <span className="font-medium">{subject.grade}</span>
              </div>
            </div>
            <Progress value={subject.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
