import Link from "next/link";
import React, { ReactNode } from "react";

interface NavItemProps {
  activeIcon: ReactNode;
  inactiveIcon: ReactNode;
  text: string;
  href: string;
  isActive: boolean;
}

const NavItem = ({ activeIcon, inactiveIcon, text, href, isActive }: NavItemProps) => (
  <Link href={href}>
    <div
      className={`flex items-center gap-2 text-left w-full cursor-pointer transition-colors mb-4 ${
        isActive ? "text-[#B32053] font-semibold" : ""
      } hover:text-primary`}
    >
      {isActive ? activeIcon : inactiveIcon}
      <span className="h5">{text}</span>
    </div>
  </Link>
);

export default NavItem;
