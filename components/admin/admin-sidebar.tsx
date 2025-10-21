"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import logo from "@/public/logo.svg";
import {
  Home,
  Users,
  BookOpen,
  BarChart3,
  LayoutDashboard,
  Sprout,
  Trophy,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "All Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Opportunities",
    href: "/admin/opportunities",
    icon: Sprout,
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: Trophy,
  },
  {
    name: "Profile Survey",
    href: "/admin/surveyFields",
    icon: User,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[280px] flex-col bg-card border-r">
      <div className="flex h-fit items-center py-[48px] px-[24px]">
        <Link href={"/"}>
          <Image src={logo.src} alt="" width={88} height={48} />
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-[24px]">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.name}
                asChild
                variant={"ghost"}
                className={cn(
                  "w-full justify-start tex-[16px]",
                  isActive ? "text-[#B32053] font-[600]" : "font-[400]"
                )}
              >
                <Link href={item.href}>
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}
