"use client";
import BecomeVendorCard from "@/components/landingPage/becomeVerdorCard";
import { Button } from "@/components/ui/button";

export default function Section5() {
  return (
    <div className="w-full h-fit pt-24">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] xl:px-[100px] gap-14">
        <div className="w-full flex flex-col md:flex-row justify-between items-center h-fit gap-4 md:gap-0">
          <div className="w-full md:w-fit h-fit flex flex-row md:flex-col justify-between md:justify-start gap-8 items-center md:items-start">
            <h1 className="font-semibold text-xl md:text-4xl">
              Grow Your Tour Business with Us{" "}
            </h1>
            <Button variant={"main_green_button"}>Become a Vendor </Button>
          </div>
          <div className="w-full md:w-[415px] h-fit">
            <span className="font-normal text-lg md:text-[22px] text-[rgba(9,9,9,0.50)] leading-tight">
              List your experiences, reach thousands of travelers daily, and
              manage your bookings with ease.{" "}
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
          <div className="w-full h-fit col-span-4">
            <BecomeVendorCard />
          </div>
          <div className="w-full h-fit col-span-4">
            <BecomeVendorCard />
          </div>
          <div className="w-full h-fit col-span-4">
            <BecomeVendorCard />
          </div>
        </div>
      </div>
    </div>
  );
}
