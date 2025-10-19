import Link from "next/link";
import { Button } from "@/components/ui/button";
import lpCircleAvatar1 from "@/public/lpCircleAvatar.png";
import lpCircleAvatar2 from "@/public/lpCircleAvatar (2).png";
import lpCircleAvatar3 from "@/public/lpCircleAvatar (3).png";
import lpCircleAvatar4 from "@/public/lpCircleAvatar (4).png";
import lpCircleAvatar5 from "@/public/lpCircleAvatar (5).png";
import lpCircleAvatar6 from "@/public/lpCircleAvatar (6).png";
import lpCircleAvatar7 from "@/public/lpCircleAvatar (7).png";
import star from "@/public/Star 6.svg";
import ratingStar from "@/public/rating star.svg";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden mt-[32px] lg:mt-[100px] h-[290px] md:h-[350px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative h-full flex justify-start items-center">
        <Image
          width={88}
          height={88}
          src={lpCircleAvatar1.src}
          alt=""
          className="absolute top-[12px] left-0 w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-auto md:h-auto"
        />
        <Image
          width={88}
          height={88}
          src={lpCircleAvatar2.src}
          alt=""
          className="absolute top-0 right-[0px] md:right-[40px] w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-auto md:h-auto"
        />
        <Image
          width={88}
          height={88}
          src={lpCircleAvatar4.src}
          alt=""
          className="absolute bottom-[20px] left-[29px] md:left-[110px] w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-auto md:h-auto"
        />
        <Image
          width={88}
          height={88}
          src={lpCircleAvatar3.src}
          alt=""
          className="absolute bottom-0 right-[31px] md:right-[110px] w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-auto md:h-auto"
        />
        <Image
          width={44}
          height={44}
          src={star.src}
          alt=""
          className="absolute top-[88px] md:top-[130px] left-[8px] md:left-[22px] w-[20px] h-[20px] md:w-auto md:h-auto"
        />
        <Image
          width={31}
          height={31}
          src={star.src}
          alt=""
          className="absolute top-[199px] md:top-[212px] right-[6px] md:right-[50px] w-[14px] h-[14px] md:w-auto md:h-auto"
        />

        <div className="mx-auto max-w-4xl text-center flex flex-col justify-center items-center gap-[20px] lg:gap-[10px]">
          <h1 className="hero-text-css w-[310px] lg:w-[750px] mt:[50px] lg:mt-:auto">
            Discover, and Branch Pathways to Success
          </h1>
          <div className="flex justify-center items-center gap-[24px]">
            <div className="flex justify-center items-center gap-[0px]">
              <Image
                width={56}
                height={56}
                src={lpCircleAvatar5.src}
                alt=""
                className="border-[1px] border-[#EEEEF0] rounded-full translate-x-[9px] w-[40px] md:w-auto"
              />
              <Image
                width={56}
                height={56}
                src={lpCircleAvatar6.src}
                alt=""
                className="border-[1px] border-[#EEEEF0] rounded-full translate-x-[6px] w-[40px] md:w-auto"
              />
              <Image
                width={56}
                height={56}
                src={lpCircleAvatar7.src}
                alt=""
                className="border-[1px] border-[#EEEEF0] rounded-full translate-x-[3px] w-[40px] md:w-auto"
              />
            </div>
            <div className="flex justify-center items-start gap-[5px] flex-col">
              <div className="flex justify-center items-center gap-[4px]">
                <Image
                  width={16}
                  height={16}
                  src={ratingStar.src}
                  alt=""
                  className=""
                />
                <Image
                  width={16}
                  height={16}
                  src={ratingStar.src}
                  alt=""
                  className=""
                />
                <Image
                  width={16}
                  height={16}
                  src={ratingStar.src}
                  alt=""
                  className=""
                />
                <Image
                  width={16}
                  height={16}
                  src={ratingStar.src}
                  alt=""
                  className=""
                />
                <Image
                  width={16}
                  height={16}
                  src={ratingStar.src}
                  alt=""
                  className=""
                />
              </div>
              <span className="plan-text-style-1">3.4K Reviews</span>
            </div>
          </div>
          <div className="mt-[20px] lg:mt-10 flex items-center justify-center gap-x-6">
            <Button
              variant={"main_green_button"}
              asChild
              size="lg"
              className="primary-button"
            >
              <Link href="/dashboard">Get Started </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
