"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.svg";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Ensure you have Lucide icons installed

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = (
    <>
      <Link
        href="/"
        className={pathname === "/" ? "text-[#006c4f] font-[500]" : ""}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        href="/About"
        className={pathname === "/About" ? "text-[#006c4f] font-[500]" : ""}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        About
      </Link>
      <Link
        href="/Contact"
        className={pathname === "/Contact" ? "text-[#006c4f] font-[500]" : ""}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Contact Us
      </Link>
    </>
  );

  return (
    <nav
      className="h-[110px] flex items-center px-[20px] xl:px-[100px] bg-white shadow-sm relative"
      style={{ zIndex: 110 }}
    >
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img src={logo.src} alt="Logo" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-[48px] items-center">{navLinks}</div>

        {/* Desktop Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Button asChild variant={"main_green_button"}>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>

        {/* Hamburger (Mobile) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="focus:outline-none cursor-pointer"
          >
            {<Menu size={28} />}
          </button>
        </div>
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
          <Button
            asChild
            variant={"main_green_button"}
            className="w-[120px] rounded-[8px]"
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
