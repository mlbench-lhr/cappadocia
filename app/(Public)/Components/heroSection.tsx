import logoGradient from "@/public/logoIcon.svg";
import dotPattern from "@/public/dot pattern.png";
import Image from "next/image";

export function HeroSection({
  heading,
  text,
}: {
  heading: string;
  text: string;
}) {
  return (
    <section className="relative overflow-hidden mt-[32px] lg:mt-[80px] h-fit">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-[40px] lg:py-[100px] relative h-fit flex justify-start items-center bg-[#F5FBF5] rounded-[12px]">
        <div className="w-full h-fit flex justify-center items-center absolute top-0 ">
          <Image
            width={749}
            height={380}
            src={dotPattern.src}
            alt=""
            className="mx-auto"
          />
        </div>
        <div className="w-full h-fit flex justify-center items-center flex-col gap-[32px] lg:gap-[80px]">
          <div className="mx-auto logo-gradient" style={{ zIndex: 100 }}>
            <img src={logoGradient.src} alt="" className="mx-auto" />
          </div>
          <div className="w-full flex justify-center items-center flex-col text-center gap-[20px]">
            <h2 className="heading-text-style-1">{heading}</h2>
            <p
              className="plan-text-style-2 w-full lg:w-[1000px]"
              style={{ textAlign: "center" }}
            >
              {text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
