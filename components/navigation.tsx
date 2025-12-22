"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [pathname, setPathname] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user_id = useAppSelector((s) => s.auth.user?.id);
  const user_role = useAppSelector((s) => s.auth.user?.role);
  console.log("user_role", user_role);

  const navLinks = (
    <>
      <Link
        href="/"
        className={
          pathname === "home"
            ? "font-[600] text-sm lg:text-[16px]"
            : "text-[rgba(0,0,0,0.60)] text-sm lg:text-[16px] font-[500]"
        }
        onClick={() => {
          setIsMobileMenuOpen(false);
          setPathname("home");
        }}
      >
        Home
      </Link>
      <Link
        href="/blogs"
        className={
          pathname.includes("blogs")
            ? "font-[600] text-sm lg:text-[16px]"
            : "text-[rgba(0,0,0,0.60)] text-sm lg:text-[16px] font-[500]"
        }
        onClick={() => {
          setIsMobileMenuOpen(false);
          setPathname("blogs");
        }}
      >
        Blogs
      </Link>
      <Link
        href="/#About"
        className={
          pathname.includes("About")
            ? "font-[600] text-sm lg:text-[16px]"
            : "text-[rgba(0,0,0,0.60)] text-sm lg:text-[16px] font-[500]"
        }
        onClick={() => {
          setIsMobileMenuOpen(false);
          setPathname("About");
        }}
      >
        About Us
      </Link>
      <Link
        href="/explore"
        className={
          pathname.includes("/ToursAndActivities")
            ? "font-[600] text-sm lg:text-[16px]"
            : "text-[rgba(0,0,0,0.60)] text-sm lg:text-[16px] font-[500]"
        }
        onClick={() => {
          setIsMobileMenuOpen(false);
          setPathname("ToursAndActivities");
        }}
      >
        Tours & Activities
      </Link>
      <Link
        href="/#Contact"
        className={
          pathname.includes("Contact")
            ? "font-[600] text-sm lg:text-[16px]"
            : "text-[rgba(0,0,0,0.60)] text-sm lg:text-[16px] font-[500]"
        }
        onClick={() => {
          setIsMobileMenuOpen(false);
          setPathname("Contact");
        }}
      >
        Contact
      </Link>
    </>
  );

  return (
    <nav
      className="h-[70px] md:h-[80px] flex items-center px-[20px]  lg:px-[80px] 2xl:px-[90px] bg-white shadow-sm relative"
      style={{ zIndex: 110 }}
    >
      <div className="flex justify-between items-center w-full">
        {/* Logo */}

        <div className="flex items-center justify-start gap-0">
          <Link href="/" className="flex items-center">
            {/* <Image
              width={200}
              height={72}
              src={logo.src}
              alt="Logo"
              className="w-[130px] h-[50px] md:w-[200px] md:h-[72px]"
            /> */}
            <div className="w-[130px] h-[50px] md:w-[200px] md:h-[72px] bg-image"></div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="flex justify-end items-center gap-0 md:gap-6 lg:gap-[100px]">
          <div className="hidden md:flex gap-4.5 lg:gap-[48px] items-center">
            {navLinks}
          </div>

          {/* Desktop Button */}
          <div className="flex items-center space-x-4">
            <Button asChild variant={"main_green_button"}>
              <Link
                href={
                  !user_id
                    ? "/auth/login"
                    : user_role === "admin"
                    ? "/admin/dashboard"
                    : user_role === "vendor"
                    ? "/vendor/dashboard"
                    : "/explore"
                }
              >
                {user_id ? "Get Started" : "Login Now"}
              </Link>
            </Button>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="focus:outline-none cursor-pointer"
              >
                {<Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Hamburger (Mobile) */}
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.3)] z-[109] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu (Left Drawer) */}
      <div
        className={`fixed top-0 right-0 h-full pt-[60px] w-[90%] bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-[110] md:hidden
  ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="focus:outline-none cursor-pointer top-4 left-5 absolute"
        >
          {<X size={24} />}
        </button>
        <div className="flex flex-col items-start px-6 space-y-4 py-2">
          {navLinks}
        </div>
      </div>
    </nav>
  );
}
