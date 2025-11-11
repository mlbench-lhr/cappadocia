"use client";
import Image from "next/image";
import { useState } from "react";

export default function Section4() {
  const [date, setDate] = useState();

  return (
    <div className="w-full h-fit pt-24">
      <div className="w-full flex flex-col items-center justify-center h-fit relative z-0">
        <div className="w-full flex flex-col items-center h-[653px] justify-end relative z-0">
          <Image
            src={"/landing page/image 6.png"}
            alt=""
            width={100}
            height={100}
            className="w-full h-[653px] object-cover object-center"
          />
          <div className="w-full flex flex-col md:flex-row items-center text-start justify-between absolute translate-y-[-50%] md:translate-y-[0%] top-1/2 md:top-auto bottom-auto md:bottom-10 left-0 gap-2 px-5 md:px-15">
            <div className="w-fit flex flex-col items-start text-start justify-start gap-15">
              <h1 className="font-bold text-3xl md:text-[52px] w-[90%] md:w-[560px] text-white leading-tight">
                Cappadocia Gallery
              </h1>
              <h2 className="font-[400] text-xl md:text-[29px] w-[90%] md:w-[485px] text-[rgba(255,255,255,0.70)] leading-tight">
                Experience stunning landscapes, vibrant skies, and unforgettable
                memories captured by our travelers and partners.
              </h2>
            </div>
            <div className="w-fit flex items-end text-start justify-start gap-2">
              <Image
                src={"/landing page/img 7.png"}
                alt=""
                width={223}
                height={179}
                className="w-[223px] h-[179px] object-cover object-center rounded-[15px] overflow-hidden"
              />
              <Image
                src={"/landing page/img 8.png"}
                alt=""
                width={233}
                height={200}
                className="w-[233px] h-[200px] object-cover object-center rounded-[15px] overflow-hidden"
              />
              <Image
                src={"/landing page/img 9.png"}
                alt=""
                width={233}
                height={237}
                className="w-[233px] h-[237px] object-cover object-center rounded-[15px] overflow-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
