"use client";
import Tabs, { TabsProps } from "@/components/landingPage/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const tourCardData: TabsProps[] = [
  {
    image: "/landing page/tab icon.png",
    title: "Verified Experiences",
    description:
      "All tours and activities are checked and rated by real travelers.",
  },
  {
    image: "/landing page/tab icon 2.png",
    title: "Secure Payments",
    description:
      "All tours and activities are checked and rated by real travelers.",
  },
  {
    image: "/landing page/tab icon 3.png",
    title: "Trusted Vendors",
    description: "We partner only with licensed and reviewed local operators.",
  },
  {
    image: "/landing page/tab icon 4.png",
    title: "24/7 Support",
    description:
      "Our local support team is always ready to help you on your journey.",
  },
];

export default function Section3() {
  return (
    <div className="w-full h-fit pt-12" id="WhyChoose">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] lg:px-[80px] 2xl:px-[90px] gap-14">
        <div className="w-full flex flex-col md:flex-row justify-between items-center h-fit gap-4 md:gap-0">
          <div className="w-full md:w-fit h-fit flex flex-row md:flex-col justify-between md:justify-start gap-8 items-center md:items-start">
            <h1 className="font-semibold text-xl md:text-4xl">
              Why Choose Us{" "}
            </h1>
            <Button disabled variant={"main_green_button"}>
              Read Our Reviews
            </Button>
          </div>
          <div className="w-full md:w-[415px] h-fit">
            <span className="font-normal text-lg md:text-[22px] text-[rgba(9,9,9,0.50)] leading-tight">
              Discover what makes us the most trusted platform for Cappadocia
              tours and balloon experiences.
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-4 xl:grid-cols-16 gap-6 xl:gap-4">
          <div className="w-full relative h-fit col-span-4 xl:col-span-10 [@media(min-width:1350px)]:col-span-9 flex flex-col md:flex-row justify-start items-center gap-3.5">
            <Image
              src={"/landing page/image (4).png"}
              alt="appadocia cave dwellings"
              className="w-full xl:w-[323px] h-[516px] object-cover object-center rounded-[10px]"
              width={323}
              height={516}
            />
            <Image
              src={"/landing page/image (5).png"}
              alt="Cappadocia cave dwellings"
              className="w-full xl:w-[319px] h-[414px] object-cover object-center rounded-[10px]"
              width={319}
              height={414}
            />
          </div>
          <div className="w-full relative h-fit col-span-4 xl:col-span-6 [@media(min-width:1350px)]:col-span-7 flex flex-col justify-start items-center gap-8 w-[calc(100%-80px)]:gap-10">
            {tourCardData.map((item) => (
              <Tabs key={item.image} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
