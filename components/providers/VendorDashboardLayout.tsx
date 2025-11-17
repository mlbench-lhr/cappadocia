"use client";

import type React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import type { RootState } from "@/lib/store/store";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { setReduxUser } from "@/lib/store/slices/authSlice";
import { useMediaQuery } from "react-responsive";
import { Navbar } from "./UserDashboardLayoutNavbar";
import { Sidebar } from "./VendorDashboardLayoutSidebar";

// LAYOUT that uses Navbar + Sidebar
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const reduxUserData = useAppSelector((state) => state.auth);
  const { isCollapsed } = useSelector((s: RootState) => s.sidebar);
  const isMiddleScreen = useMediaQuery({ maxWidth: 1350 });
  useEffect(() => {
    async function getData() {
      const userData = await getCurrentUser();
      dispatch(setReduxUser(userData.data.user));
    }
    if (!reduxUserData.user) {
      getData();
    }
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 w-full flex">
      <Sidebar />
      <div
        className={`flex flex-col items-center w-full bg-white ${
          isMiddleScreen && !isCollapsed
            ? "w-full"
            : isCollapsed
            ? "md:w-[calc(100%-80px)]"
            : "md:w-[calc(100%-260px)]"
        }`}
      >
        <Navbar />
        <main className={`flex-1 py-3 px-5 element`}>{children}</main>
      </div>
    </div>
  );
}
