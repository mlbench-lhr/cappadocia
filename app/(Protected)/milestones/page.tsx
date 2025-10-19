"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import sparkles from "@/public/aiIcon.svg";
import { Plus } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import noDataIcon from "@/public/no data plant.svg";
import { MilestonesCardType } from "@/lib/types/milestones";
import MilestonesCard from "@/components/MilestonesCard";
import Link from "next/link";
import MilestoneTierDialog from "@/components/MilestoneTierDialog";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { getSeason } from "@/lib/helper/timeFunctions";

export default function MilestonesPage() {
  const filterArray1: string[] = ["9", "10", "11", "12"];
  const [filter1Value, setFilter1Value] = useState("");
  const [milestones, setMilestones] = useState<MilestonesCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(0);
  const refreshMilestoneData = useAppSelector(
    (s) => s.milestone.refreshMilestoneData
  );
  const filterArray2: string[] = ["Summer", "Fall", "Spring"];
  const [filter2Value, setFilter2Value] = useState("");
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const userId = useAppSelector((item) => item.auth.user?.id);
  const user = useAppSelector((item) => item.auth.user);
  const [progress, setProgress] = useState({
    total: 0,
    completed: 0,
    progressPercent: 0,
  });

  const [progressLoading, setProgressLoading] = useState(true);
  const currentSeason = getSeason();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter1Value, filter2Value]);

  useEffect(() => {
    async function fetchProgress() {
      setProgressLoading(true);
      try {
        const res = await fetch(
          `/api/studentProgress/${userId}?grade=${
            filter1Value || user?.academicInfo?.gradeLevel || "9"
          }&season=${filter2Value || currentSeason || "Fall"}&tier=${
            user?.milestoneTier
          }`
        );
        if (!res.ok) throw new Error("Failed to fetch milestones");
        const data = await res.json();
        setProgress(data);
      } catch (err) {
        console.log(err);
      } finally {
        setProgressLoading(false);
      }
    }
    if (user?.academicInfo?.gradeLevel && userId) {
      fetchProgress();
    }
  }, [
    user?.academicInfo?.gradeLevel,
    userId,
    refreshData,
    filter2Value,
    filter1Value,
    user?.milestoneTier,
  ]);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        if (isFirstLoad) {
          setLoading(true);
        }
        // Build query params
        const params = new URLSearchParams({
          tier: user?.milestoneTier || "",
          userId: userId || "",
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        // Add optional filters
        if (filter1Value) {
          params.append("grade", filter1Value);
        } else if (user?.academicInfo?.gradeLevel) {
          params.append("grade", user.academicInfo.gradeLevel);
        }

        if (filter2Value) {
          params.append("season", filter2Value);
        } else if (currentSeason) {
          params.append("season", currentSeason);
        }

        const res = await axios.get(`/api/milestones?${params.toString()}`);

        // Handle the new response structure
        setMilestones(res.data.milestones || []);
        setTotalPages(res.data.pagination?.totalPages || 0);
        setTotalCount(res.data.pagination?.totalCount || 0);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
        setMilestones([]);
        setTotalPages(0);
        setTotalCount(0);
      } finally {
        if (isFirstLoad) {
          setLoading(false);
          setIsFirstLoad(false);
        }
      }
    };

    if (user?.milestoneTier && userId) {
      fetchOpportunities();
    }
  }, [
    user?.milestoneTier,
    user?.academicInfo?.gradeLevel,
    userId,
    refreshData,
    currentPage,
    filter1Value,
    filter2Value,
    currentSeason,
    refreshMilestoneData,
  ]);

  return (
    <div className="flex flex-col gap-[24px] justify-start items-start w-full section-box-1 bg-white px-[0px] md:px-[40px] py-[24px] md:py-[24px]">
      <div className="flex w-full justify-between items-center flex-wrap gap-y-[20px]">
        <h5 className="heading-text-style-4"> Milestone Planer</h5>
        <div className="flex w-fit justify-start items-center flex-wrap gap-y-[16px] gap-x-[16px]">
          <Button
            variant={"main_green_button"}
            className="flex justify-center items-center gap-1 w-full md:w-fit"
            asChild
          >
            <Link
              href={"/milestones/generate"}
              className="flex justify-center items-center gap-1 w-full md:w-fit"
            >
              <Image width={14} height={14} alt="" src={sparkles.src} />
              Generate Milestone
            </Link>
          </Button>
          <Button
            variant={"green_secondary_button"}
            className="w-full md:w-fit"
            asChild
          >
            <Link
              href={"/milestones/addCustom"}
              className="flex w-fit justify-end items-center gap-1"
            >
              <Plus size={14} />
              Add Custom Milestone
            </Link>
          </Button>
        </div>
      </div>
      <div className="section-box-2 w-full flex flex-col justify-start items-start gap-[14px] py-[24px] px-[16px]">
        <div className="w-full flex justify-start items-center gap-[24px]">
          <h3 className="font-[500] text-[16px]">
            Progress: Grade {filter1Value || user?.academicInfo?.gradeLevel} -{" "}
            {filter2Value || "Fall"}
          </h3>
          <Button
            variant={"outline"}
            className="w-fit p-0 border-0 px-[12px] py-[4px] md:py-[8px] bg-[#F5FBF5] font-[500] text-[12px]"
            style={{ flex: "none" }}
          >
            {user?.milestoneTier}
          </Button>
        </div>
        {milestones.length > 0 || loading ? (
          <div className="w-full h-[20px] flex justify-start gap-[16px] items-center">
            <div className="w-full h-[10px] flex justify-start items-center bg-[#D8E6DD] rounded-[100px]">
              <div
                className={`h-[10px] flex justify-start gap-[8px] items-center bg-[#B32053] rounded-[100px]`}
                style={{ width: `${progress?.progressPercent}%` }}
              ></div>
            </div>
            <div className="label-style">
              {progress?.progressPercent?.toFixed(2)}%
            </div>
          </div>
        ) : (
          <>No Milestones found. Add Milestones to view your Progress.</>
        )}
        {(milestones.length > 0 || loading) && (
          <h3 className="font-[400] text-[14px]">
            {progress.completed} of {progress.total} Milestone Completed
          </h3>
        )}
      </div>
      <div className="flex justify-start items-center w-full flex-wrap gap-y-[8px]">
        <div className="flex justify-start items-center w-full lg:w-[50%] gap-[16px] overflow-auto">
          {filterArray1.map((item) => (
            <Button
              key={item}
              variant={
                item === filter1Value
                  ? "main_green_button"
                  : "secondary_plane_button"
              }
              className="w-fit"
              size="lg"
              onClick={() => setFilter1Value(item === filter1Value ? "" : item)}
              style={{ flex: "none" }}
            >
              Grade {item}
            </Button>
          ))}
        </div>
        <div className="flex justify-start items-center w-full lg:w-[50%] gap-[16px] overflow-auto">
          {filterArray2.map((item) => (
            <Button
              key={item}
              variant={
                item === filter2Value
                  ? "main_green_button"
                  : "secondary_plane_button"
              }
              className="w-fit"
              size="lg"
              onClick={() => setFilter2Value(item === filter2Value ? "" : item)}
              style={{ flex: "none" }}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="w-full h-full flex justify-center items-start mt-[16px]">
          <div className="flex justify-start items-center gap-[12px] flex-col">
            Loading...
          </div>
        </div>
      ) : milestones?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 w-full">
            {milestones?.map((item, index) => (
              <MilestonesCard
                key={index}
                {...item}
                setRefreshData={setRefreshData}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <Pagination className="w-full">
              <PaginationContent className="relative w-full flex justify-center items-center">
                <PaginationItem className="absolute left-1 sm:left-8">
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum =
                    totalPages <= 5
                      ? i + 1
                      : currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                      ? totalPages - 4 + i
                      : currentPage - 2 + i;

                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationEllipsis />
                )}

                <PaginationItem className="absolute right-1 sm:right-5">
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-start mt-[16px]">
          <div className="flex justify-start items-center gap-[12px] flex-col">
            <Image src={noDataIcon} width={60} height={60} alt="" />
            No Milestones Found
          </div>
        </div>
      )}
    </div>
  );
}
