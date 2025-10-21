import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function app() {
  return (
    <div className="bg-[#FFF9F9] w-full h-screen px-4 getStartedPage">
      <div className="w-full flex flex-col justify-start items-center">
        <Image
          src={"/logo.svg"}
          width={200}
          height={72}
          alt="Logo"
          className="logo w-auto"
        />
        <Image
          src={"/baloon.png"}
          width={200}
          height={72}
          alt="Logo"
          className="w-auto balloon"
        />
        <h1 className="font-[700] heading1 text-[#B32054] leading-normal text-center mt-4">
          Discover Cappadocia Like Never Before
        </h1>
        <h2 className="font-[700] heading2 text-[rgba(0,0,0,0.50)] leading-normal text-center mt-4">
          Stay Tuned!
        </h2>
        <p className="font-[400] text-sm md:text-[18px] text-[rgba(0,0,0,0.50)] leading-normal text-center mt-4">
          Get early access, exclusive offers, and travel inspiration directly to
          your inbox.
        </p>
        <h3 className="font-[700] heading3 text-[rgba(0,0,0,1)] leading-normal text-center mt-5">
          Be the First to Know When We Launch
        </h3>
        <div className="w-full flex gap-2.5 justify-center items-center mt-8 flex-col md:flex-row">
          <Input
            placeholder="Enter your email address"
            className="h-[45px] w-full md:w-[350px] bg-white text-center"
            style={{ borderColor: "white" }}
          />
          <Link href={"/blogs"} className="w-full md:w-fit">
            <Button className="w-full md:w-fit" variant={"main_green_button"}>
              Get Connected
            </Button>
          </Link>
        </div>
        <Link href={"/blogs"} className="w-full md:w-fit">
          <Button
            className="mt-6 w-full md:w-fit"
            variant={"main_green_button"}
          >
            Visit Blog Page
          </Button>
        </Link>
      </div>
    </div>
  );
}
