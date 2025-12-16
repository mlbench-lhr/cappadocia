"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useMemo, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BookingIcon, DollarIcon, StarIcon } from "@/public/allIcons/page";
import axios from "axios";
import { RatingBreakdown } from "./RatingBreakdown";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartAreaGradient } from "../dashboard/Graph";
import { ChartBarGradient } from "./BarsGraph";

export type ReportsCardsData = {
  image?: React.ReactNode;
  title: number | string;
  description: string;
  progress: { value: number; increment: boolean };
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const vendorData = useAppSelector((s) => s.auth.user);
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [reportsCardData, setReportsCardData] = useState<ReportsCardsData[]>([
    {
      title: 0,
      description: "Total Revenue",
      progress: { value: 18.0, increment: true },
    },
    {
      title: 0,
      description: "Completed Bookings",
      progress: { value: 18.0, increment: true },
    },
    {
      title: 0,
      description: "Average Rating",
      progress: { value: 18.0, increment: true },
    },
  ]);

  const images = [
    <DollarIcon color="white" />,
    <BookingIcon color="white" />,
    <StarIcon color="white" size="18" />,
  ];

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get<ReportsCardsData[]>(
          "/api/reports/getStats"
        );
        console.log("response----------", response.data);
        setReportsCardData(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  console.log("reportsCardData----------", reportsCardData);

  return (
    <BasicStructureWithName name="Performance Reports">
      <div className="grid grid-cols-16 w-full gap-4 h-fit">
        <div className="col-span-16 h-full flex flex-col justify-start items-start gap-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading
              ? reportsCardData.map((item, index) => (
                  <div
                    className="border h-[110px] rounded-2xl py-3 px-4.5 text-primary flex flex-col justify-between items-start line-clamp-1"
                    key={index}
                  >
                    <div className="w-full flex justify-between items-center">
                      <Skeleton className="text-2xl md:text-4xl font-semibold line-clamp-1 text-transparent">
                        {item.title}
                      </Skeleton>
                      <Skeleton className="flex justify-center items-center w-[36px] h-[36px] rounded-full bg-primary">
                        {images[index]}
                      </Skeleton>
                    </div>
                    <Skeleton className="text-sm md:text-base font-medium text-transparent">
                      {item.description}
                    </Skeleton>
                  </div>
                ))
              : reportsCardData.map((item, index) => (
                  <div
                    className="border rounded-2xl py-1.5 md:py-3 px-2 md:px-4.5 flex flex-col gap-2 justify-between items-start line-clamp-1"
                    key={index}
                  >
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm md:text-base font-semibold">
                        {item.description}
                      </span>
                      <div className="flex justify-center items-center w-[30px] md:w-[36px] h-[30px] md:h-[36px] rounded-full bg-primary">
                        {images[index]}
                      </div>
                    </div>
                    <span className="text-xl md:text-4xl font-semibold line-clamp-1 leading-none">
                      {item.title}
                    </span>
                    <span className="text-base font-medium line-clamp-1 text-primary">
                      {item.progress.increment ? "+" : "-"}
                      {item.progress.value}%
                    </span>
                  </div>
                ))}
          </div>
          <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="col-span-1 h-[300px] md:h-[470px] overflow-hidden">
              <ChartAreaGradient className=" h-full " />
            </div>
            {/* <div className="col-span-1 h-[320px]">
              <RatingBreakdown />
            </div> */}
            <div className="col-span-1 h-[300px] md:h-[470px]">
              <ChartBarGradient />
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* <div className="col-span-2 h-[470px]">
              <ChartBarGradient />
            </div> */}
          </div>
        </div>
      </div>
    </BasicStructureWithName>
  );
}
