"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

export default function app() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  async function getConnected(e: any) {
    e.preventDefault();
    try {
      setLoading(true);
      let response = await axios.post("/api/getConnected", {
        email: email,
      });

      if (response?.data?.message) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response?.data?.message || "Subscription Successful",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setEmail("");
    } catch (error: any) {
      if (error?.response?.data?.message) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Failed to add blog",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-[#FFF9F9] w-full h-screen">
      <div className="w-full h-screen getStartedPage relative py-[20px] px-4 md:py-[32px] md:px-[38px] element mx-auto">
        <div className="w-full flex flex-col justify-start items-center">
          <div className="w-full flex justify-between items-center">
            {/* <Image
              src={"/logo.svg"}
              width={200}
              height={72}
              alt="Logo"
              className="logo w-auto"
            /> */}
            <div className="w-[130px] h-[50px] md:w-[200px] md:h-[72px] bg-image"></div>
            <Link href={"/blogs"} className="w-fit block">
              <Button
                size={"withLogo"}
                className="w-full md:w-fit"
                variant={"main_green_button"}
              >
                Visit Blog Page
              </Button>
            </Link>
          </div>
          <Image
            src={"/baloon.png"}
            width={200}
            height={72}
            alt="Logo"
            className="w-auto balloon mt-4"
          />
          <h1 className="font-[700] heading1 text-[#B32054] leading-normal text-center mt-2 md:mt-4">
            Discover Cappadocia Like Never Before
          </h1>
          <h2 className="font-[700] heading2 text-[rgba(0,0,0,0.50)] leading-normal text-center mt-2 md:mt-4">
            Stay Tuned!
          </h2>
          <p className="font-[400] text-sm md:text-[18px] text-[rgba(0,0,0,0.50)] leading-normal text-center mt-2 md:mt-4">
            Get early access, exclusive offers, and travel inspiration directly
            to your inbox.
          </p>
          <h3 className="font-[700] heading3 text-[#B32054] leading-normal text-center mt-2.5 md:mt-5">
            Be the First to Know When We Launch
          </h3>
          <form
            onSubmit={(e) => {
              getConnected(e);
            }}
            className="w-full flex gap-2.5 justify-center items-center mt-4 md:mt-8 flex-col md:flex-row"
          >
            <Input
              placeholder="Enter your email address"
              className="h-[45px] w-full md:w-[350px] bg-white text-center"
              style={{ borderColor: "white" }}
              onChange={(e) => setEmail(e.target.value)}
              required
              value={email}
            />
            <div className="grid md:flex grid-cols-2 gap-2.5 w-full md:w-fit">
              <Button
                className="w-full md:w-fit col-span-2"
                type="submit"
                variant={"main_green_button"}
                loading={loading}
              >
                Get Connected
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
