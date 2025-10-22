"use client";

import TestimonialCard from "./BlogCards";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

const testimonials = [
  {
    avatar:
      "/blogs imgs/source/bastian-ignacio-vega-cani-9UAfLTqMoS0-unsplash.jpg",
    img: "/blogs imgs/source/9b2d44e6455174d2ba444fbd890c8b48b0d52ed5.jpg",
    name: "Arlene McCoy",
    date: "February 20, 2025",
    text: "Cappadocia: The Dreamland You Have to See Once in Your Life!",
  },
  {
    avatar: "/blogs imgs/source/ben-den-engelsen-7TU5JJAwPyU-unsplash1.jpg",
    img: "/blogs imgs/source/a7b9dd2a37efeca668d161cd1c54a71a7414842a.jpg",
    name: "Arlene McCoy",
    date: "March 24, 2025",
    text: "This Place Feels Like beautiful Another Planet like Cappadocia, Turkey!",
  },
  {
    avatar: "/blogs imgs/source/toa-heftiba-O3ymvT7Wf9U-unsplash.jpg",
    img: "/blogs imgs/source/29167019e6feac55d6c5c699d6b8d4414f5d0e77.jpg",
    name: "Arlene McCoy",
    date: "April 14, 2025",
    text: "Cappadocia Travel Tips: When to Go, What to See & Where to Stay",
  },
  {
    avatar: "/blogs imgs/source/luis-villasmil-hh3ViD0r0Rc-unsplash.jpg",
    img: "/blogs imgs/source/4a124059c4699612055bd571d6f148578635c167.jpg",
    name: "Arlene McCoy",
    date: "October 20, 2025",
    text: "Sunrise Magic in Cappadocia Unreal Views! Close to nature ",
  },
  {
    avatar: "/blogs imgs/source/omid-armin-wH3DddKXPoQ-unsplash.jpg",
    img: "/blogs imgs/source/713766a45f7bd7edbb5a4dc6229f9637f77bb7ff.jpg",
    name: "Arlene McCoy",
    date: "December 03, 2025",
    text: "I Woke Up in a Cave Hotel in Cappadocia — Unreal Experience!",
  },
  {
    avatar:
      "/blogs imgs/source/bastian-ignacio-vega-cani-9UAfLTqMoS0-unsplash.jpg",
    img: "/blogs imgs/source/fce0f66b36596b7a3bb96b7122ed77878227053b.jpg",
    name: "Arlene McCoy",
    date: "February 12, 2025",
    text: "Exploring Turkey’s Hidden Wonderland: Cappadocia!",
  },
  {
    avatar: "/blogs imgs/source/ben-den-engelsen-7TU5JJAwPyU-unsplash1.jpg",
    img: "/blogs imgs/source/8861f38d3fffbc5030644caaea473452e354175b.jpg",
    name: "Arlene McCoy",
    date: "March 20, 2025",
    text: "Flew in a Hot Air Balloon Over Fairy Chimneys! in central Turkey,",
  },
  {
    avatar: "/blogs imgs/source/toa-heftiba-O3ymvT7Wf9U-unsplash.jpg",
    img: "/blogs imgs/source/0f03870af943da8d5ccab1d4966d4c629d2c1895.jpg",
    name: "Arlene McCoy",
    date: "January 07, 2025",
    text: "Cappadocia Travel Vlog: Where Dreams Float in the Sky! a Historical region",
  },
  {
    avatar: "/blogs imgs/source/luis-villasmil-hh3ViD0r0Rc-unsplash.jpg",
    img: "/blogs imgs/source/0b1a72488171d99ded7dacb1d4538c750ae67c64.jpg",
    name: "Arlene McCoy",
    date: "February 10, 2025",
    text: "Hot Air Balloons, Caves & Magic — Cappadocia Travel Guide! Fairy chimneys",
  },
];

export function CardSection() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshData, setRefreshData] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [data, setData] = useState<{
    blogs: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    blogs: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  console.log("data-----", data);

  useEffect(() => {
    async function getblogs() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
          ...(debouncedSearch && { search: debouncedSearch }),
        });

        let allblogs = await axios.get(`/api/admin/blogs?${params.toString()}`);
        setData(allblogs.data);
        setLoading(false);
      } catch (error) {
        console.log("error----", error);
        setLoading(false);
      }
    }
    getblogs();
  }, [currentPage, refreshData, debouncedSearch]);

  return (
    <section id="testimonials" className="pb-[80px] w-full">
      <div className="w-full mx-auto">
        <div className="w-full flex justify-between items-center text-center gap-[20px] flex-wrap">
          <h2 className="font-[700] text-[24px]">Latest Post</h2>
          <div className="w-[390px] h-[48px] relative">
            <Search
              size={20}
              className="absolute top-[50%] left-3 translate-y-[-50%]"
            />
            <Input
              className="w-full h-full px-10 font-[400] text-[16px]"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="w-full relative mt-[50px] flex flex-col justify-start items-center gap-8">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.blogs.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                img={testimonial.coverImage}
                date={testimonial.createdAt}
                title={testimonial.title}
                name={testimonial.name}
                avatar={testimonial.avatar}
                _id={testimonial._id}
              />
            ))}
          </div>
          <Button variant={"outline"} className="text-[#696A75] ">
            View All Post
          </Button>
        </div>
      </div>
    </section>
  );
}
