"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import { useEffect, useState } from "react";
import axios from "axios";
import TourCard from "@/components/landingPage/landingPageTourCard";

export default function Section2() {
  const [toursAndActivity, setToursAndActivity] =
    useState<ToursAndActivityWithVendor[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/toursAndActivity/getAll?limit=4`);
        console.log("response----", response);

        if (response.data?.data) {
          setToursAndActivity(response.data?.data);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, []);

  if (!toursAndActivity) {
    return null;
  }

  return (
    <div className="w-full h-fit">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] lg:px-[80px] 2xl:px-[90px] gap-12">
        <div className="w-full flex flex-col md:flex-row justify-between items-start h-fit gap-4 md:gap-0">
          <div className="w-full md:w-fit h-fit flex flex-col-reverse sm:flex-row md:flex-col justify-between md:justify-start gap-3 sm:gap-6 items-center md:items-start">
            <h1 className="font-semibold text-lg md:text-3xl">
              Book Your Adventure <br className="hidden md:block" /> Now
            </h1>
            <Button variant={"main_green_button"} asChild>
              <Link href={"/explore"}>Explore Tours</Link>
            </Button>
          </div>
          <div className="w-full md:w-[415px] h-fit">
            <span className="font-normal text-lg md:text-[16px] text-[rgba(9,9,9,0.50)] leading-tight">
              Choose your date, select your favorite tour, and get ready to
              explore the skies and valleys of Cappadocia. Booking is fast,
              easy, and secure.
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-4 md:grid-cols-8 [@media(min-width:1350px)]:grid-cols-16 gap-4">
          {toursAndActivity.map((item, index) => (
            <TourCard key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
