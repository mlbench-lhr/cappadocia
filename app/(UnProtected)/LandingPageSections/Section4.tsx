"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Section4() {
  const [date, setDate] = useState();
  const [background, setBackground] = useState<string>("/landing page/image 6.png");
  const [thumbs, setThumbs] = useState<string[]>([
    "/landing page/img 7.png",
    "/landing page/img 8.png",
    "/landing page/img 9.png",
  ]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/promotionalImages");
        const s = (await res.data)?.data || {};
        if (s.section4Background) setBackground(s.section4Background);
        if (s.section4Thumbs?.length) setThumbs(s.section4Thumbs);
      } catch (e) {}
    }
    fetchSettings();
  }, []);

  return (
    <div className="w-full h-fit pt-12">
      <div className="w-full flex flex-col items-center justify-center h-fit relative z-0">
        <div className="w-full flex flex-col items-center h-[653px] justify-end relative z-0">
          <Image
            src={background}
            alt=""
            width={100}
            height={100}
            className="w-full h-[653px] object-cover object-center"
          />
          <div className="w-full flex flex-col lg:flex-row items-end text-start justify-between absolute translate-y-[-50%] lg:translate-y-[0%] top-1/2 lg:top-auto bottom-auto lg:bottom-10 left-0 gap-2 px-5 lg:px-15">
            <div className="w-full lg:w-fit flex flex-col items-start text-start justify-start gap-6">
              <h1 className="font-bold text-3xl lg:text-[46px] w-[90%] lg:w-[500px] text-white leading-tight">
                Cappadocia Gallery
              </h1>
              <h2 className="font-[400] text-xl md:text-xl w-[90%] md:w-[485px] text-[rgba(255,255,255,0.70)] leading-tight">
                Experience stunning landscapes, vibrant skies, and unforgettable
                memories captured by our travelers and partners.
              </h2>
            </div>
            <div className="w-fit flex items-end text-start justify-start gap-2">
              <Image
                src={thumbs[0]}
                alt=""
                width={223}
                height={179}
                className="w-[223px] h-[150px] md:h-[179px] object-cover object-center rounded-[15px] overflow-hidden"
              />
              <Image
                src={thumbs[1]}
                alt=""
                width={233}
                height={200}
                className="w-[233px] h-[170px] md:h-[200px] object-cover object-center rounded-[15px] overflow-hidden"
              />
              <Image
                src={thumbs[2]}
                alt=""
                width={233}
                height={237}
                className="w-[233px] h-[200px] md:h-[237px] object-cover object-center rounded-[15px] overflow-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
