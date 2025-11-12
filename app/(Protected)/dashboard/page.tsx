"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect } from "react";

export default function DashboardPage() {
  const userData = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  return (
    <div className="flex flex-col gap-[32px] justify-start items-start w-full"></div>
  );
}
