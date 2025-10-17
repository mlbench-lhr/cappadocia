import WhiteLogo from "@/public/WhiteLogo.svg";
import twitterIcon from "@/public/footerIcons/twitter.svg";
import facebookIcon from "@/public/footerIcons/facebook.svg";
import linkedinIcon from "@/public/footerIcons/linkedin.svg";
import instagramIcon from "@/public/footerIcons/instagram.svg";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#006C4F] px-[20px] xl:px-[100px] py-[40px] xl:py-[56px]">
      <div className="flex justify-between items-center container mx-auto flex-wrap gap-y-[48px]">
        <div className="flex justify-between items-start flex-col gap-[16px]">
          <Image src={WhiteLogo} alt="Twitter" width={103} height={56} />
          <span className="footer-text">
            Lorem ipsum dolor sit amet, consectetur
            <br /> adipiscing elit.
          </span>
        </div>
        <div className="flex justify-between items-start lg:items-end flex-col-reverse xl:flex-col gap-[48px] lg:gap-[24px]">
          <div className="flex justify-between items-center gap-[16px] lg:gap-[16px]">
            <Link href="https://twitter.com">
              <Image src={twitterIcon} alt="Twitter" width={20} height={20} />
            </Link>
            <Link href="https://www.facebook.com/">
              <Image src={facebookIcon} alt="Facebook" width={20} height={20} />
            </Link>
            <Link href="https://www.instagram.com/">
              <Image
                src={instagramIcon}
                alt="Instagram"
                width={20}
                height={20}
              />
            </Link>
            <Link href="https://www.linkedin.com/">
              <Image src={linkedinIcon} alt="LinkedIn" width={20} height={20} />
            </Link>
          </div>
          <div className="flex justify-between items-start lg:items-center gap-y-[24px] gap-x-[40px] flex-col lg:flex-row">
            <Link href="/About" className="footer-text">
              About
            </Link>
            <Link href="/Contact" className="footer-text">
              Contact Us
            </Link>
            <Link href="/Privacy-Policy" className="footer-text">
              Privacy policy
            </Link>
            <Link href="/Terms-of-use" className="footer-text">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
