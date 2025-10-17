"use client";
import { Menu, Thermometer } from "lucide-react";
import { ChevronLeft, Map, Star } from "lucide-react";
import mapPin from "@/public/map-pin.svg";
import vector from "@/public/circle-dollar-sign.svg";
import Image from "next/image";
import { OpportunitiesCardType } from "@/lib/types/opportunities";
import thumbsDown from "@/public/thumbs-down.svg";
import star from "@/public/star.svg";
import applyIcon from "@/public/arrow-up-right-square.svg";
import milestoneIcon from "@/public/calendar-days (2).svg";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";

export default function OpportunitiesCard() {
  const { id } = useParams();
  const user = useAppSelector((s) => s.auth.user);
  const [item, setItem] = useState<OpportunitiesCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<string>(
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
  );
  useEffect(() => {
    setImgSrc(
      item?.image ||
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
    );
  }, [item?.image]);
  const [saved, setSaved] = useState(
    item?.savedBy?.find((item) => item === user?.id) ? true : false
  );
  const [milestoneAddedBy, setMilestoneAddedBy] = useState(
    item?.milestoneAddedBy?.find((item) => item === user?.id) ? true : false
  );
  const [ignored, setIgnored] = useState(
    item?.ignoredBy?.find((item) => item === user?.id) ? true : false
  );
  const [applied, setApplied] = useState<boolean>(
    item?.appliedBy?.find((item) => item === user?.id) ? true : false
  );
  useEffect(() => {
    setSaved(item?.savedBy?.find((item) => item === user?.id) ? true : false);
  }, [item?.savedBy, user?.id]);
  useEffect(() => {
    setMilestoneAddedBy(
      item?.milestoneAddedBy?.find((item) => item === user?.id) ? true : false
    );
  }, [item?.milestoneAddedBy, user?.id]);
  useEffect(() => {
    setIgnored(
      item?.ignoredBy?.find((item) => item === user?.id) ? true : false
    );
  }, [item?.ignoredBy, user?.id]);
  useEffect(() => {
    setApplied(
      item?.appliedBy?.find((item) => item === user?.id) ? true : false
    );
  }, [item?.appliedBy, user?.id]);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/opportunities/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOpportunity();
  }, [id]);
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
      window.open(item?.link, "_blank");
    }
  }
  if (loading) {
    return (
      <div className="py-[24px] flex flex-col gap-[32px] justify-start items-start w-full">
        <div className="box-shadows-2 py-[24px] flex flex-col gap-[32px] justify-start items-start w-full relative">
          <div className="flex justify-start items-center gap-[12px] flex-col">
            Loading...
          </div>
        </div>
      </div>
    );
  }
  const updateOpportunity = async (updates: Partial<OpportunitiesCardType>) => {
    try {
      await axios.put(`/api/opportunities/${item?._id}`, updates);
      if (updates.saved !== undefined) setSaved(updates.saved);
      if (updates.ignored !== undefined) setIgnored(updates.ignored);
    } catch (error) {
      console.error("Failed to update opportunity:", error);
    }
  };
  async function addToMilestone(dateSelected: Date | undefined) {
    console.log();
    setLoading(true);
    if (milestoneAddedBy) {
      return;
    }
    try {
      const payload = {
        opportunityId: item?._id,
        userId: user?.id,
        selectedDate: dateSelected,
      };

      const res = await fetch("/api/milestones/addFromOpportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to add milestone",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Added to Milestone",
          text: "Opportunity added at the best-fit time period.",
          timer: 1500,
          showConfirmButton: false,
        });
        setMilestoneAddedBy(true);
      }
    } catch (error) {
      console.error("Error adding milestone:", error);
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

  return (
    <div className="py-[24px] flex flex-col gap-[32px] justify-start items-start w-full">
      <div className="flex sm:hidden justify-start gap-[24px] items-center">
        <Link href={"/opportunities"} className="pl-2">
          <ChevronLeft />
        </Link>
        <h4 className="font-[500] text-[20px]" style={{ textAlign: "start" }}>
          {item?.title}
        </h4>
      </div>

      <div className="box-shadows-2 py-[24px] flex flex-col gap-[32px] justify-start items-start w-full relative">
        <div className="hidden sm:flex justify-start gap-[24px] items-center">
          <Link href={"/opportunities"} className="pl-2">
            <ChevronLeft />
          </Link>
          <h4 className="heading-text-style-4" style={{ textAlign: "start" }}>
            {item?.title}
          </h4>
        </div>
        <OptionsPopover item={item} />
        <div className="flex flex-col gap-[16px] justify-start items-start w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start gap-[16px] items-center">
              <div className="rounded-full overflow-hidden w-[56px] h-[56px] object-fill">
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
              <div className="flex justify-start gap-[8px] flex-col items-start">
                <div className="heading-text-style-2">{item?.title}</div>
                <h5
                  className="heading-text-style-5"
                  style={{ textAlign: "start" }}
                >
                  {item?.institute}
                </h5>
              </div>
            </div>

            <div className="hidden xl:grid grid-cols-2 md:grid-cols-5 gap-2 w-[50%]">
              <button
                className={`opp-button-1 col-span-1 ${
                  saved ? "opacity-60" : ""
                }`}
                onClick={() => updateOpportunity({ saved: !saved })}
              >
                <Image src={star} width={14} height={14} alt="" />
                {saved ? "Unsave" : "Save"}
              </button>

              <button
                className={`opp-button-2 col-span-1 ${
                  ignored ? "opacity-60" : ""
                }`}
                onClick={() => updateOpportunity({ ignored: !ignored })}
              >
                <Image src={thumbsDown} width={14} height={14} alt="" />
                {ignored ? "Ignored" : "Ignore"}
              </button>

              <button
                className="opp-button-2 col-span-1 md:col-span-2"
                style={{ cursor: milestoneAddedBy ? "not-allowed" : "pointer" }}
                onClick={() => addToMilestone(undefined)}
                disabled={milestoneAddedBy || loading}
              >
                <Image src={milestoneIcon} width={14} height={14} alt="" />
                {milestoneAddedBy
                  ? "Added"
                  : loading
                  ? "Adding..."
                  : "Add to Milestone"}
              </button>

              <Button
                style={{ height: "38px" }}
                className={`col-span-1`}
                variant={"main_green_button"}
                onClick={applyToOpportunity}
              >
                <Image src={applyIcon} width={14} height={14} alt="" />
                {"Apply"}
              </Button>
            </div>
          </div>
          <span
            className="plan-text-style-3 w-full md:w-[60%]"
            style={{ textAlign: "start" }}
          >
            {item?.description}
          </span>
          <div className="flex justify-start items-center gap-x-[16px] gap-y-[8px] flex-wrap">
            {item?.majors?.map((item) => (
              <div className="px-[8px] py-[2px] text-[11px] font-[500] bg-[#D8E6DD] rounded-[6px]">
                {item}
              </div>
            ))}
          </div>
          <div className="flex justify-start items-center gap-[16px] flex-wrap -mt-2">
            <div className="px-[8px] py-[2px] text-[11px] font-[500] bg-slate-200 rounded-[6px]">
              {item?.category}
            </div>
          </div>

          <div className="w-full flex justify-between items-center gap-[16px] md:w-[30%]">
            <div className="flex justify-start items-center gap-[8px]">
              <Image src={mapPin} width={16} height={16} alt={""} />
              <span className="plan-text-style-3">{item?.type}</span>
            </div>
            <div className="flex justify-start items-center gap-[8px]">
              <Image src={vector} width={16} height={16} alt={""} />
              <span className="plan-text-style-3">${item?.price}</span>
            </div>
          </div>
          <div className="flex justify-start items-center gap-[16px]">
            <div
              className={`px-[8px] py-[1px] text-[11px] font-[500] rounded-[6px] ${item?.difficulty} `}
            >
              {item?.difficulty}
            </div>
            <div
              className={`px-[8px] py-[1px] text-[11px] font-[500] rounded-[6px] border-2 border-[#9DADBC]`}
            >
              Due: {moment(item?.dueDate).format("MMM DD, YYYY")}
            </div>
          </div>
          <div className="grid xl:hidden grid-cols-1 md:grid-cols-5 gap-2 w-[100%]">
            <button
              className="opp-button-2 col-span-1 md:col-span-2"
              style={{ cursor: milestoneAddedBy ? "not-allowed" : "pointer" }}
              onClick={() => addToMilestone(undefined)}
              disabled={milestoneAddedBy || loading}
            >
              <Image src={milestoneIcon} width={14} height={14} alt="" />
              {milestoneAddedBy
                ? "Added"
                : loading
                ? "Adding..."
                : "Add to Milestone"}
            </button>

            <Button
              style={{ height: "38px" }}
              className={`col-span-1`}
              variant={"main_green_button"}
              onClick={applyToOpportunity}
            >
              <Image src={applyIcon} width={14} height={14} alt="" />
              {"Apply"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { getSeason } from "@/lib/helper/timeFunctions";
import Swal from "sweetalert2";

function OptionsPopover({ item }: { item: OpportunitiesCardType | null }) {
  const [saved, setSaved] = useState(item?.saved);
  const [ignored, setIgnored] = useState(item?.ignored);
  const updateOpportunity = async (updates: Partial<OpportunitiesCardType>) => {
    try {
      await axios.put(`/api/opportunities/${item?._id}`, updates);
      if (updates.saved !== undefined) setSaved(updates.saved);
      if (updates.ignored !== undefined) setIgnored(updates.ignored);
    } catch (error) {
      console.error("Failed to update opportunity:", error);
    }
  };

  return (
    <div className="flex xl:hidden absolute top-2 right-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="p-2">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] top-0 absolute right-0">
          <div className="w-full flex flex-col space-y-2">
            <button
              className={`flex justify-start gap-3 items-center ${
                saved ? "opacity-60" : ""
              }`}
              onClick={() => updateOpportunity({ saved: !saved })}
            >
              <Image src={star} width={14} height={14} alt="" />
              {saved ? "Unsave" : "Save"}
            </button>

            <button
              className={`flex justify-start gap-3 items-center col-span-1 ${
                ignored ? "opacity-60" : ""
              }`}
              onClick={() => updateOpportunity({ ignored: !ignored })}
            >
              <Image src={thumbsDown} width={14} height={14} alt="" />
              {ignored ? "Ignored" : "Ignore"}
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
