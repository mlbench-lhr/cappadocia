"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Section7() {
  const [image, setImage] = useState<string>("/landing page/img 11.png");
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/promotionalImages");
        const s = (await res.data)?.data || {};
        if (s.section7Image) setImage(s.section7Image);
      } catch (e) {}
    }
    fetchSettings();
  }, []);
  return (
    <div className="w-full h-fit pt-10" id="About">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] lg:px-[80px] 2xl:px-[90px] pt-[20px] lg:pt-[35px] pb-12 lg:pb-12 gap-14">
        <div className="w-full flex justify-start items-center gap-y-10 gap-x-15 flex-wrap">
          <div className="relative flex justify-center items-center w-full lg:w-fit h-fit z-[0]">
            <Image
              src={image}
              alt=""
              width={530}
              height={680}
              className="w-full lg:w-[400px] 2xl:w-[530px] h-[400px] lg:h-[580px] 2xl:h-[680px] object-cover object-center rounded-[12px] z-[1]"
            />
          </div>
          <div className="w-full lg:w-[calc(100%-460px)] 2xl:w-[calc(100%-590px)] flex flex-col justify-start items-start gap-4 md:gap-12">
            <h1 className="font-semibold text-2xl md:text-[37px]">About Us </h1>
            {/* <p className="w-full 2xl:w-[550px] text-sm md:text-base leading-tight">
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
            </p> */}
            <p className="w-full 2xl:w-[550px] text-sm md:text-base leading-tight">
              Welcome to Cappadocia Activities & Tours, your trusted online
              marketplace for discovering and booking unforgettable experiences
              across Cappadocia.
              <br />
              Our platform connects travelers from around the world with
              verified local tour operators, offering a seamless way to explore
              the region’s breathtaking landscapes, cultural heritage, and
              adventure activities — all in one place.
              <br />
              We believe every traveler deserves a personalized and safe
              experience. That’s hy we’ve designed our system to ensure
              transparency, reliability, and convenience — whether you’re
              booking a hot air balloon ride, an ATV adventure, or a cultural
              day tour.
              <br />
              Cappadocia Platform is a modern online marketplace for tours and
              activities in Cappadocia, created by young entrepreneurs to
              support local travel agencies and enhance sustainable tourism.
              <br />
              We connect travelers with trusted, certified service providers and
              offer secure booking, transparent pricing, and unforgettable
              travel experiences. Proudly aligned with the United Nations
              Sustainable Development Goals, we aim to strengthen our region’s
              tourism ecosystem and promote responsible, authentic, and
              high-quality travel. Discover. Book. Experience Cappadocia.
            </p>
            <Button variant={"main_green_button"} asChild>
              <Link href={"/about"}>Read more</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
