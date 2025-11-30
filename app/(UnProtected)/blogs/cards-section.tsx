"use client";

import TestimonialCard from "./BlogCards";
import { Files, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { BlogCardsGridSkeleton } from "./BlogCardsLoader";
import Image from "next/image";

export function CardSection() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState("9");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [data, setData] = useState<{
    blogs: any[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    blogs: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function getBlogs() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit,
          ...(debouncedSearch && { search: debouncedSearch }),
        });

        let allBlogs = await axios.get(`/api/admin/blogs?${params.toString()}`);
        setData(allBlogs.data);
        setLoading(false);
      } catch (error) {
        console.log("error----", error);
        setLoading(false);
      }
    }
    getBlogs();
  }, [currentPage, debouncedSearch, limit]);

  return (
    <section id="testimonials" className="pb-[80px] w-full">
      <div className="w-full mx-auto">
        <div className="w-full flex justify-between items-center text-center gap-[20px] flex-wrap-reverse">
          <h2 className="font-[700] text-[24px]">Latest Post</h2>
          <div className="w-[390px] h-[48px] relative">
            <Search
              size={20}
              className="absolute top-[50%] left-3 translate-y-[-50%]"
            />
            <Input
              className="w-full h-full px-10 font-[400] text-[16px]"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full relative mt-[40px] flex flex-col justify-start items-center gap-8">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <BlogCardsGridSkeleton />
            ) : data?.blogs?.length < 1 ? (
              <div className="col-span-3 mx-auto flex flex-col justify-center items-center gap-4">
                <Image
                  src={"/blogs imgs/blogPlaceholder.png"}
                  alt=""
                  width={317}
                  height={257}
                />
                <span className="text-sm md:text-[24px] text-[#7B849A]">
                  No blogs added yet
                </span>
              </div>
            ) : (
              data?.blogs.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  img={testimonial.coverImage}
                  date={testimonial.createdAt}
                  title={testimonial.title}
                  name={testimonial.name}
                  avatar={testimonial.avatar}
                  _id={testimonial._id}
                />
              ))
            )}
          </div>
          {data.totalPages > 1 && (
            <Button
              variant={"outline"}
              className="text-[#696A75]"
              onClick={() => {
                setLimit("0");
              }}
            >
              View All Post
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
