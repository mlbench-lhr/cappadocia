"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "@/components/admin/admin-layout";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, PencilLine, Trash } from "lucide-react";
import moment from "moment";
import { BlogsCardType } from "@/lib/types/blog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddDialog from "../../AddDialog/page";
import Swal from "sweetalert2";

export default function BlogCard() {
  const { id } = useParams();
  const [item, setItem] = useState<BlogsCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(0);
  const router = useRouter();
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

  const deleteBlog = async () => {
    Swal.fire({
      title: "Delete Blog",
      text: "Are you sure you want to delete this Blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B32053",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const res = await fetch(`/api/admin/blogs/${item?._id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          if (res.ok) {
            console.log(`Milestone ${item?._id} marked as skipped`);
          } else {
            console.error("Failed to skip milestone");
          }
          router.push(`/admin/blogs`);
        } catch (err) {
          console.error("Error skipping milestone:", err);
        } finally {
          setLoading(false);
        }
      }
    });
  };

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
          className={` flex flex-col gap-[16px] justify-start items-start w-full`}
        >
          <div className="w-full flex justify-between gap-[24px] items-center mb-[16px] flex-wrap">
            <div className="flex justify-start gap-1 md:gap-[24px] items-center">
              <Link href={"/admin/blogs"} className="pl-2">
                <ArrowLeft color="#B32053" size={30} />
              </Link>
              <h4 className="text-2xl md:text-[35px] font-[600] text-center">
                Blog Details
              </h4>
            </div>
            <div className="flex justify-end gap-[10px] items-center">
              <AddDialog
                setRefreshData={setRefreshData}
                edit={true}
                item={item}
                setItem={setItem}
              />
              <Button
                className="flex text-white bg-[#F52E2E] text-[20px] px-[20px]"
                onClick={deleteBlog}
              >
                <Trash size={26} />
                Delete
              </Button>
            </div>
          </div>
          <div className="py-[24px] px-[16px] flex justify-start flex-col md:flex-row items-center gap-4 w-full bg-[#F0F1F3]">
            <div className="h-auto md:h-[150px] w-full md:w-fit rounded-2xl overflow-hidden">
              <Image
                src={imgSrc}
                width={56}
                height={56}
                alt={""}
                className="h-auto md:h-[150px] w-full md:w-fit object-cover"
                onError={() =>
                  setImgSrc(
                    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-coverImage.png"
                  )
                }
              />
            </div>
            <div
              className={`px-0 md:px-[16px] flex flex-col justify-start items-start w-full bg-[#F0F1F3]`}
            >
              <h3
                className={`text-xl md:text-[32px] text-[#B32053] font-[600] w-[100%]`}
              >
                Title
              </h3>
              <span className={`text-xl md:text-[28px] font-[400] w-[100%]`}>
                {item?.title}
              </span>
              <span
                className={`text-lg md:text-[20px] font-[500] text-[rgba(120,130,127,0.80)] w-[100%]`}
              >
                Published On : {moment(item?.createdAt).format("MMM DD, YYYY")}
              </span>
            </div>
          </div>
          <div
            className={`py-[24px] px-[16px] flex flex-col gap-[16px] justify-start items-start w-full bg-[#F0F1F3]`}
          >
            <div
              className="content w-[100%]"
              style={{ textAlign: "start" }}
              dangerouslySetInnerHTML={{ __html: item?.text }}
            />
          </div>
        </div>
      </AdminLayout>
    );
  } else {
    return null;
  }
}
