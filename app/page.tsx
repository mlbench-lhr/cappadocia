import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function app() {
  return (
    <div className="bg-[#FFF9F9] w-full h-screen py-8">
      <div className="w-full flex flex-col justify-start items-center">
        <Image
          src={"/logo.svg"}
          width={200}
          height={72}
          alt="Logo"
          className="w-auto h-[110px]"
        />
        <Image
          src={"/baloon.png"}
          width={200}
          height={72}
          alt="Logo"
          className="w-auto h-[50px h-auto"
        />
        <h1 className="font-[700] text-2xl md:text-[43px] text-[#B32054] leading-normal text-center mt-4">
          Discover Cappadocia Like Never Before
        </h1>
        <h2 className="font-[700] text-xl md:text-[33px] text-[rgba(0,0,0,0.50)] leading-normal text-center mt-4">
          Stay Tuned!
        </h2>
        <p className="font-[400] text-sm md:text-[18px] text-[rgba(0,0,0,0.50)] leading-normal text-center mt-4">
          Get early access, exclusive offers, and travel inspiration directly to
          your inbox.
        </p>
        <h3 className="font-[700] text-xl md:text-[26px] text-[rgba(0,0,0,1)] leading-normal text-center mt-5">
          Be the First to Know When We Launch
        </h3>
        <div className="flex gap-2.5 justify-start items-center mt-8">
          <Input
            placeholder="Enter your email address"
            className="h-[45px] w-[350px] bg-white text-center"
            style={{ borderColor: "white" }}
          />
          <Link href={"/blogs"}>
            <Button className="" variant={"main_green_button"}>
              Get Connected
            </Button>
          </Link>
        </div>
        <Link href={"/blogs"}>
          <Button className="mt-6" variant={"main_green_button"}>
            Visit Blog Page
          </Button>
        </Link>
      </div>
    </div>
  );
}
