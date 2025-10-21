"use client";
import image1 from "@/public/Ellipse 11.png";
import BlogsCard from "@/components/BlogsCard";
import { BlogsCardType } from "@/lib/types/blogs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import moment from "moment";

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
    item?.image ||
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
  );
  useEffect(() => {
    setImgSrc(
      item?.image ||
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
    );
  }, [item?.image]);

  if (loading && !item) {
    return (
      <AdminLayout>
        <div className="py-[24px] flex flex-col gap-[32px] justify-start items-start w-full">
          <div className="box-shadows-2 py-[24px] flex flex-col gap-[32px] justify-start items-start w-full relative">
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
              <ChevronLeft />
            </Link>
            <h4
              className="font-[500] text-[20px]"
              style={{ textAlign: "start" }}
            >
              Blog Details
            </h4>
          </div>

          <div
            className={`py-[24px] px-[16px] flex flex-col gap-[16px] justify-start items-start w-full bg-[#F8FAF6] rounded-[30px]`}
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex justify-start gap-[16px] items-center lg:w-[60%]">
                <div className="flex justify-start gap-[16px] items-start max-w-[90px]">
                  <div className="rounded-full overflow-hidden w-[56px] h-[56px] object-cover">
                    <Image
                      src={imgSrc}
                      width={56}
                      height={56}
                      alt={""}
                      className="w-[56px] h-[56px] object-cover"
                      onError={() =>
                        setImgSrc(
                          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-start gap-[8px] flex-col items-start w-[calc(100%-100px)]">
                  <Link
                    href={`/blogs/detail/${item?._id}`}
                    className={`heading-text-style-2 max-w-[100%] line-clamp-2 hover:underline ${
                      item.status === "skipped" && "line-through"
                    }`}
                  >
                    {item.title}
                  </Link>
                </div>
              </div>
            </div>

            <span
              className={`plan-text-style-3 line-clamp-1 w-[100%]`}
              style={{ textAlign: "start" }}
            >
              {item.description}
            </span>
            <div className="flex justify-start items-center gap-[16px]">
              <div
                className={`px-[8px] py-[1px] text-[11px] font-[500] rounded-[6px] border-2 border-[#9DADBC]`}
              >
                Due: {moment(item.deadLine).format("MMM DD, YYYY")}
              </div>
              <div
                className={`px-[5px] py-[1px] text-[11px] font-[500] rounded-[6px] bg-[#E1E3DF] text-[#444845] `}
              >
                Not Started
              </div>
            </div>
            <div className="flex justify-start items-center gap-[16px] flex-wrap">
              {item?.majors?.map((item) => (
                <div
                  key={item}
                  className="px-[8px] py-[2px] text-[11px] font-[500] bg-[#D8E6DD] rounded-[6px]"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="w-full flex justify-between items-center md:w-[60%] flex-wrap gap-y-[16px]">
              {/* {item.dependencies?.length ? (
                <div className="flex justify-start items-start gap-[8px] flex-col w-[70%] lg:w-[50%] pe-0 md:pe-4">
                  <span className="font-[500] text-[14px]">Dependencies:</span>
                  <span
                    className="plan-text-style-3"
                    style={{ textAlign: "start" }}
                  >
                    {item.dependencies?.join(", ")}
                  </span>
                </div>
              ) : null} */}

              {/* {item?.linkedOpportunities?.length > 0 ? (
                <div className="flex justify-start items-start gap-[8px] flex-col w-[70%] lg:w-[50%]">
                  <span className="font-[500] text-[14px]">
                    Linked Opportunities:
                  </span>
                  <span
                    className="plan-text-style-3"
                    style={{ textAlign: "start" }}
                  >
                    {item.linkedOpportunities?.join(", ")}
                  </span>
                </div>
              ) : null} */}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  } else {
    return null;
  }
}
