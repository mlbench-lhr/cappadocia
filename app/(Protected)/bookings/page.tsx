"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";

export type DashboardCardProps = {
  image: string;
  title: string;
  description: string;
};

export type bookingProps = {
  bookingId: string;
  title: string;
  tourStatus: "Upcoming" | "Completed" | "Cancelled";
  paymentStatus: "Paid" | "Refunded" | "Pending" | "Cancelled";
  date: Date;
  _id: string;
};

const bookingData: bookingProps[] = [
  {
    bookingId: "BKG001",
    title: "City Tour",
    tourStatus: "Upcoming",
    paymentStatus: "Paid",
    date: new Date("2025-12-01"),
    _id: "1",
  },
  {
    bookingId: "BKG002",
    title: "Mountain Hike",
    tourStatus: "Completed",
    paymentStatus: "Refunded",
    date: new Date("2025-10-15"),
    _id: "2",
  },
  {
    bookingId: "BKG003",
    title: "Beach Trip",
    tourStatus: "Cancelled",
    paymentStatus: "Cancelled",
    date: new Date("2025-11-20"),
    _id: "3",
  },
  {
    bookingId: "BKG004",
    title: "Museum Visit",
    tourStatus: "Upcoming",
    paymentStatus: "Pending",
    date: new Date("2025-12-10"),
    _id: "4",
  },
];

type DurationFilter = { duration: { from: Date | null; to: Date | null } };
type PriceRangeFilter = {
  priceRange: { min: number | null; max: number | null };
};
type RatingFilter = { rating: number };

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<
    ("all" | DurationFilter | PriceRangeFilter | RatingFilter)[]
  >(["all"]);
  console.log("filters-------", filters);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const isAllActive = filters.includes("all");

  return (
    <BasicStructureWithName
      name="My Bookings"
      showBackOption
      rightSideComponent={
        <SearchComponent
          searchQuery={searchQuery}
          onChangeFunc={setSearchQuery}
        />
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        <div className="flex justify-start items-start w-full gap-1.5 h-fit flex-wrap md:flex-nowrap">
          <div
            className={`cursor-pointer ${
              isAllActive ? " bg-secondary text-primary" : "border"
            } px-4 py-3 leading-tight rounded-[14px] text-[12px] font-medium`}
          >
            All
          </div>
          <div
            className={`cursor-pointer ${
              isAllActive ? " bg-secondary text-primary" : "border"
            } px-4 py-3 leading-tight rounded-[14px] text-[12px] font-medium`}
          >
            Upcoming
          </div>
          <div
            className={`cursor-pointer ${
              isAllActive ? " bg-secondary text-primary" : "border"
            } px-4 py-3 leading-tight rounded-[14px] text-[12px] font-medium`}
          >
            Past
          </div>
          <div
            className={`cursor-pointer ${
              isAllActive ? " bg-secondary text-primary" : "border"
            } px-4 py-3 leading-tight rounded-[14px] text-[12px] font-medium`}
          >
            Cancelled
          </div>
        </div>
        <BoxProviderWithName className="">
          <div className="w-full space-y-0 bg-red-400"></div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
