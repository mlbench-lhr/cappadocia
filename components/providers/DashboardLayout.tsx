"use client";

import type React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import type { RootState } from "@/lib/store/store";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { setReduxUser } from "@/lib/store/slices/authSlice";
import { useMediaQuery } from "react-responsive";
import { Sidebar } from "./UserDashboardLayoutSidebar";
import { Navbar } from "./UserDashboardLayoutNavbar";

// LAYOUT that uses Navbar + Sidebar
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const reduxUserData = useAppSelector((state) => state.auth);
  const { isOpen, isCollapsed } = useSelector((s: RootState) => s.sidebar);
  const desktopWidth = isCollapsed ? "w-20" : "w-[260px]";
  const isMiddleScreen = useMediaQuery({ maxWidth: 1350 });
  const router = useRouter();
  useEffect(() => {
    async function getData() {
      const userData = await getCurrentUser();
      dispatch(setReduxUser(userData.data.user));
    }
    if (!reduxUserData.user) {
      getData();
    }
  }, []);
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-slate-50 w-full flex">
      <Sidebar />
      <div
        className={`flex flex-col items-center w-full ${
          isMiddleScreen && !isCollapsed
            ? "w-full"
            : isCollapsed
            ? "md:w-[calc(100%-80px)]"
            : "md:w-[calc(100%-260px)]"
        }
        ${pathname?.includes("dashboard") ? "bg-[#EFF5F0]" : "bg-white"}
           md:bg-[#EFF5F0]`}
      >
        <Navbar />
        <main
          className={`flex-1 py-[20px] px-[20px] md:py-[32px] md:px-[38px] element`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
