"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import TourCard from "@/components/landingPage/landingPageTourCard";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setDisplayExploreItems } from "@/lib/store/slices/generalSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Section2() {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const displayExploreItems = useAppSelector(
    (s) => s.general.displayExploreItems
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/toursAndActivity/getAll?limit=4`);
        console.log("response----", response);

        if (response.data?.data) {
          dispatch(setDisplayExploreItems(response.data?.data));
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, []);
  const handleNext = () => {
    if (displayExploreItems && currentSlide < displayExploreItems.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  console.log("toursAndActivity---", displayExploreItems);
  if (!displayExploreItems) {
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
        <div className="w-full md:hidden">
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {displayExploreItems?.map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <TourCard {...item} />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlide === displayExploreItems.length - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex justify-center gap-2 mt-4">
              {displayExploreItems?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? "bg-gray-300 w-6" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:grid w-full grid-cols-4 md:grid-cols-8 [@media(min-width:1350px)]:grid-cols-16 gap-4">
          {displayExploreItems?.map((item, index) => (
            <TourCard key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
