"use client";
import TourCard, {
  TourCardProps,
} from "@/components/landingPage/landingPageTourCard";
import { Button } from "@/components/ui/button";

const tourCardData: TourCardProps[] = [
  {
    image: "/landing page/image.png",
    title: "Blue Tour – Hidden Cappadocia",
    price: 569.0,
    rating: 4.6,
    days: 5,
  },
  {
    image: "/landing page/image (1).png",
    title: "Red Tour (North Cappadocia)",
    price: 569.0,
    rating: 4.6,
    days: 5,
  },
  {
    image: "/landing page/image (2).png",
    title: "Private Cave Hotel Stay",
    price: 569.0,
    rating: 4.6,
    days: 5,
  },
  {
    image: "/landing page/image (3).png",
    title: "Private Cave Hotel Stay",
    price: 569.0,
    rating: 4.6,
    days: 5,
  },
];

export default function Section2() {
  return (
    <div className="w-full h-fit">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] lg:px-[80px] 2xl:px-[90px] gap-14">
        <div className="w-full flex flex-col md:flex-row justify-between items-start h-fit gap-4 md:gap-0">
          <div className="w-full md:w-fit h-fit flex flex-row md:flex-col justify-between md:justify-start gap-8 items-center md:items-start">
            <h1 className="font-semibold text-xl md:text-4xl">
              Book Your Adventure <br className="hidden md:block" /> Now
            </h1>
            <Button variant={"main_green_button"}>Explore Tours</Button>
          </div>
          <div className="w-full md:w-[415px] h-fit">
            <span className="font-normal text-lg md:text-[22px] text-[rgba(9,9,9,0.50)] leading-tight">
              Choose your date, select your favorite tour, and get ready to
              explore the skies and valleys of Cappadocia. Booking is fast,
              easy, and secure.
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-4 md:grid-cols-8 [@media(min-width:1350px)]:grid-cols-16 gap-4">
          {tourCardData.map((item) => (
            <TourCard key={item.image} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
