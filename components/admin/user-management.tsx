"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useApi } from "@/hooks/use-api"
import { Users, Mail } from "lucide-react"

interface User {
  id: string
  email: string
  fullName: string
  firstName: string
  lastName: string
  avatar?: string
  isEmailVerified: boolean
  createdAt: string
}

export function UserManagement() {
  const { data, loading, error } = useApi<{ users: User[]; total: number }>("/api/admin/users")

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive">Error loading users: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage platform users</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Send Announcement
            </Button>
            <Button size="sm">
              <Users className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {data?.users?.slice(0, 10).map((user) => (
            <div key={user.id} className="flex items-center space-x-4 rounded-lg border p-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{user.fullName}</h4>
                  {user.isEmailVerified && <span className="text-xs text-green-600">Verified</span>}
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>

              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline">View All Users ({data?.total || 0})</Button>
        </div>
      </CardContent>
    </Card>
  )
}
