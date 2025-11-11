"use client";
import ContactUsForm from "@/components/landingPage/ContactUsForm";
import Image from "next/image";

export default function Section6() {
  return (
    <div className="w-full h-fit pt-24">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] xl:px-[115px] pt-[20px] lg:pt-[35px] pb-[40px] lg:pb-[90px] bg-[#FFEAF4] gap-14">
        <div className="w-full flex justify-center items-center h-fit">
          <h1 className="font-semibold text-xl md:text-4xl">
            Get in Touch With Us{" "}
          </h1>
        </div>
        <div className="w-full flex justify-between items-center flex-wrap-reverse gap-y-16">
          <ContactUsForm />
          <div className="relative flex justify-center items-center w-fit h-fit z-[0]">
            <div className="w-[360px] md:w-[410px] h-[400px] md:h-[500px] object-cover object-center rounded-[12px] bg-primary absolute top-0 left-0 rotate-[170deg] z-[0]"></div>
            <Image
              src={"/landing page/img 10.png"}
              alt=""
              width={100}
              height={100}
              className="w-[360px] md:w-[410px] h-[400px] md:h-[500px] object-cover object-center rounded-[12px] z-[1]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
