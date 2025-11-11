"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Section4() {
  const [date, setDate] = useState();

  return (
    <div className="w-full h-fit pt-24">
      <div className="w-full flex flex-col items-center justify-center h-fit relative z-0">
        <div className="w-full flex flex-col items-center h-[500px] md:h-[653px] justify-center relative z-0">
          <Image
            src={"/landing page/image 6.png"}
            alt=""
            width={100}
            height={100}
            className="w-full h-[500px] md:h-[653px] object-cover object-center"
          />
          <div className="w-full flex flex-col items-center text-center absolute top-1/2 translate-y-[-55%] left-0 justify-center gap-2">
            <h1 className="font-bold text-3xl md:text-[47px] w-[90%] md:w-[485px] text-white leading-tight">
              Discover the Best Tours & Activities in Cappadocia
            </h1>
            <h2 className="font-normal text-xl md:text-[24px] w-[90%] md:w-[485px] text-[rgba(255,255,255,0.74)] leading-tight">
              Book local experiences, guided tours, and adventures — all in one
              place.
            </h2>
            <Button asChild variant={"main_green_button"} className="mt-2">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
