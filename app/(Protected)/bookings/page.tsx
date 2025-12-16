"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";
import {
  Column,
  DynamicTable,
} from "@/app/(AdminLayout)/admin/Components/Table/page";
import moment from "moment";
import Link from "next/link";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import { StatusText } from "@/components/SmallComponents/StatusText";
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/mongodb/models/booking";

export type DashboardCardProps = {
  image: string;
  title: string;
  description: string;
};

export type bookingProps = {
  bookingId: string;
  title: string;
  tourStatus: "upcoming" | "completed" | "cancelled";
  paymentStatus: "paid" | "refunded" | "pending" | "cancelled";
  date: Date;
  _id: string;
};

// Loading skeleton component
const BookingsLoadingSkeleton = () => (
  <div className="w-full space-y-4 animate-pulse">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-200 rounded-lg" />
    ))}
  </div>
);

// No data component
const NoBookingsFound = () => (
  <NoDataComponent
    text="No Data Found"
    actionComponent={
      <Button variant={"main_green_button"}>Start Exploring Now</Button>
    }
  />
);

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<string[]>(["all"]);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const columns: Column[] = [
    {
      header: "Booking ID",
      accessor: "bookingId",
      render: (item) => <span>#{item?.bookingId}</span>,
    },
    {
      header: "Tour Title",
      accessor: "activity.title",
    },
    {
      header: "Tour Status",
      accessor: "status",
      render: (item) => <StatusText status={item.status} />,
    },
    {
      header: "Status",
      accessor: "paymentStatus",
      render: (item) => (
        <StatusBadge
          status={item.paymentStatus}
          textClasses="text-base font-normal"
          widthClasses="w-[93px]"
        />
      ),
    },
    {
      header: "Date",
      accessor: "date",
      render: (item) => {
        return (
          <span>
            {moment(item?.selectDate).format("MMM DD, YYYY | hh:mm A")}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessor: "role",
      render: (item) => (
        <Link
          href={`/bookings/detail/${item._id}`}
          className="text-[#B32053] underline"
        >
          View Details
        </Link>
      ),
    },
  ];

  // Prepare query params for the API
  const queryParams = {
    search: searchQuery,
    filters: filters.includes("all") ? [] : filters,
    // You can add more params like sortBy, sortOrder, etc.
  };

  return (
    <BasicStructureWithName
      name="My Bookings"
      rightSideComponent={
        <SearchComponent
          placeholder="Search by booking id..."
          searchQuery={searchQuery}
          onChangeFunc={setSearchQuery}
        />
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        {/* Filter buttons */}
        <div className="flex justify-start items-start w-full gap-1.5 h-fit flex-wrap md:flex-nowrap capitalize">
          {[
            "all",
            "pending",
            "upcoming",
            "completed",
            "cancelled",
            "missed",
            "in-progress",
          ].map((filter) => {
            const isActive =
              (filter === "all" && filters.includes("all")) ||
              filters.includes(filter.toLowerCase());

            const handleClick = () => {
              if (filter === "all") {
                setFilters(["all"]);
              } else {
                setFilters([filter.toLowerCase()]);
              }
            };

            return (
              <div
                key={filter}
                onClick={handleClick}
                className={`cursor-pointer ${
                  isActive ? "bg-secondary text-primary" : "border"
                } px-4 py-3 leading-tight rounded-[14px] text-[12px] font-medium transition`}
              >
                {filter}
              </div>
            );
          })}
        </div>

        <BoxProviderWithName noBorder={true}>
          {/* Server Pagination Provider wraps the table */}
          <ServerPaginationProvider<Booking>
            apiEndpoint="/api/booking/getAll" // Your API endpoint
            queryParams={queryParams}
            LoadingComponent={BookingsLoadingSkeleton}
            NoDataComponent={NoBookingsFound}
            itemsPerPage={7}
          >
            {(data, isLoading, refetch) => (
              <div className="w-full space-y-0">
                <DynamicTable
                  data={data}
                  columns={columns}
                  itemsPerPage={7}
                  onRowClick={(item) => console.log("Clicked:", item)}
                  isLoading={isLoading}
                />
              </div>
            )}
          </ServerPaginationProvider>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
