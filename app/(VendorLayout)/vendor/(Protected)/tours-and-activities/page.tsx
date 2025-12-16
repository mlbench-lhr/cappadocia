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
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BookingWithPopulatedData } from "@/lib/types/booking";

// Loading skeleton component
const BookingsLoadingSkeleton = () => (
  <div className="w-full space-y-4 animate-pulse">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="h-10 md:h-16 bg-gray-200 rounded-lg" />
    ))}
  </div>
);

// No data component
const NoBookingsFound = () => <NoDataComponent text="No Data Found" />;

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
      header: "Tour Title",
      accessor: "title",
    },
    {
      header: "Price/per person",
      accessor: "title",
    },
    {
      header: "Tour Status",
      accessor: "status",
      render: (item) => (
        <div className="flex justify-start items-center">
          <StatusBadge
            status={item.status}
            textClasses="text-base font-normal"
            widthClasses="w-fit"
          />
        </div>
      ),
    },
    {
      header: "Next Available Date",
      accessor: "date",
      render: (item) => {
        return (
          <span>{moment(item.createdAt).format("MMM DD, YYYY | hh:mm A")}</span>
        );
      },
    },
    {
      header: "Action",
      accessor: "role",
      render: (item) => (
        <Link
          href={`/vendor/tours-and-activities/detail/${item._id}`}
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
      name="Tours & Activities"
      rightSideComponent={
        <div className="w-full md:w-fit flex-wrap flex justify-start items-center gap-2">
          <Button className="w-full md:w-auto" variant={"main_green_button"}>
            <Link href={`/vendor/tours-and-activities/add`}>
              Add Tour/Activity
            </Link>
            <Plus className="mr-2 h-4 w-4" />
          </Button>
          <SearchComponent
            searchQuery={searchQuery}
            onChangeFunc={setSearchQuery}
          />
        </div>
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-0 md:gap-3 h-fit">
        {/* Filter buttons */}
        <div className="flex justify-start items-start w-full gap-1.5 h-fit flex-wrap md:flex-nowrap capitalize">
          {[
            "all",
            "pending admin approval",
            "active",
            "rejected",
            "upcoming",
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
                } px-2 md:px-4 py-1 md:py-3 leading-tight rounded-[14px] text-xs md:text-[12px] font-medium transition`}
              >
                {filter}
              </div>
            );
          })}
        </div>

        <BoxProviderWithName noBorder={true}>
          {/* Server Pagination Provider wraps the table */}
          <ServerPaginationProvider<BookingWithPopulatedData>
            apiEndpoint="/api/toursAndActivity/getAll" // Your API endpoint
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
