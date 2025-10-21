"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "@/public/logo.svg";
import bell from "@/public/bell.svg";
import dashboardIcon from "@/public/layout-dashboard.svg";
import opportunityIcon from "@/public/sprout.svg";
import milestoneIcon from "@/public/trophy.svg";
import calendarIcon from "@/public/calendar-days.svg";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
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
import {
  ChevronDown,
  LayoutDashboard,
  Lock,
  Menu,
  Pencil,
  Settings,
  Sprout,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import LogoutDialog from "../LogoutDialog";
import Link from "next/link";

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
      <div className="flex items-center justify-center cursor-pointer">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-center cursor-pointer gap-2">
              <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-slate-200 flex items-center justify-center cursor-pointer">
                {userData?.avatar ? (
                  <Image
                    src={userData?.avatar as string}
                    alt="user avatar"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium">
                    {userData?.firstName?.charAt(0)}
                  </span>
                )}
              </div>
              <ChevronDown size={20} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[234px] overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 p-0 right-0 md:right-0 absolute">
            <div className="py-1 p-[20px]">
              <Link
                href={"/admin/settings/editProfile"}
                className="flex gap-1 items-center justify-start"
              >
                <Pencil size={16} strokeWidth={2} />
                <span className="block px-2 py-2 text-sm">Edit Profile</span>
              </Link>
              <Link
                href={"/admin/settings/changePassword"}
                className="flex gap-1 items-center justify-start"
              >
                <Lock size={16} strokeWidth={2} />
                <span className="block px-2 py-2 text-sm">Change Password</span>
              </Link>
              <LogoutDialog adminStyle />{" "}
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
  const userData = useAppSelector((s) => s.auth.user);
  return (
    <header className="w-full bg-white border-b h-[78px] flex justify-end items-center">
      <div className="w-full px-4 sm:px-6 lg:px-[32px]">
        <div className="h-fit flex items-center justify-between w-full">
          <div className="flex items-center gap-4 justify-between w-full md:w-fit">
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
          <div className="hidden md:flex items-center w-fit justify-start gap-2">
            <span className="text-base font-semibold w-fit">
              {userData?.fullName}
            </span>
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
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { setReduxUser } from "@/lib/store/slices/authSlice";
import { useMediaQuery } from "react-responsive";
import MilestoneTierDialog from "../MilestoneTierDialog";

const sidebarOptions = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "All Users", href: "/admin/users", icon: Users },
  { name: "Opportunities", href: "/admin/opportunities", icon: Sprout },
  { name: "Milestones", href: "/admin/milestones", icon: Trophy },
  { name: "Profile Survey", href: "/admin/surveyFields", icon: Users },
];

const mobileProfileOptions = [
  { name: "Edit Profile", href: "/admin/settings/editProfile", icon: Pencil },
  {
    name: "Change Password",
    href: "/admin/settings/changePassword",
    icon: Lock,
  },
];

export function Sidebar() {
  const dispatch = useAppDispatch();
  const { isOpen, isCollapsed } = useSelector((s: RootState) => s.sidebar);
  const userData = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const isMiddleScreen = useMediaQuery({ maxWidth: 1350 });
  const desktopWidth = isCollapsed ? "w-20" : "w-[260px]";

  useEffect(() => {
    if (isMiddleScreen) dispatch(toggleCollapse());
  }, [isMiddleScreen, dispatch]);

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMiddleScreen && (
        <aside
          className={`gap-[40px] hidden md:flex flex-col bg-white border-r ${desktopWidth} transition-width duration-200 shrink-0 p-[20px]`}
        >
          <div className="flex items-center justify-between font-semibold w-full ">
            <Link href="/admin/dashboard" className="">
              <Image src={logo.src} alt="logo" width={150} height={40} className="w-[90px] h-[40px] md:w-[150px] md:h-[40px]" />
            </Link>
            <button
              onClick={() => dispatch(toggleCollapse())}
              className={`hidden ${!isCollapsed && "md:inline-flex"}`}
            >
              <X className="h-[16px] w-[16px]" />
            </button>
          </div>

          <nav className="flex-1 space-y-[24px] overflow-auto plan-text-style-4">
            {sidebarOptions.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                className={`w-full text-start px-2 py-2 rounded-md h-[36px] flex items-center gap-2 cursor-pointer ${
                  pathname.includes(href)
                    ? "text-[#B32053]"
                    : "hover:text-[#B32053]"
                }`}
              >
                <Icon size={16} />
                {!isCollapsed && name}
              </Link>
            ))}
          </nav>
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
              <Link href="/admin/dashboard">
                <Image src={logo.src} alt="logo" width={59} height={32} />
              </Link>
              <button
                onClick={() => dispatch(toggleCollapse())}
                className={`hidden ${!isCollapsed && "md:inline-flex"} mt-1`}
              >
                <X className="h-[16px] w-[16px]" />
              </button>
            </div>

            <nav className="flex-1 space-y-[24px] overflow-auto plan-text-style-4">
              {sidebarOptions.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  className={`w-full text-start px-3 py-2 rounded-md h-[36px] flex items-center gap-2 cursor-pointer ${
                    pathname.includes(href)
                      ? "text-[#B32053]"
                      : "hover:text-[#B32053]"
                  }`}
                >
                  <Icon size={16} />
                  {!isCollapsed && name}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Mobile Sidebar */}
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

          <nav className="flex flex-col gap-[24px] px-2 py-4 overflow-auto plan-text-style-4">
            {sidebarOptions.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                className={`w-full text-start px-3 py-2 rounded-md h-[36px] flex items-center gap-2 cursor-pointer ${
                  pathname.includes(href)
                    ? "bg-[#F5FBF5]"
                    : "hover:bg-[#F5FBF5]"
                }`}
              >
                <Icon size={16} />
                {name}
              </Link>
            ))}
            {mobileProfileOptions.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                className={`w-full text-start px-3 py-2 rounded-md h-[36px] flex items-center gap-2 cursor-pointer ${
                  pathname.includes(href)
                    ? "bg-[#F5FBF5]"
                    : "hover:bg-[#F5FBF5]"
                }`}
              >
                <Icon size={16} />
                {name}
              </Link>
            ))}
            <div
              className={`w-full text-start px-3 py-2 rounded-md h-[36px] flex items-center gap-2 cursor-pointer hover:bg-[#F5FBF5]`}
            >
              <LogoutDialog adminStyle />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
// LAYOUT that uses Navbar + Sidebar
export function AdminLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const reduxUserData = useAppSelector((state) => state.auth);
  const { isOpen, isCollapsed } = useSelector((s: RootState) => s.sidebar);
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
  const pathname = usePathname(); // ✅ current route

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

        <main
          className={`flex-1 py-[20px] px-[20px] md:py-[32px] md:px-[38px] element`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
