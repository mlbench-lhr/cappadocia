"use client";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TravelerIcon, VendorIcon2 } from "@/public/allIcons/page";

export const SwitchRoles = () => {
  const pathName = usePathname();
  return (
    <div className="role-switch-position pb-3 right-3 lg:right-0 w-full flex justify-end items-center gap-2 pt-0 lg:pt-6 pr-0 lg:pr-6">
      <div className=" flex justify-start items-center gap-2">
        <Button
          className={`border border-primary h-[44px] ${
            pathName.includes("vendor")
              ? " hover:bg-[#FFEAF4] bg-[#FFEAF4]"
              : " hover:bg-white bg-white "
          } text-black font-semibold !rounded-2xl `}
          asChild
        >
          <a href={"/vendor/auth/login"}>
            <VendorIcon2 />
            Vendor
          </a>
        </Button>
        <Button
          className={`border border-primary h-[44px] ${
            !pathName.includes("vendor")
              ? " hover:bg-[#FFEAF4] bg-[#FFEAF4]"
              : " hover:bg-white bg-white "
          } text-black font-semibold !rounded-2xl `}
          asChild
        >
          <a href={"/auth/login"}>
            <TravelerIcon />
            Traveler
          </a>
        </Button>
      </div>
    </div>
  );
};
