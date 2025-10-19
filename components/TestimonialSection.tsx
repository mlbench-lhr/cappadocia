"use client";

import { useState, useEffect, useCallback } from "react";
import TestimonialCard from "./Cards/TestimonialCard";
import TestimonialCardAvatar1 from "@/public/Image.svg";
import arrowLeft from "@/public/arrow-left.svg";
import TestimonialCardAvatar2 from "@/public/Image (1).svg";
import TestimonialCardAvatar3 from "@/public/Image (2).svg";
import { ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
  {
    avatar: TestimonialCardAvatar3,
    name: "Arlene McCoy",
    text: "This platform completely changed the way I learn. The AI insights and teacher feedback kept me on track, and I could see my progress every step of the way!",
  },
  {
    avatar: TestimonialCardAvatar2,
    name: "Dianne Russell",
    text: "The combination of AI guidance and teacher feedback made learning easier and more personalized. I achieved my goals faster than I expected!",
  },
  {
    avatar: TestimonialCardAvatar1,
    name: "Albert Flores",
    text: "Getting AI insights along with teacher feedback gave me the perfect balance of technology and human support. it truly transformed my learning journey.",
  },
  {
    avatar: TestimonialCardAvatar1,
    name: "Jane Smith",
    text: "The personalized learning experience was incredible. I was able to focus on exactly what I needed to improve.",
  },
  {
    avatar: TestimonialCardAvatar2,
    name: "John Doe",
    text: "The feedback system is amazing. I received timely and constructive feedback that helped me grow quickly.",
  },
  {
    avatar: TestimonialCardAvatar3,
    name: "Sarah Johnson",
    text: "The AI insights were spot on. It felt like having a personal tutor available 24/7.",
  },
];

export function TestimonialSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(testimonials.length / cardsPerPage);

  // Handle window resize to adjust cards per page
  useEffect(() => {
    if (!isClient) return;
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }

      // Reset to first page on resize to avoid empty pages
      setCurrentPage(0);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isClient]);

  // Get current testimonials to display
  const currentTestimonials = testimonials.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  // Navigation handlers
  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  }, [totalPages]);

  // Auto slide
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     nextPage();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [nextPage]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: any) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: any) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Left swipe
      nextPage();
    } else if (touchEnd - touchStart > 50) {
      // Right swipe
      prevPage();
    }
  };

  return (
    <section id="testimonials" className="mt-[80px]">
      <div className="container mx-auto">
        <div className="w-full flex justify-center items-center flex-col text-center gap-[20px]">
          <h2 className="heading-text-style-1">Testimonials</h2>
          <p
            className="plan-text-style-2 w-full lg:w-[1000px] text-center"
            style={{ textAlign: "center" }}
          >
            See what our students and teachers have to say about their journey.
          </p>
        </div>

        {/* Testimonial Cards Container */}
        <div
          className="relative mt-[50px] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${
                isClient && window.innerWidth < 1024
                  ? currentPage * (100 / (cardsPerPage + 0.1))
                  : currentPage * (100 / (cardsPerPage - 0.05))
              }%)`,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="flex-shrink-0 transition-all duration-300"
                style={{
                  width:
                    isClient && window.innerWidth < 1024
                      ? `calc(${100 / (cardsPerPage + 0.1)}% - 8px)`
                      : "calc(33.33% - 10px)",
                  margin: "0 16px 0px 0px",
                  transform:
                    isClient && window.innerWidth < 1024
                      ? "scale(0.99)"
                      : "scale(1)",
                }}
              >
                <TestimonialCard
                  text={testimonial.text}
                  name={testimonial.name}
                  avatar={testimonial.avatar}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8 gap-6 w-full">
          <button
            onClick={prevPage}
            className="flex justify-center items-center rounded-full transition-colors cursor-pointer text-[#006C4F] border-[1px] border-[white] w-[24px] h-[24px] md:w-[32px] md:h-[32px]"
            aria-label="Previous testimonials"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-[2px] rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? "w-[12px] md:w-[28px] bg-green-600"
                    : "w-[8px] md:w-[28px] bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={nextPage}
            className={`flex justify-center items-center rounded-full transition-colors cursor-pointer border-[1px] w-[24px] h-[24px] md:w-[32px] md:h-[32px] rotate-180 ${
              currentPage === totalPages - 1
                ? "bg-[#006C4F] text-white border-green-600"
                : "border-[white] text-[#006C4F]"
            }`}
            aria-label="Next testimonials"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
