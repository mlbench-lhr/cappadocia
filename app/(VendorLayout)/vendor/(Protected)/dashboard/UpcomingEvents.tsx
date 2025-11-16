"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function UpcomingEvents() {
  const userData = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  interface DashboardEvent {
    id: string;
    title: string;
    endDate: string;
    daysLeft: number;
    type: "opportunity" | "blog";
    category: string;
    icon: string;
    color: string;
    source: "opportunity" | "blog";
  }

  interface EventsData {
    upcoming: DashboardEvent[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  // events
  const [events, setEvents] = useState<EventsData>({
    upcoming: [],
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Pagination states for events
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/dashboard/events?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setEvents(result.data);
        } else {
          throw new Error(result.error || "Failed to fetch events");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userData?.id) {
      fetchEvents();
    }
  }, [userData?.id, currentPage]);

  return (
    <div className="flex flex-col gap-[32px] justify-start items-start w-full">
      {(loading || events.upcoming?.length > 0) && (
        <div className="w-full bg-white box-border box-radius  md:px-[40px]">
          <div className="w-full flex flex-col justify-start items-start gap-[16px]">
            {loading ? (
              <Skeleton
                className="font-[500] text-[20px] w-full md:w-[200px] rounded-md"
                style={{ color: "transparent" }}
              >
                Upcoming Events{" "}
              </Skeleton>
            ) : (
              <div className="font-[500] text-[20px]">Upcoming Events</div>
            )}

            <div className="w-full flex flex-col justify-start items-start gap-[0px]">
              {loading
                ? // Show skeleton loaders while loading
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px] py-[16px] border-b box-border-color last:border-b-0"
                    >
                      <div className="w-fit flex justify-start items-center md:items-start gap-[16px]">
                        <Skeleton className="w-[12px] h-[12px] rounded-full mt-0 md:mt-2" />
                        <div className="w-fit flex flex-col justify-start items-start gap-[4px]">
                          <Skeleton className="h-[20px] w-[200px] md:w-[300px]" />
                          <Skeleton className="h-[16px] w-[120px]" />
                        </div>
                      </div>
                      <Skeleton className="h-[16px] w-[100px]" />
                    </div>
                  ))
                : events.upcoming.map((item) => (
                    <div
                      key={item.id}
                      className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px] py-[16px] border-b box-border-color last:border-b-0"
                    >
                      <div className="w-fit flex justify-start items-center md:items-start gap-[16px]">
                        <div className="w-[12px] h-[12px] bg-[#B32053] rounded-full mt-0 md:mt-2"></div>
                        <div className="w-fit flex flex-col justify-start items-start gap-[4px]">
                          <div className="heading-text-style-5">
                            {item.category}: {item.title}
                          </div>
                          <div className="plan-text-style-2">
                            {moment(item.endDate).format("MMMM DD, YYYY")}
                          </div>
                        </div>
                      </div>
                      <div className="plan-text-style-2-green">
                        {item.daysLeft} Days Left
                      </div>
                    </div>
                  ))}
            </div>

            {/* Pagination Controls */}
            {!loading && events.totalPages > 1 && (
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

                  {Array.from({ length: Math.min(events.totalPages, 5) }).map(
                    (_, i) => {
                      const pageNum =
                        events.totalPages <= 5
                          ? i + 1
                          : currentPage <= 3
                          ? i + 1
                          : currentPage >= events.totalPages - 2
                          ? events.totalPages - 4 + i
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
                    }
                  )}

                  {events.totalPages > 5 &&
                    currentPage < events.totalPages - 2 && (
                      <PaginationEllipsis />
                    )}

                  <PaginationItem className="absolute right-1 sm:right-5">
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < events.totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
