"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import TourCard from "@/components/landingPage/landingPageTourCard";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setDisplayExploreItems } from "@/lib/store/slices/generalSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LandingTourCardSkeleton from "@/components/Skeletons/LandingTourCardSkeleton";

export default function Section2() {
  const [loading, setLoading] = useState<boolean>(true);
  const [popularLoading, setPopularLoading] = useState<boolean>(true);
  const [ratedLoading, setRatedLoading] = useState<boolean>(true);
  const [recommendedLoading, setRecommendedLoading] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [currentPopularSlide, setCurrentPopularSlide] = useState<number>(0);
  const [currentRatedSlide, setCurrentRatedSlide] = useState<number>(0);
  const [currentRecommendedSlide, setCurrentRecommendedSlide] =
    useState<number>(0);
  const displayExploreItems = useAppSelector(
    (s) => s.general.displayExploreItems
  );
  const [popularItems, setPopularItems] = useState<any[]>([]);
  const [topRatedItems, setTopRatedItems] = useState<any[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<any[]>([]);
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
    const getPopular = async () => {
      try {
        setPopularLoading(true);
        const resp = await axios.get(
          `/api/toursAndActivity/getAll?limit=4&sortBy=popular`
        );
        if (resp.data?.data) setPopularItems(resp.data.data);
      } catch (e) {
        console.log("popular err---", e);
      } finally {
        setPopularLoading(false);
      }
    };
    const getTopRated = async () => {
      try {
        setRatedLoading(true);
        const resp = await axios.get(
          `/api/toursAndActivity/getAll?limit=4&sortBy=rating`
        );
        if (resp.data?.data) setTopRatedItems(resp.data.data);
      } catch (e) {
        console.log("rated err---", e);
      } finally {
        setRatedLoading(false);
      }
    };
    const getRecommended = async () => {
      try {
        setRecommendedLoading(true);
        const resp = await axios.get(
          `/api/toursAndActivity/getAll?limit=4&recommended=true`
        );
        if (resp.data?.data) setRecommendedItems(resp.data.data);
      } catch (e) {
        console.log("recommended err---", e);
      } finally {
        setRecommendedLoading(false);
      }
    };
    getData();
    getPopular();
    getTopRated();
    getRecommended();
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
  const handleNextPopular = () => {
    if (popularItems && currentPopularSlide < popularItems.length - 1) {
      setCurrentPopularSlide(currentPopularSlide + 1);
    }
  };
  const handlePrevPopular = () => {
    if (currentPopularSlide > 0) {
      setCurrentPopularSlide(currentPopularSlide - 1);
    }
  };
  const handleNextRated = () => {
    if (topRatedItems && currentRatedSlide < topRatedItems.length - 1) {
      setCurrentRatedSlide(currentRatedSlide + 1);
    }
  };
  const handlePrevRated = () => {
    if (currentRatedSlide > 0) {
      setCurrentRatedSlide(currentRatedSlide - 1);
    }
  };
  const handleNextRecommended = () => {
    if (
      recommendedItems &&
      currentRecommendedSlide < recommendedItems.length - 1
    ) {
      setCurrentRecommendedSlide(currentRecommendedSlide + 1);
    }
  };
  const handlePrevRecommended = () => {
    if (currentRecommendedSlide > 0) {
      setCurrentRecommendedSlide(currentRecommendedSlide - 1);
    }
  };

  console.log("toursAndActivity---", displayExploreItems);

  return (
    <div className="w-full h-fit">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] lg:px-[80px] 2xl:px-[90px] gap-12">
        <div className="w-full flex flex-col md:flex-row justify-between items-start h-fit gap-0 md:gap-0">
          <div className="w-full md:w-fit h-fit flex flex-col-reverse sm:flex-row md:flex-col justify-between md:justify-start gap-3 sm:gap-6 items-center md:items-start">
            <h1 className="font-semibold text-lg md:text-3xl">
              Book Your Adventure <br className="hidden md:block" /> Now
            </h1>
            <Button variant={"main_green_button"} asChild>
              <Link href={"/explore"}>Explore Tours</Link>
            </Button>
          </div>
          <div className="w-full md:w-[415px] h-fit text-center md:text-start">
            <span className="font-normal text-sm md:text-[16px] text-[rgba(9,9,9,0.50)] text-center md:text-start leading-tight">
              Choose your date, select your favorite tour, and get ready to
              explore the skies and valleys of Cappadocia. Booking is fast,
              easy, and secure.
            </span>
          </div>
        </div>
        {displayExploreItems && displayExploreItems?.length > 0 && (
          <div className="w-full md:hidden">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm">Latest Tours</h2>
              <Button variant={"outline"} asChild size={"sm"}>
                <Link href={"/explore/tours"}>View All</Link>
              </Button>
            </div>
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
              {displayExploreItems && (
                <>
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
                </>
              )}
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
        )}
        {/* Popular (Mobile) */}
        {popularItems && popularItems?.length > 0 && (
          <div className="w-full md:hidden">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm">Most Popular</h2>
              <Button variant={"outline"} asChild size={"sm"}>
                <Link href={"/explore/tours"}>View All</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentPopularSlide * 100}%)`,
                  }}
                >
                  {popularItems?.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-2">
                      <TourCard {...item} />
                    </div>
                  ))}
                </div>
              </div>
              {popularItems && popularItems.length > 0 && (
                <>
                  <button
                    onClick={handlePrevPopular}
                    disabled={currentPopularSlide === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextPopular}
                    disabled={currentPopularSlide === popularItems.length - 1}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
              <div className="flex justify-center gap-2 mt-4">
                {popularItems?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPopularSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentPopularSlide
                        ? "bg-gray-300 w-6"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Top Rated (Mobile) */}
        {topRatedItems && topRatedItems?.length > 0 && (
          <div className="w-full md:hidden">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm">Top Rated</h2>
              <Button variant={"outline"} asChild size={"sm"}>
                <Link href={"/explore/tours"}>View All</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentRatedSlide * 100}%)`,
                  }}
                >
                  {topRatedItems?.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-2">
                      <TourCard {...item} />
                    </div>
                  ))}
                </div>
              </div>
              {topRatedItems && topRatedItems.length > 0 && (
                <>
                  <button
                    onClick={handlePrevRated}
                    disabled={currentRatedSlide === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextRated}
                    disabled={currentRatedSlide === topRatedItems.length - 1}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
              <div className="flex justify-center gap-2 mt-4">
                {topRatedItems?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentRatedSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentRatedSlide
                        ? "bg-gray-300 w-6"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Recommended by Cappadocia Platform (Mobile) */}
        {recommendedItems && recommendedItems?.length > 0 && (
          <div className="w-full md:hidden">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm">
                Recommended by Cappadocia Platform
              </h2>
              <Button variant={"outline"} asChild size={"sm"}>
                <Link href={"/explore/tours"}>View All</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentRecommendedSlide * 100}%)`,
                  }}
                >
                  {recommendedItems?.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-2">
                      <TourCard {...item} />
                    </div>
                  ))}
                </div>
              </div>
              {recommendedItems && recommendedItems.length > 0 && (
                <>
                  <button
                    onClick={handlePrevRecommended}
                    disabled={currentRecommendedSlide === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextRecommended}
                    disabled={
                      currentRecommendedSlide === recommendedItems.length - 1
                    }
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
              <div className="flex justify-center gap-2 mt-4">
                {recommendedItems?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentRecommendedSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentRecommendedSlide
                        ? "bg-gray-300 w-6"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {displayExploreItems && displayExploreItems?.length > 0 && (
          <div className="hidden md:flex w-full flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Latest Tours</h2>
              <Button variant={"outline"} asChild size={"sm"}>
                <Link href={"/explore/tours"}>View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 [@media(min-width:1350px)]:grid-cols-16 gap-4">
              {loading
                ? [0, 1, 2, 3]?.map((item) => (
                    <LandingTourCardSkeleton key={item} />
                  ))
                : displayExploreItems?.map((item, index) => (
                    <TourCard key={index} {...item} />
                  ))}
            </div>
          </div>
        )}
        {popularItems && popularItems?.length > 0 && (
          <div className="hidden md:flex w-full flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Most Popular</h2>
              <Button variant={"outline"} asChild size={"sm"}>
                <Link href={"/explore/tours"}>View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 [@media(min-width:1350px)]:grid-cols-16 gap-4">
              {popularLoading
                ? [0, 1, 2, 3]?.map((item) => (
                    <LandingTourCardSkeleton key={item} />
                  ))
                : popularItems?.map((item, index) => (
                    <TourCard key={index} {...item} />
                  ))}
            </div>
          </div>
        )}

        {/* Top Rated */}
        {topRatedItems && topRatedItems?.length > 0 && (
          <div className="hidden md:flex w-full flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Top Rated</h2>
              <Button variant={"outline"} asChild size={"sm"}>
                <Link href={"/explore/tours"}>View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 [@media(min-width:1350px)]:grid-cols-16 gap-4">
              {ratedLoading
                ? [0, 1, 2, 3]?.map((item) => (
                    <LandingTourCardSkeleton key={item} />
                  ))
                : topRatedItems?.map((item, index) => (
                    <TourCard key={index} {...item} />
                  ))}
            </div>
          </div>
        )}
        {/* Recommended by Cappadocia Platform */}
        {recommendedItems && recommendedItems?.length > 0 && (
          <div className="hidden md:flex w-full flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                Recommended by Cappadocia Platform
              </h2>
              <Button variant={"outline"} asChild size={"sm"}>
                <Link href={"/explore/tours"}>View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 [@media(min-width:1350px)]:grid-cols-16 gap-4">
              {recommendedLoading
                ? [0, 1, 2, 3]?.map((item) => (
                    <LandingTourCardSkeleton key={item} />
                  ))
                : recommendedItems?.map((item, index) => (
                    <TourCard key={index} {...item} />
                  ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
