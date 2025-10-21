"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "@/components/admin/admin-layout";
import Link from "next/link";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import moment from "moment";
import { BlogsCardType } from "@/lib/types/blog";
import Image from "next/image";

export default function BlogCard() {
  const { id } = useParams();
  const [item, setItem] = useState<BlogsCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(0);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOpportunity();
  }, [id, refreshData]);

  const [imgSrc, setImgSrc] = useState(
    item?.coverImage ||
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-coverImage.png"
  );
  useEffect(() => {
    setImgSrc(
      item?.coverImage ||
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-coverImage.png"
    );
  }, [item?.coverImage]);

  if (loading && !item) {
    return (
      <AdminLayout>
        <div className="py-[24px] flex flex-col gap-[32px] justify-start items-start w-full">
          <div className="py-[24px] flex flex-col gap-[32px] justify-start items-start w-full relative">
            <div className="flex justify-start items-center gap-[12px] flex-col">
              Loading...
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
  if (item) {
    return (
      <AdminLayout>
        <div
          className={`py-[24px] px-[16px] flex flex-col gap-[16px] justify-start items-start w-full`}
        >
          <div className="flex justify-start gap-[24px] items-center mb-[16px]">
            <Link href={"/admin/blogs"} className="pl-2">
              <ArrowLeft color="#B32053" size={30} />
            </Link>
            <h4 className="text-[35px] font-[600] text-center">Blog Details</h4>
          </div>
          <div className="rounded-3xl overflow-hidden w-[100%] mx-auto h-[300px] object-cover object-center">
            <Image
              src={imgSrc}
              width={56}
              height={56}
              alt={""}
              className="h-auto w-full object-cover"
              onError={() =>
                setImgSrc(
                  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-coverImage.png"
                )
              }
            />
          </div>
          <div
            className={`py-[24px] px-[16px] flex flex-col justify-start items-start w-full bg-[#F0F1F3]`}
          >
            <h3 className={`text-[32px] text-[#B32053] font-[600] w-[100%]`}>
              Title
            </h3>
            <span className={`text-[28px] font-[400] w-[100%]`}>
              {item.title}
            </span>
            <span
              className={`text-[20px] font-[500] text-[rgba(120,130,127,0.80)] w-[100%]`}
            >
              Published On : {moment(item.createdAt).format("MMM DD, YYYY")}
            </span>
          </div>
          <div
            className={`py-[24px] px-[16px] flex flex-col gap-[16px] justify-start items-start w-full bg-[#F0F1F3]`}
          >
            <span
              className={`text-[14px] font-[400] w-[100%] leading-[32px]`}
              style={{ textAlign: "start" }}
            >
              {item.text}
            </span>
          </div>
        </div>
      </AdminLayout>
    );
  } else {
    return null;
  }
}
