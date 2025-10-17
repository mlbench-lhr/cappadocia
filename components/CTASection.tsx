import TestimonialCardAvatar1 from "@/public/Abstract Design.svg";
import TestimonialCardAvatar2 from "@/public/Abstract Design (1).svg";
import { Button } from "./ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section id="features" className="mt-[80px]">
      <div className="container mx-auto">
        <div className="mt-[80px] px-[24px] py-[80px] lg:px-[80px] lg:py-[80px] bg-[#F5FBF5] rounded-[12px] mb-[100px] relative">
          <img
            src={TestimonialCardAvatar1.src}
            className="absolute top-0 left-0"
          />
          <img
            src={TestimonialCardAvatar2.src}
            className="absolute bottom-0 right-0"
          />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full flex justify-between items-center text-center flex-wrap gap-y-[40px]">
              <div className="w-full md:w-[70%] flex justify-center items-start flex-col text-center gap-[16px]">
                <h3 className="w-full xl:w-[700px] font-[500] text-[20px] xl:text-[32px] text-start">
                  Are you prepared to take the next step toward unlocking your
                  full potential?
                </h3>
                <span
                  className="plan-text-style-2"
                  style={{ textAlign: "start" }}
                >
                  Join now and start your exciting journey towards growth and
                  success today.
                </span>
              </div>
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
      </div>
    </section>
  );
}
