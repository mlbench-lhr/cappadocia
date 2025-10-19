import Image from "next/image";
import twitterIcon from "@/public/twitter.svg";
import facebookIcon from "@/public/facebook.svg";
import instagramIcon from "@/public/instagram.svg";
import linkedInIcon from "@/public/linkedin.svg";
import phoneIcon from "@/public/phoneIcon.svg";
import smsIcon from "@/public/smsIcon.svg";
import mapIcon from "@/public/map.svg";
import EmailForm from "./EmailForm";
import Link from "next/link";

export const EmailSection = () => {
  return (
    <section className="relative overflow-hidden mt-[80px] mb-[64px] lg:mb-[180px] h-fit">
      <div className="container mx-auto relative h-fit flex justify-between items-start flex-wrap gap-y-[64px]">
        <div className="relative h-full flex flex-col justify-start items-start gap-[70px]">
          <div className="relative h-fit flex justify-start items-start gap-[24px] lg:gap-[32px] flex-col">
            <div className="relative h-fit flex justify-start items-start gap-[20px]">
              <Image src={smsIcon} alt="" height={24} width={24} />
              <div className="relative h-fit flex flex-col justify-start items-start gap-[8px] lg:gap-[16px]">
                <h3 className="heading-text-style-4">Email</h3>
                <h3 className="plan-text-style-2">
                  dolores.chambers@example.com
                </h3>
              </div>
            </div>
            <div className="relative h-fit flex justify-start items-start gap-[20px]">
              <Image src={phoneIcon} alt="" height={24} width={24} />
              <div className="relative h-fit flex flex-col justify-start items-start gap-[8px] lg:gap-[16px]">
                <h3 className="heading-text-style-4">Phone</h3>
                <h3 className="plan-text-style-2">(316) 555-0116 </h3>
              </div>
            </div>
            <div className="relative h-fit flex justify-start items-start gap-[20px]">
              <Image src={mapIcon} alt="" height={24} width={24} />
              <div className="relative h-fit flex flex-col justify-start items-start gap-[8px] lg:gap-[16px]">
                <h3 className="heading-text-style-4">Location</h3>
                <h3 className="plan-text-style-2">
                  2464 Royal Ln. Mesa, New Jersey 45463
                </h3>
              </div>
            </div>
          </div>
          <div className="container relative h-fit flex justify-start items-center gap-[8px] lg:gap-[16px]">
            <Link className="rounded-icon" href={"https://twitter.com"}>
              <Image src={twitterIcon} alt="" height={24} width={24} />
            </Link>
            <Link className="rounded-icon" href={"https://www.facebook.com/"}>
              <Image src={facebookIcon} alt="" height={24} width={24} />
            </Link>
            <Link className="rounded-icon" href={"https://www.instagram.com/"}>
              <Image src={instagramIcon} alt="" height={24} width={24} />
            </Link>
            <Link className="rounded-icon" href={"https://www.linkedin.com/"}>
              <Image src={linkedInIcon} alt="" height={24} width={24} />
            </Link>
          </div>
        </div>
        <EmailForm />
      </div>
    </section>
  );
};
