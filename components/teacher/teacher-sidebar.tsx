"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Users,
  FileText,
  BarChart3,
  User,
  Settings,
  Home,
  GraduationCap,
  Calendar,
  MessageSquare,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/teacher",
    icon: Home,
  },
  {
    name: "My Courses",
    href: "/teacher/courses",
    icon: BookOpen,
  },
  {
    name: "Students",
    href: "/teacher/students",
    icon: Users,
  },
  {
    name: "Assignments",
    href: "/teacher/assignments",
    icon: FileText,
  },
  {
    name: "Grading",
    href: "/teacher/grading",
    icon: GraduationCap,
  },
  {
    name: "Schedule",
    href: "/teacher/schedule",
    icon: Calendar,
  },
  {
    name: "Messages",
    href: "/teacher/messages",
    icon: MessageSquare,
  },
  {
    name: "Analytics",
    href: "/teacher/analytics",
    icon: BarChart3,
  },
  {
    name: "Profile",
    href: "/teacher/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/teacher/settings",
    icon: Settings,
  },
]

export function TeacherSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center border-b px-6">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="ml-2 text-lg font-semibold">Teacher Portal</span>
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
