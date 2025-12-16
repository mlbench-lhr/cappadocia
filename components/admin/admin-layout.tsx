"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "@/public/logo.png";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  closeSidebar,
  toggleCollapse,
  toggleSidebar,
} from "@/lib/store/slices/sidebarSlice";
import Image from "next/image";
import {
  ChevronDown,
  LayoutDashboard,
  Lock,
  Menu,
  Pencil,
  PencilLine,
  Trophy,
  UserCheck,
  X,
} from "lucide-react";
import LogoutDialog from "../LogoutDialog";
import Link from "next/link";
import { setHasNew } from "@/lib/store/slices/notificationSlice";
import { NotificationIcon } from "@/public/allIcons/page";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { pusherClient } from "@/lib/pusher/client";
import axios from "axios";
import moment from "moment";

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
          <PopoverTrigger asChild className="cursor-pointer">
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
  const hasNew = useAppSelector((s) => s.notification.hasNew);
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<
    Array<{
      _id: string;
      type: string;
      name: string;
      image?: string;
      message?: string;
      link?: string;
      createdAt: string;
      endDate?: string;
      isUnread?: boolean;
    }>
  >([]);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/notifications");
        const items = res.data || [];
        setNotifications(items);
        if (items.some((i: any) => i.isUnread)) dispatch(setHasNew(true));
      } catch {}
    }
    load();
  }, []);

  React.useEffect(() => {
    const uid = userData?.id;
    if (!uid) return;
    const channel = pusherClient.subscribe(`notification-user-${uid}`);
    const handler = (data: any) => {
      setNotifications((prev) => [data, ...prev]);
      dispatch(setHasNew(true));
    };
    channel.bind("notification-new", handler);
    return () => {
      channel.unbind("notification-new", handler);
      pusherClient.unsubscribe(`notification-user-${uid}`);
    };
  }, [userData?.id]);

  React.useEffect(() => {
    if (!open) return;
    dispatch(setHasNew(false));
    axios.put("/api/notifications/markRead").catch(() => {});
  }, [open]);
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
              className="flex md:hidden w-[140px] h-auto"
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
          <div className="flex items-center w-fit justify-start gap-2">
            <span className="hidden md:text-base font-semibold w-fit">
              {userData?.fullName}
            </span>
            <div className="relative hidden md:block cursor-pointer">
              <ProfileMenu />
            </div>
            <Drawer direction="right" open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <button
                  className="relative cursor-pointer bg-secondary w-[38px] h-[38px] flex justify-center items-center rounded-full"
                  aria-label="Notifications"
                >
                  <NotificationIcon
                    color="#B32053"
                    className="size-4 md:size-5.5"
                  />
                  {hasNew && (
                    <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-secondary">
                <DrawerHeader>
                  <DrawerTitle>Notifications</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 space-y-3 max-h-[75vh] overflow-auto">
                  {notifications.length === 0 ? (
                    <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                      No notification found
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className="flex items-center justify-between gap-3 border-b pb-3 last:border-b-0"
                      >
                        <div className="flex items-center gap-3 w-[calc(100%-52px)]">
                          {n.image ? (
                            <Image
                              src={n.image}
                              alt=""
                              width={35}
                              height={35}
                              className="rounded-full w-[25px] md:w-[35px] h-[25px] md:h-[35px] object-cover"
                            />
                          ) : (
                            <div className="rounded-full w-[25px] md:w-[35px] h-[25px] md:h-[35px] bg-[#B32053] flex justify-center items-center">
                              <NotificationIcon
                                color="white"
                                size="18"
                                className="size-4 md:size-5.5"
                              />
                            </div>
                          )}
                          <div className="flex flex-col gap-0 md:gap-1 w-[calc(100%-47px)]">
                            {n.type === "chat" ? (
                              <span className="text-xs md:text-sm">
                                New message{n.message ? `: ${n.message}` : ""}
                              </span>
                            ) : (
                              <span className="text-xs md:text-sm">
                                {n.name}
                              </span>
                            )}
                            <span className="text-[10px] md:text-xs text-black/60">
                              {moment(n.createdAt).format("MMM DD, YYYY")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-[40px] justify-end">
                          {n.link ? (
                            <a href={n.link} className="text-primary text-xs">
                              Open
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}

// SIDEBAR
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { setReduxUser } from "@/lib/store/slices/authSlice";
import { useMediaQuery } from "react-responsive";
import { Sidebar } from "../providers/AdminDashboardLayoutSidebar";

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
