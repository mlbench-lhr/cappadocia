"use client";
import Testimonials from "@/components/landingPage/Testimonials";
import Image from "next/image";

export default function Section8() {
  return (
    <div className="w-full h-fit pt-24">
      <div className="w-full flex flex-col items-center justify-center h-fit relative z-0">
        <div className="w-full flex flex-col items-center h-[500px] md:h-[753px] justify-end relative z-0">
          <Image
            src={"/landing page/image 6.png"}
            alt=""
            width={100}
            height={100}
            className="w-full h-[500px] md:h-[753px] object-cover object-start absolute top-0 left-0"
          />
          <div className="w-full h-[500px] md:h-[753px] flex flex-col justify-center items-center z-[1] gap-17">
            <div className="w-full flex justify-center items-center h-fit">
              <h1 className="font-semibold text-xl md:text-4xl text-white">
                What Our Travelers Say
              </h1>
            </div>
            <Testimonials />
          </div>
        </div>
      </div>
    </div>
  );
}
