"use client";
import { Button } from "@/components/ui/button";
import DeadlinePicker from "@/components/ui/datePicker";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Section1() {
  const [date, setDate] = useState();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array of slider images - add your images here
  const slides = [
    {
      image: "/landing page/pic1.png",
      title: "Discover the Best Tours & Activities in Cappadocia",
      subtitle:
        "Book local experiences, guided tours, and adventures — all in one place.",
    },
    {
      image: "/landing page/pic2.jpg", // Add more images
      title: "Experience Hot Air Balloon Rides",
      subtitle:
        "Soar above the fairy chimneys and witness breathtaking sunrise views.",
    },
    {
      image: "/landing page/pic3.jpg", // Add more images
      title: "Explore Ancient Cave Cities",
      subtitle:
        "Discover the rich history and unique architecture of Cappadocia.",
    },
  ];

  // Auto-play slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full h-fit">
      <div className="w-full flex flex-col items-center justify-center h-fit relative z-0">
        <div className="w-full flex flex-col items-center h-[500px] md:h-[653px] justify-center relative z-0 overflow-hidden">
          {/* Slider Images */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                width={100}
                height={100}
                className="w-full h-[500px] md:h-[653px] object-cover object-left"
              />
            </div>
          ))}

          {/* Overlay Content */}
          <div className="w-full flex flex-col items-center text-center absolute top-1/2 translate-y-[-55%] left-0 justify-center gap-2 z-10">
            <h1 className="font-bold text-3xl md:text-[47px] w-[90%] md:w-[485px] text-white leading-tight transition-all duration-500">
              {slides[currentSlide].title}
            </h1>
            <h2 className="font-normal text-xl md:text-[24px] w-[90%] md:w-[485px] text-[rgba(255,255,255,0.74)] leading-tight transition-all duration-500">
              {slides[currentSlide].subtitle}
            </h2>
            <Button asChild variant={"main_green_button"} className="mt-2">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="hidden md:block absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden md:block absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white w-6 md:w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="h-fit md:h-[160px] w-[93%] md:w-[80%] pt-3.5 pb-[21px] px-7 rounded-[14px] border shadow-[0_4px_4.7px_3px_rgba(0,0,0,0.11)] bg-white flex flex-col items-start justify-start text-center translate-y-[-60px] gap-2">
          <h2 className="font-semibold text-md md:text-lg leading-tight">
            Find your tour and activities
          </h2>
          <h2 className="font-semibold text-sm leading-tight mt-2">
            Select Date
          </h2>
          <div className="h-fit md:h-[55px] w-full py-2 px-3 rounded-[8px] border bg-white flex flex-col md:flex-row items-start md:items-center justify-between text-center gap-2 relative">
            <div className=" h-fit flex items-center justify-start text-center gap-2 relative w-full md:w-[30%]">
              <Search color="rgba(0, 0, 0, 0.50)" size={24} />
              <Input
                placeholder="Search..."
                className="font-medium text-base border-none shadow-none"
              />
            </div>
            <div className="h-fit ps-0 md:ps-2 w-full md:w-[30%] flex items-center justify-start text-center gap-6 md:gap-2 relative">
              <div className="h-[20px] w-[3px] hidden md:block rounded-full bg-[rgba(0,0,0,0.50)]"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  opacity="0.5"
                  d="M22 10H2V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V10ZM7 8C6.73478 8 6.48043 7.89464 6.29289 7.70711C6.10536 7.51957 6 7.26522 6 7V3C6 2.73478 6.10536 2.48043 6.29289 2.29289C6.48043 2.10536 6.73478 2 7 2C7.26522 2 7.51957 2.10536 7.70711 2.29289C7.89464 2.48043 8 2.73478 8 3V7C8 7.26522 7.89464 7.51957 7.70711 7.70711C7.51957 7.89464 7.26522 8 7 8ZM17 8C16.7348 8 16.4804 7.89464 16.2929 7.70711C16.1054 7.51957 16 7.26522 16 7V3C16 2.73478 16.1054 2.48043 16.2929 2.29289C16.4804 2.10536 16.7348 2 17 2C17.2652 2 17.5196 2.10536 17.7071 2.29289C17.8946 2.48043 18 2.73478 18 3V7C18 7.26522 17.8946 7.51957 17.7071 7.70711C17.5196 7.89464 17.2652 8 17 8Z"
                  fill="black"
                  fillOpacity="0.5"
                />
                <path
                  d="M19 4H18V7C18 7.26522 17.8946 7.51957 17.7071 7.70711C17.5196 7.89464 17.2652 8 17 8C16.7348 8 16.4804 7.89464 16.2929 7.70711C16.1054 7.51957 16 7.26522 16 7V4H8V7C8 7.26522 7.89464 7.51957 7.70711 7.70711C7.51957 7.89464 7.26522 8 7 8C6.73478 8 6.48043 7.89464 6.29289 7.70711C6.10536 7.51957 6 7.26522 6 7V4H5C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V10H22V7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7956 4 19 4Z"
                  fill="black"
                  fillOpacity="0.5"
                />
              </svg>
              <DeadlinePicker date={date} setDate={setDate} />
            </div>
            <Button
              variant={"main_green_button"}
              className="w-full md:w-[130px] h-[37px] text-lg rounded-[10px]"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
