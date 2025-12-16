"use client";
import Tabs, { TabsProps } from "@/components/landingPage/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Section3() {
  const [mainImages, setMainImages] = useState<string[]>([
    "/landing page/image (4).png",
    "/landing page/image (5).png",
  ]);
  const [tabIcons, setTabIcons] = useState<string[]>([
    "/landing page/tab icon.png",
    "/landing page/tab icon 2.png",
    "/landing page/tab icon 3.png",
    "/landing page/tab icon 4.png",
  ]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/promotionalImages");
        const s = (await res.data)?.data || {};
        if (s.section3MainImages?.length) setMainImages(s.section3MainImages);
        if (s.section3TabIcons?.length) setTabIcons(s.section3TabIcons);
      } catch (e) {}
    }
    fetchSettings();
  }, []);

  const tourCardData: TabsProps[] = [
    {
      image: tabIcons[0],
      title: "Verified Experiences",
      description:
        "All tours and activities are checked and rated by real travelers.",
    },
    {
      image: tabIcons[1],
      title: "Secure Payments",
      description:
        "All tours and activities are checked and rated by real travelers.",
    },
    {
      image: tabIcons[2],
      title: "Trusted Vendors",
      description:
        "We partner only with licensed and reviewed local operators.",
    },
    {
      image: tabIcons[3],
      title: "24/7 Support",
      description:
        "Our local support team is always ready to help you on your journey.",
    },
  ];

  return (
    <div className="w-full h-fit pt-12" id="WhyChoose">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] lg:px-[80px] 2xl:px-[90px] gap-12">
        <div className="w-full flex flex-col md:flex-row justify-between items-start h-fit gap-0 md:gap-0">
          <div className="w-full md:w-fit h-fit flex flex-col-reverse sm:flex-row md:flex-col justify-between md:justify-start gap-3 sm:gap-6 items-center md:items-start">
            <h1 className="font-semibold text-lg md:text-3xl">Why Choose Us</h1>
            <Button variant={"main_green_button"} asChild>
              <Link href={"/#ReadReviews"}>Read Our Reviews</Link>
            </Button>
          </div>
          <div className="w-full md:w-[415px] h-fit text-center md:text-start">
            <span className="font-normal text-sm md:text-[16px] text-[rgba(9,9,9,0.50)] text-center md:text-start leading-tight">
              Discover what makes us the most trusted platform for Cappadocia
              tours and balloon experiences.
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-4 xl:grid-cols-16 gap-6 xl:gap-4 h-fit relative">
          <div className="w-full relative h-[600px] md:h-[350px] xl:h-[516px] col-span-4 xl:col-span-10 [@media(min-width:1350px)]:col-span-9 flex flex-col md:flex-row justify-start items-center gap-3.5">
            <Image
              src={mainImages[0]}
              alt="appadocia cave dwellings"
              className="w-full xl:w-[323px] h-[300px] md:h-[350px] xl:h-[516px] object-cover object-center rounded-[10px]"
              width={323}
              height={516}
            />
            <Image
              src={mainImages[1]}
              alt="Cappadocia cave dwellings"
              className="w-full xl:w-[319px] h-[300px] md:h-[350px] xl:h-[414px] object-cover object-center rounded-[10px]"
              width={319}
              height={414}
            />
          </div>
          <div className="w-full xl:w-[40%] [@media(min-width:1370px)]:w-[45%] relative xl:absolute top-1/2 right-0 -translate-y-1/2 h-fit col-span-4 xl:col-span-6 [@media(min-width:1350px)]:col-span-7 flex flex-col justify-start items-center gap-4 xl:gap-8 w-[calc(100%-80px)]:gap-10">
            {tourCardData.map((item) => (
              <Tabs key={item.image} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
