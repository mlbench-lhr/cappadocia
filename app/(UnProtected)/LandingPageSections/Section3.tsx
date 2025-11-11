"use client";
import TourCard from "@/components/landingPage/landingPageTourCard";
import Tabs from "@/components/landingPage/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Section3() {
  return (
    <div className="w-full h-fit pt-24">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] xl:px-[100px] gap-14">
        <div className="w-full flex justify-between items-center h-fit">
          <div className="w-fit h-fit flex flex-col justify-start gap-8 items-start">
            <h1 className="font-semibold text-4xl">Why Choose Us </h1>
            <Button variant={"main_green_button"}>Read Our Reviews</Button>
          </div>
          <div className="w-[415px] h-fit">
            <span className="font-normal text-[22px] text-[rgba(9,9,9,0.50)] leading-tight">
              Discover what makes us the most trusted platform for Cappadocia
              tours and balloon experiences.
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-4 md:grid-cols-8 lg:grid-cols-16 gap-4">
          <div className="w-full relative h-fit col-span-9 flex justify-start items-center gap-3.5">
            <Image
              src={"/landing page/image (4).png"}
              alt="Cappadocia cave dwellings"
              className="w-[323px] h-[516px] object-cover object-center rounded-[10px]"
              width={323}
              height={516}
            />
            <Image
              src={"/landing page/image (5).png"}
              alt="Cappadocia cave dwellings"
              className="w-[319px] h-[414px] object-cover object-center rounded-[10px]"
              width={319}
              height={414}
            />
          </div>
          <div className="w-full relative h-fit col-span-7 flex flex-col justify-start items-center gap-10">
            <Tabs />
            <Tabs />
            <Tabs />
            <Tabs />
          </div>
        </div>
      </div>
    </div>
  );
}
