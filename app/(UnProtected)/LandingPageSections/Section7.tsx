"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Section7() {
  return (
    <div className="w-full h-fit pt-24">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] lg:px-[80px] 2xl:px-[90px] pt-[20px] lg:pt-[35px] pb-[40px] lg:pb-[90px] gap-14">
        <div className="w-full flex justify-start items-center gap-y-10 gap-x-15 flex-wrap">
          <div className="relative flex justify-center items-center w-full lg:w-fit h-fit z-[0]">
            <Image
              src={"/landing page/img 11.png"}
              alt=""
              width={530}
              height={680}
              className="w-full lg:w-[400px] 2xl:w-[530px] h-[400px] lg:h-[580px] 2xl:h-[680px] object-cover object-center rounded-[12px] z-[1]"
            />
          </div>
          <div className="w-full lg:w-[calc(100%-460px)] 2xl:w-[calc(100%-590px)] flex flex-col justify-start items-start gap-4 md:gap-12">
            <h1 className="font-semibold text-2xl md:text-[37px]">About Us </h1>
            <p className="w-full 2xl:w-[550px] text-sm md:text-lg leading-tight">
              Welcome to Cappadocia Activities & Tours, your trusted online
              marketplace for discovering and booking unforgettable experiences
              across Cappadocia.
              <br /> Our platform connects travelers from around the world with
              verified local tour operators, offering a seamless way to explore
              the region’s breathtaking landscapes, cultural heritage, and
              adventure activities — all in one place.
              <br />
              <br /> We believe every traveler deserves a personalized and safe
              experience. That’s hy we’ve designed our system to ensure
              transparency, reliability, and convenience — whether you’re
              booking a hot air balloon ride, an ATV adventure, or a cultural
              day tour.
            </p>
            <Button variant={"main_green_button"}>Read more </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
