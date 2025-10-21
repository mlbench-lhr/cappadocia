"use client";

import { useEffect, useState } from "react";
import mapPin from "@/public/map-pin.svg";
import vector from "@/public/circle-dollar-sign.svg";
import Image from "next/image";
import { OpportunitiesCardType } from "@/lib/types/opportunities";
import thumbsDown from "@/public/thumbs-down.svg";
import star from "@/public/star.svg";
import applyIcon from "@/public/arrow-up-right-square.svg";
import blogIcon from "@/public/calendar-days (2).svg";
import Link from "next/link";
import axios from "axios";
import moment from "moment";
import { useAppSelector } from "@/lib/store/hooks";
import Swal from "sweetalert2";
import { getSeason } from "@/lib/helper/timeFunctions";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

type OpportunitiesCardTypeProps = OpportunitiesCardType & {
  setRefreshFilter: any;
  filter2Value: "Saved Opportunities" | "Ignored Opportunities";
};

export default function OpportunitiesCard(item: OpportunitiesCardTypeProps) {
  const user = useAppSelector((s) => s.auth.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
  );
  const [saved, setSaved] = useState(
    item?.savedBy?.find((item) => item === user?.id) ? true : false
  );
  const [blogAddedBy, setBlogAddedBy] = useState(
    item?.blogAddedBy?.find((item) => item === user?.id) ? true : false
  );
  const [ignored, setIgnored] = useState(
    item?.ignoredBy?.find((item) => item === user?.id) ? true : false
  );
  const [applied, setApplied] = useState<boolean>(
    item?.appliedBy?.find((item) => item === user?.id) ? true : false
  );
  useEffect(() => {
    setImgSrc(item?.image);
  }, [item?.image]);
  useEffect(() => {
    setBlogAddedBy(
      item?.blogAddedBy?.find((item) => item === user?.id) ? true : false
    );
  }, [item?.blogAddedBy, user?.id]);
  useEffect(() => {
    setSaved(item?.savedBy?.find((item) => item === user?.id) ? true : false);
  }, [item?.savedBy, user?.id]);
  useEffect(() => {
    setIgnored(
      item?.ignoredBy?.find((item) => item === user?.id) ? true : false
    );
  }, [item.ignoredBy, user?.id]);
  useEffect(() => {
    setApplied(
      item?.appliedBy?.find((item) => item === user?.id) ? true : false
    );
  }, [item?.appliedBy, user?.id]);
  const updateOpportunity = async (updates: Partial<OpportunitiesCardType>) => {
    try {
      await axios.put(`/api/opportunities/${item._id}`, updates);
      if (updates.saved !== undefined) setSaved(updates.saved);
      if (updates.ignored !== undefined) setIgnored(updates.ignored);
    } catch (error) {
      console.error("Failed to update opportunity:", error);
    } finally {
      item.setRefreshFilter((item: number) => item + 1);
    }
  };
  async function addToBlog(dateSelected: Date | undefined) {
    console.log();
    setLoading(true);
    if (blogAddedBy) {
      return;
    }
    try {
      const payload = {
        opportunityId: item._id,
        userId: user?.id,
        selectedDate: dateSelected,
      };

      const res = await fetch("/api/blogs/addFromOpportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to add blog",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Added to Blog",
          text: "Opportunity added at the best-fit time period.",
          timer: 1500,
          showConfirmButton: false,
        });
        setBlogAddedBy(true);
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  }
  async function applyToOpportunity() {
    if (applied) {
      return;
    }
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, opportunityId: item?._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply");

      return data; // contains application + success message
    } catch (error: any) {
      console.error("Apply error:", error.message);
      throw error;
    } finally {
      setApplied(true);
      window.open(item.link, "_blank");
    }
  }

  if (item.filter2Value !== "Ignored Opportunities" && ignored) {
    return;
  }

  return (
    <div className="relative section-box-2 py-[24px] px-[16px] flex flex-col gap-[16px] justify-start items-start w-full overflow-hidden z-[1]">
      {/* Top info */}
      <Link
        href={`/opportunities/detail/${item?._id}`}
        className="absolute w-full h-full top-0 left-0 z-[0]"
      ></Link>
      <div className="flex justify-start gap-[10px] md:gap-[16px] items-center w-full">
        <div className="rounded-full overflow-hidden w-[56px] h-[56px]">
          <Image
            src={imgSrc}
            width={56}
            height={56}
            alt={""}
            onError={() =>
              setImgSrc(
                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
              )
            }
            className="w-[56px] h-[56px]"
          />
        </div>
        <div className="justify-start gap-[8px] flex-col items-start w-[calc(100%-72px)]">
          <div className="flex justify-between items-center w-full">
            <Link
              href={`/opportunities/detail/${item?._id}`}
              className="heading-text-style-2 hover:underline z-[2] truncate w-[calc(100%-150px)]"
            >
              {item?.title}
            </Link>
            <div className="text-[11px] font-[500] bg-[#1DA47B] h-[20px] flex items-center justify-center rounded-[18px] px-[10px] text-white">
              {item.category}
            </div>
          </div>
          <h5
            className="heading-text-style-5 w-full truncate"
            style={{ textAlign: "start" }}
          >
            {item?.institute}
          </h5>
        </div>
      </div>

      {/* Description */}
      <span
        className="plan-text-style-3 line-clamp-2 w-full z-[2]"
        style={{ textAlign: "start" }}
      >
        {item?.description}
      </span>

      {/* Majors */}
      <div className="flex justify-start items-center gap-[16px] flex-wrap z-[2]">
        {item?.majors?.map((major) => (
          <div
            key={major}
            className="px-[8px] py-[2px] text-[11px] font-[500] bg-[#D8E6DD] rounded-[6px]"
          >
            {major}
          </div>
        ))}
      </div>

      {/* Type & Price */}
      <div className="w-full flex justify-between items-center gap-[16px] md:w-[70%] z-[2]">
        <div className="flex justify-start items-center gap-[8px]">
          <Image src={mapPin} width={16} height={16} alt={""} />
          <span className="plan-text-style-3">{item?.type}</span>
        </div>
        <div className="flex justify-start items-center gap-[8px]">
          <Image src={vector} width={16} height={16} alt={""} />
          <span className="plan-text-style-3">${item?.price || 0}</span>
        </div>
      </div>

      {/* Difficulty & Due date */}
      <div className="flex justify-start items-center gap-[16px] z-[2]">
        <div
          className={`px-[8px] py-[1px] text-[11px] font-[500] rounded-[6px] ${item?.difficulty} `}
        >
          {item?.difficulty}
        </div>
        <div
          className={`px-[8px] py-[1px] text-[11px] font-[500] rounded-[6px] border-2 border-[#9DADBC]`}
        >
          Due: {moment(item.dueDate).format("MMM DD, YYYY")}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2 w-full z-[2]">
        {!ignored && (
          <button
            className={`opp-button-1 col-span-1 ${saved ? "opacity-60" : ""}`}
            onClick={() => updateOpportunity({ saved: !saved })}
          >
            <Image src={star} width={14} height={14} alt="" />
            {saved ? "Unsave" : "Save"}
          </button>
        )}

        <button
          className={`${
            ignored ? "opp-button-4 col-span-2" : "col-span-1 opp-button-2"
          }`}
          onClick={() => updateOpportunity({ ignored: !ignored })}
        >
          {!ignored && <Image src={thumbsDown} width={14} height={14} alt="" />}
          {ignored ? "Restore" : "Ignore"}
        </button>

        <button
          className="opp-button-1 col-span-1 xl:col-span-2"
          style={{ cursor: blogAddedBy ? "not-allowed" : "pointer" }}
          onClick={() => addToBlog(undefined)}
          disabled={blogAddedBy || loading}
        >
          <Image src={blogIcon} width={14} height={14} alt="" />
          {blogAddedBy ? "Added" : loading ? "Adding..." : "Add to Blog"}
        </button>

        {!ignored && (
          <Button
            style={{ height: "38px" }}
            className={`col-span-1`}
            variant={"main_green_button"}
            onClick={applyToOpportunity}
          >
            <Image src={applyIcon} width={14} height={14} alt="" />
            Apply
          </Button>
        )}
      </div>
    </div>
  );
}
