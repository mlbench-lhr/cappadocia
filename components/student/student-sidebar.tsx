"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Calendar, FileText, BarChart3, User, Settings, Home, GraduationCap } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/student",
    icon: Home,
  },
  {
    name: "My Courses",
    href: "/student/courses",
    icon: BookOpen,
  },
  {
    name: "Assignments",
    href: "/student/assignments",
    icon: FileText,
  },
  {
    name: "Schedule",
    href: "/student/schedule",
    icon: Calendar,
  },
  {
    name: "Progress",
    href: "/student/progress",
    icon: BarChart3,
  },
  {
    name: "Grades",
    href: "/student/grades",
    icon: GraduationCap,
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/student/settings",
    icon: Settings,
  },
]

export function StudentSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center border-b px-6">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="ml-2 text-lg font-semibold">Student Portal</span>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.name}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-primary/10 text-primary hover:bg-primary/20")}
              >
                <Link href={item.href}>
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
