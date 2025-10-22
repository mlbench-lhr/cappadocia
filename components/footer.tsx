import WhiteLogo from "@/public/WhiteLogo.svg";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="px-0 md:px-[20px] xl:px-[100px] w-full bg-[#B32053] py-[40px] xl:py-[56px] text-[rgba(255,255,255,0.80)]">
      <div className="w-full flex justify-between items-center mx-auto flex-wrap gap-y-[48px]">
        <div className="px-[20px] md:px-[0px] flex justify-between items-start flex-col gap-[12px]">
          <Image
            src={WhiteLogo}
            alt="Twitter"
            width={103}
            height={56}
            className="w-[130px] h-[50px] md:w-[200px] md:h-[72px]"
          />
          <span className="font-[400] text-white text-base">
            Discover amazing tours and activities with ease.
            <br className="hidden md:block" /> Connect with trusted local
            vendors and create unforgettable experiences.
          </span>
        </div>
        {/* <div className="px-[20px] md:px-[0px] flex justify-start items-center gap-[48px] lg:gap-[24px] pe-0 md:pe-20">
          <div className="flex justify-between items-start gap-y-[10px] gap-x-[40px] flex-col text-base">
            <span className="font-[600] text-white">Quick Links</span>
            <Link href="/About">About</Link>
            <Link href="/WhyChoose">Why choose</Link>
            <Link href="/Contact">Contact</Link>
            <Link href="/Become-a-vendor">Become a vendor</Link>
          </div>
        </div> */}
        <div className="w-full px-[20px] md:px-[0px] py- border-t-2 border-[rgba(255,255,255,0.50)] font-[400] text-[12px] flex justify-center md:justify-start gap-2 md:gap-4 items-center">
          {/* <span>Terms & Conditions</span>
          <span>|</span>
          <span>Privacy Policy</span>
          <span>|</span>
          <span>KVKK Privacy</span> */}
        </div>
        <span className="w-full px-[20px] md:px-[0px] text-base font-[400] text-white mx-auto text-center">
          © 2025 Cappadocia Platform. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
