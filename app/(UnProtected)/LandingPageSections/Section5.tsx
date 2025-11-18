"use client";
import BecomeVendorCard, {
  BecomeVendorCardType,
} from "@/components/landingPage/becomeVerdorCard";
import { Button } from "@/components/ui/button";
import {
  EasyListingIcon,
  PaymentIcon3,
  StarIcon,
} from "@/public/allIcons/page";

const data: BecomeVendorCardType[] = [
  {
    icon: <EasyListingIcon size="26" />,
    heading: "Easy Listing",
    text: "Create and manage your tours and activities effortlessly using our platform, so you can focus on delivering amazing experiences rather than worrying about complicated setups.",
  },
  {
    icon: <PaymentIcon3 />,
    heading: "Flexible Pricing",
    text: "Set your own prices, run seasonal promotions, and offer special discounts—all while keeping full control over how you monetize your tours and activities.",
  },
  {
    icon: <StarIcon size="26" color={"#B32053"} />,
    heading: "Reach More Customers",
    text: "Expand your reach by connecting with thousands of active travelers looking for unique experiences, boosting bookings, visibility, and your business growth.",
  },
];
export default function Section5() {
  return (
    <div className="w-full h-fit pt-24">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px]  lg:px-[80px] 2xl:px-[90px] gap-14">
        <div className="w-full flex flex-col md:flex-row justify-between items-center h-fit gap-4 md:gap-0">
          <div className="w-full md:w-fit h-fit flex flex-row md:flex-col justify-between md:justify-start gap-8 items-center md:items-start">
            <h1 className="font-semibold text-xl md:text-4xl">
              Grow Your Tour Business <br className="hidden md:block" /> with Us
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
        <div className="w-full grid h-fit grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
          {data.map((item) => (
            <div className="w-full h-full col-span-4" key={item.heading}>
              <BecomeVendorCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
