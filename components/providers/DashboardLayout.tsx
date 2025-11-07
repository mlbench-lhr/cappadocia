"use client";

import type React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import logo from "@/public/logo.png";
import bell from "@/public/bell.svg";
import dashboardIcon from "@/public/layout-dashboard.svg";
import opportunityIcon from "@/public/sprout.svg";
import blogIcon from "@/public/trophy.svg";
import calendarIcon from "@/public/calendar-days.svg";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import type { RootState } from "@/lib/store/store";
import pencil from "@/public/pencil.svg";
import logOutIcon from "@/public/log-out.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  closeSidebar,
  toggleCollapse,
  toggleSetting,
  toggleSidebar,
} from "@/lib/store/slices/sidebarSlice";
import Image from "next/image";
import { Lock, Menu, X } from "lucide-react";
import LogoutDialog from "../LogoutDialog";
import Link from "next/link";
import { setCount, setHasNew } from "@/lib/store/slices/notificationSlice";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { setReduxUser } from "@/lib/store/slices/authSlice";
import { useMediaQuery } from "react-responsive";
import DeleteAccountDialog from "../DeleteAccountDialog";

const IconMenu = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const IconClose = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconChevron = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// Profile Dropdown (shadcn-like structure)
function ProfileMenu() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth.user);
  const { settingOpen } = useAppSelector((state) => state.sidebar);

  return (
    <div className="relative">
      <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-slate-200 flex items-center justify-center cursor-pointer">
        <Popover>
          <PopoverTrigger asChild>
            <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-slate-200 flex items-center justify-center cursor-pointer">
              {userData?.avatar ? (
                <Image
                  src={userData?.avatar as string}
                  alt="user avatar"
                  width={48}
                  height={48}
                  className="object-cover w-[48px] h-[48px]"
                />
              ) : (
                <span className="text-lg font-medium">
                  {userData?.firstName?.charAt(0)}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[234px] overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 p-0 right-0 md:right-0 absolute">
            <div className="py-1 p-[20px]">
              <Link href={"/update-profile"} className="flex gap-1">
                <Image src={pencil.src} alt="" width={16} height={16} />
                <span className="block px-4 py-2 text-sm">Update Profile</span>
              </Link>
              <Link href={"/settings/changePassword"} className="flex gap-1">
                <Lock size={16} strokeWidth={2} className="mt-2" />
                <span className="block px-4 py-2 text-sm">Change Password</span>
              </Link>
              <LogoutDialog />
              <DeleteAccountDialog />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

// NAVBAR
export function Navbar() {
  const dispatch = useAppDispatch();
  const { isOpen, isCollapsed } = useSelector((s: RootState) => s.sidebar);
  const hasNew = useAppSelector((s) => s.notification.hasNew);
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch("/api/notifications", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (!isMounted) return;
        if (Array.isArray(json)) {
          dispatch(setCount(json.length));
          dispatch(setHasNew(json.some((n: any) => n.isUnread)));
        }
      } catch {
        // ignore fetch aborts / errors
      }
    }

    // initial load
    load();

    // revalidate on focus (replacement for SWR's revalidateOnFocus)
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);

    return () => {
      isMounted = false;
      controller.abort();
      window.removeEventListener("focus", onFocus);
    };
  }, [dispatch]);

  return (
    <header className="w-full bg-white border-b h-[78px] flex justify-end items-center">
      <div className="w-full px-4 sm:px-6 lg:px-[32px]">
        <div className="h-fit flex items-center justify-between w-full">
          <div className="flex items-center gap-4 justify-between w-full">
            <Image
              src={logo.src}
              alt=""
              width={59}
              height={32}
              className="flex md:hidden"
            />

            <button
              onClick={() => dispatch(toggleCollapse())}
              className={`hidden ${
                isCollapsed && "md:inline-flex"
              } mt-1 ml-[-20px]`}
            >
              <Menu className="h-[16px] w-[16px]" />
            </button>

            {/* Mobile menu button: toggles sidebar sheet */}
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 md:hidden rounded-md hover:bg-[#F5FBF5] h-[36px]"
              aria-label="Toggle menu"
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-[32px]">
            <Link
              href={"/Notifications"}
              className="relative"
              onClick={() => dispatch(setHasNew(false))}
            >
              <Image
                src={bell.src}
                alt=""
                width={24}
                height={24}
                className="cursor-pointer"
              />
              {hasNew && (
                <span
                  className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"
                  aria-label="New notifications"
                />
              )}
            </Link>
            <div className="relative cursor-pointer">
              <ProfileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// SIDEBAR
export function Sidebar() {
  const dispatch = useAppDispatch();
  const { isOpen, isCollapsed } = useSelector((s: RootState) => s.sidebar);
  const desktopWidth = isCollapsed ? "w-20" : "w-[260px]";
  const userData = useAppSelector((state) => state.auth.user);
  const pathname = usePathname(); // ✅ current route

  const isMiddleScreen = useMediaQuery({ maxWidth: 1350 }); // below 1200px

  useEffect(() => {
    if (isMiddleScreen) {
      dispatch(toggleCollapse());
    }
  }, [isMiddleScreen, dispatch]);

  return (
    <>
      {/* Desktop sidebar */}
      {!isMiddleScreen && (
        <aside
          className={`gap-[40px] hidden md:flex flex-col bg-white border-r ${desktopWidth} transition-width duration-200 shrink-0 p-[20px]`}
        >
          <div className="flex items-start justify-between font-semibold w-full">
            <Link href={"/"}>
              <Image src={logo.src} alt="" width={59} height={32} />
            </Link>
            <button
              onClick={() => dispatch(toggleCollapse())}
              className={`hidden ${!isCollapsed && "md:inline-flex"} mt-1`}
            >
              <X className="h-[16px] w-[16px]" />
            </button>
          </div>
          <nav className="flex-1 space-y-[32px] overflow-auto plan-text-style-4">
            <Link
              href={"/dashboard"}
              className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                pathname.includes("dashboard")
                  ? "bg-[#F5FBF5]"
                  : "hover:bg-[#F5FBF5]"
              }`}
            >
              <Image src={dashboardIcon.src} alt="" width={16} height={16} />
              {!isCollapsed && "Dashboard"}
            </Link>
            <Link
              href={"/opportunities"}
              className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                pathname.includes("opportunities")
                  ? "bg-[#F5FBF5]"
                  : "hover:bg-[#F5FBF5]"
              }`}
            >
              <Image src={opportunityIcon.src} alt="" width={16} height={16} />
              {!isCollapsed && "Opportunities"}
            </Link>
            <Link
              href={"/blogs"}
              className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                pathname.includes("blogs")
                  ? "bg-[#F5FBF5]"
                  : "hover:bg-[#F5FBF5]"
              }`}
            >
              <Image src={blogIcon.src} alt="" width={16} height={16} />
              {!isCollapsed && "Blogs"}
            </Link>
            <Link
              href={"/calendar"}
              className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                pathname.includes("calendar")
                  ? "bg-[#F5FBF5]"
                  : "hover:bg-[#F5FBF5]"
              }`}
            >
              <Image src={calendarIcon.src} alt="" width={16} height={16} />
              {!isCollapsed && "Calendar"}
            </Link>
          </nav>
          <div className="p-4 border-t hidden">
            <button
              onClick={() => dispatch(closeSidebar())}
              className="text-sm hidden"
            >
              Close
            </button>
          </div>
        </aside>
      )}
      {isMiddleScreen && (
        <div
          className={`inset-y-0 left-0 z-40 ${
            !isCollapsed ? "translate-x-0 fixed" : ""
          } transform transition-transform duration-200`}
        >
          <aside
            className={`gap-[40px] h-full hidden md:flex flex-col bg-white border-r ${desktopWidth} transition-width duration-200 shrink-0 p-[20px]`}
          >
            <div className="flex items-start justify-between font-semibold w-full">
              <Link href={"/"}>
                <Image src={logo.src} alt="" width={59} height={32} />
              </Link>
              <button
                onClick={() => dispatch(toggleCollapse())}
                className={`hidden ${!isCollapsed && "md:inline-flex"} mt-1`}
              >
                <X className="h-[16px] w-[16px]" />
              </button>
            </div>
            <nav className="flex-1 space-y-[32px] overflow-auto plan-text-style-4">
              <Link
                href={"/dashboard"}
                className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                  pathname.includes("dashboard")
                    ? "bg-[#F5FBF5]"
                    : "hover:bg-[#F5FBF5]"
                }`}
              >
                <Image src={dashboardIcon.src} alt="" width={16} height={16} />
                {!isCollapsed && "Dashboard"}
              </Link>
              <Link
                href={"/opportunities"}
                className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                  pathname.includes("opportunities")
                    ? "bg-[#F5FBF5]"
                    : "hover:bg-[#F5FBF5]"
                }`}
              >
                <Image
                  src={opportunityIcon.src}
                  alt=""
                  width={16}
                  height={16}
                />
                {!isCollapsed && "Opportunities"}
              </Link>
              <Link
                href={"/blogs"}
                className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                  pathname.includes("blogs")
                    ? "bg-[#F5FBF5]"
                    : "hover:bg-[#F5FBF5]"
                }`}
              >
                <Image src={blogIcon.src} alt="" width={16} height={16} />
                {!isCollapsed && "Blogs"}
              </Link>
              <Link
                href={"/calendar"}
                className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                  pathname.includes("calendar")
                    ? "bg-[#F5FBF5]"
                    : "hover:bg-[#F5FBF5]"
                }`}
              >
                <Image src={calendarIcon.src} alt="" width={16} height={16} />
                {!isCollapsed && "Calendar"}
              </Link>
            </nav>
            <div className="p-4 border-t hidden">
              <button
                onClick={() => dispatch(closeSidebar())}
                className="text-sm hidden"
              >
                Close
              </button>
            </div>
          </aside>
        </div>
      )}
      {/* Mobile sheet / drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transform transition-transform duration-200`}
      >
        <div className="min-w-[335px] bg-white h-full shadow-xl flex flex-col">
          <div className="pt-[40px] pb-[16px] px-[20px] flex items-start justify-between border-b flex-col gap-[12px] w-full">
            <div className="flex justify-between items-start w-full">
              {userData?.avatar ? (
                <Image
                  src={userData?.avatar as string}
                  alt=""
                  width={48}
                  height={48}
                  className="rounded-full overflow-hidden bg-green-400 flex items-center justify-center cursor-pointer w-[48px] h-[48px] object-cover object-center"
                />
              ) : (
                <>{userData?.firstName?.split("")[0]}</>
              )}

              <button
                onClick={() => dispatch(closeSidebar())}
                className="p-2 rounded-md hover:bg-[#F5FBF5] h-[36px]"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
            <div className="plan-text-style-4">{userData?.fullName}</div>
          </div>

          <nav className="flex flex-col justify-start items-start gap-[24px] px-2 py-4 space-y-1 overflow-auto plan-text-style-4">
            <Link
              href={"/dashboard"}
              className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                pathname.includes("dashboard")
                  ? "bg-[#F5FBF5]"
                  : "hover:bg-[#F5FBF5]"
              }`}
            >
              <Image src={dashboardIcon.src} alt="" width={16} height={16} />
              Dashboard
            </Link>
            <Link
              href={"/opportunities"}
              className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                pathname.includes("opportunities")
                  ? "bg-[#F5FBF5]"
                  : "hover:bg-[#F5FBF5]"
              }`}
            >
              <Image src={opportunityIcon.src} alt="" width={16} height={16} />
              Opportunities
            </Link>
            <Link
              href={"/blogs"}
              className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                pathname.includes("blogs")
                  ? "bg-[#F5FBF5]"
                  : "hover:bg-[#F5FBF5]"
              }`}
            >
              <Image src={blogIcon.src} alt="" width={16} height={16} />
              Blogs
            </Link>
            <Link
              href={"/calendar"}
              className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                pathname.includes("calendar")
                  ? "bg-[#F5FBF5]"
                  : "hover:bg-[#F5FBF5]"
              }`}
            >
              <Image src={calendarIcon.src} alt="" width={16} height={16} />
              Calendar
            </Link>
            <Link
              href={"/Notifications"}
              className={`w-full text-start px-3 py-2 rounded-md h-[36px] cursor-pointer flex justify-start items-center gap-2 ${
                pathname.includes("Notifications")
                  ? "bg-[#F5FBF5]"
                  : "hover:bg-[#F5FBF5]"
              }`}
            >
              <Image src={bell.src} alt="" width={16} height={16} />
              Notifications
            </Link>
            <Link
              href={"/update-profile"}
              className="w-full text-start px-3 py-2 rounded-md hover:bg-[#F5FBF5] h-[36px] cursor-pointer flex justify-start items-center gap-2"
            >
              <Image src={pencil.src} alt="" width={16} height={16} />
              Update Profile
            </Link>
            <Link
              href={"/settings/changePassword"}
              className="w-full text-start px-3 py-2 rounded-md hover:bg-[#F5FBF5] h-[36px] cursor-pointer flex justify-start items-center gap-2"
            >
              <Lock size={16} strokeWidth={2} />
              Change Password
            </Link>

            <div className="w-full text-start px-3 py-2 rounded-md hover:bg-[#F5FBF5] h-[36px] cursor-pointer flex justify-start items-center gap-2">
              <LogoutDialog />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

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
  const pathname = usePathname(); // ✅ current route
  console.log(
    "reduxUserData.user?.dataUpdated---------",
    reduxUserData.user?.dataUpdated
  );

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
