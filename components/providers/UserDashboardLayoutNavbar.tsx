"use client";

import type React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import logo from "@/public/logo.png";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import type { RootState } from "@/lib/store/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toggleCollapse, toggleSidebar } from "@/lib/store/slices/sidebarSlice";
import Image from "next/image";
import { ChevronDown, Lock, Menu } from "lucide-react";
import LogoutDialog from "../LogoutDialog";
import Link from "next/link";
import { setCount, setHasNew } from "@/lib/store/slices/notificationSlice";
import DeleteAccountDialog from "../DeleteAccountDialog";
import { NotificationIcon } from "@/public/allIcons/page";

function ProfileMenu() {
  const userData = useAppSelector((state) => state.auth.user);

  return (
    <div className="relative">
      <div className="w-fit h-fit flex items-center justify-center ">
        <div className="flex justify-start items-center gap-2 ">
          <div className="w-[38px] h-[38px] rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
            {userData?.avatar ? (
              <Image
                src={userData?.avatar as string}
                alt="user avatar"
                width={38}
                height={38}
                className="object-cover w-[38px] h-[38px]"
              />
            ) : (
              <span className="text-lg font-medium">
                {userData?.fullName?.charAt(0)}
              </span>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <ChevronDown
                size={22}
                className="cursor-pointer"
                color="#B32053"
              />
            </PopoverTrigger>
            <PopoverContent className="w-[234px] overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 p-0 top-6 right-0 md:-right-8 absolute">
              <div className="py-1 p-[20px]">
                {/* <Link href={"/update-profile"} className="flex gap-1">
                <Image src={pencil.src} alt="" width={16} height={16} />
                <span className="block px-4 py-2 text-sm">Update Profile</span>
              </Link> */}
                <Link href={"/settings/changePassword"} className="flex gap-1">
                  <Lock size={16} strokeWidth={2} className="mt-2" />
                  <span className="block px-4 py-2 text-sm">
                    Change Password
                  </span>
                </Link>
                <LogoutDialog />
                <DeleteAccountDialog />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

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

export function Navbar() {
  const dispatch = useAppDispatch();
  const { isCollapsed } = useSelector((s: RootState) => s.sidebar);
  const hasNew = useAppSelector((s) => s.notification.hasNew);
  const userData = useAppSelector((state) => state.auth.user);
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
          dispatch(setCount(json?.length));
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
              className="p-2 md:hidden rounded-md hover:bg-secondary h-[36px]"
              aria-label="Toggle menu"
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div>
              <div className="text-[14px] font-medium">
                {userData?.fullName}
              </div>
              <div className="text-[12px] font-[400]">{userData?.email}</div>
            </div>
            <div className="relative">
              <ProfileMenu />
            </div>
            <Link
              href={"/Notifications"}
              className="relative cursor-pointer bg-secondary w-[38px] h-[38px] flex justify-center items-center rounded-full"
              onClick={() => dispatch(setHasNew(false))}
            >
              <NotificationIcon color="#B32053" />
              {hasNew && (
                <span
                  className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"
                  aria-label="New notifications"
                />
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
