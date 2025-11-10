"use client";
import TourCard from "@/components/Cards/landingPageTourCard";
import { Button } from "@/components/ui/button";

export default function Section2() {
  return (
    <div className="w-full h-fit">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] xl:px-[100px] gap-14">
        <div className="w-full flex justify-between items-center h-fit">
          <div className="w-fit h-fit flex flex-col justify-start gap-8 items-start">
            <h1 className="font-semibold text-4xl">
              Book Your Adventure <br /> Now
            </h1>
            <Button variant={"main_green_button"}>Explore Tours</Button>
          </div>
          <div className="w-[415px] h-fit">
            <span className="font-normal text-[22px] text-[rgba(9,9,9,0.50)] leading-tight">
              Choose your date, select your favorite tour, and get ready to
              explore the skies and valleys of Cappadocia. Booking is fast,
              easy, and secure.
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-4 md:grid-cols-8 lg:grid-cols-16 gap-4">
          <TourCard />
          <TourCard />
          <TourCard />
          <TourCard />
        </div>
      </div>
    </div>
  );
}
