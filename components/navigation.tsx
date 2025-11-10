"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.png";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = (
    <>
      <Link
        href="/blogs"
        className={
          pathname === "/blogs"
            ? "text-[rgba(0,0,0,0.60)] font-[600] text-[16px]"
            : "text-[16px] font-[500]"
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        href="/About"
        className={
          pathname === "/About"
            ? "text-[rgba(0,0,0,0.60)] font-[600] text-[16px]"
            : "text-[16px] font-[500]"
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        About Us
      </Link>
      <Link
        href="/ToursAndActivities"
        className={
          pathname === "/ToursAndActivities"
            ? "text-[rgba(0,0,0,0.60)] font-[600] text-[16px]"
            : "text-[16px] font-[500]"
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Tours & Activities
      </Link>
      <Link
        href="/Contact"
        className={
          pathname === "/Contact"
            ? "text-[rgba(0,0,0,0.60)] font-[600] text-[16px]"
            : "text-[16px] font-[500]"
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Contact
      </Link>
    </>
  );

  return (
    <nav
      className="h-[70px] md:h-[110px] flex items-center px-[20px] xl:px-[100px] bg-white shadow-sm relative"
      style={{ zIndex: 110 }}
    >
      <div className="flex justify-between items-center w-full">
        {/* Logo */}

        <div className="flex items-center justify-start gap-0">
          <div className="md:hidden flex items-center">
            {/* <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none cursor-pointer"
            >
              {<Menu size={28} />}
            </button> */}
          </div>
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
          <div className="hidden md:flex gap-6 lg:gap-[48px] items-center">
            {navLinks}
          </div>

          {/* Desktop Button */}
          <div className="flex items-center space-x-4">
            <Button asChild variant={"main_green_button"}>
              <Link href="/dashboard">Get Started</Link>
            </Button>
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
        className={`fixed top-0 left-0 h-full pt-[60px] w-[90%] bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-[110] md:hidden
  ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col items-start px-6 space-y-6 py-6">
          {navLinks}
        </div>
      </div>
    </nav>
  );
}
