"use client";
import { BlogsCardType } from "@/lib/types/blog";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BlogDetailSkeleton from "../BlogDetailPageLoader";
import useTrackVisit from "@/hooks/useTrackVisit";

export default function app() {
  const params = useParams();
  const id: any = params?.id;
  const [item, setItem] = useState<BlogsCardType | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("item-----", item);
  useTrackVisit("blog", null);

  const [refreshData, setRefreshData] = useState(0);
  const router = useRouter();
  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.post(`/api/blogs/${id}`, { id });
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOpportunity();
  }, [id, refreshData]);

  if (!item) {
    return <BlogDetailSkeleton />;
  }

  return (
    <div className="w-full mx-auto space-y-8">
      <div
        className="w-full flex justify-start items-center gap-2 cursor-pointer pt-8"
        onClick={() => {
          router.back();
        }}
      >
        <ChevronLeft size={30} />
        <span className="text-[22px] font-[600]">Blog Details</span>
      </div>
      <div className="w-full max-w-[800px] mx-auto pb-4">
        <section className="w-full mt-[30px] lg:mt-[50px] h-fit space-y-4">
          <div className="w-full h-fit flex flex-col justify-start items-start">
            <h1 className="font-[600] text-[20px] md:text-[30px] md:leading-[40px]">
              {item?.title}
            </h1>
            <div className="flex justify-start items-center gap-0"></div>
          </div>
          <div className="mx-auto relative flex justify-start items-center h-fit">
            <Image
              width={100}
              height={600}
              alt=""
              src={item?.coverImage}
              className="w-full h-auto md:h-[465px] rounded-[12px] overflow-hidden object-cover"
            />
          </div>
        </section>
        <div className="w-full py-6 md:py-[32px] flex flex-col justify-start items-start gap-6 md:gap-8 font-[400] text-base md:text-[20px] leading-normal md:leading-[32px] text-[#3B3C4A] text-justify md:text-left">
          <div
            className="content w-[100%] flex flex-col gap-1 md:gap-2"
            style={{ textAlign: "start" }}
            dangerouslySetInnerHTML={{ __html: item?.text }}
          >
            {/* {item?.text} */}
          </div>
        </div>
      </div>
    </div>
  );
}
