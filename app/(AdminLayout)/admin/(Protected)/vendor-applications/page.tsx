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
import Link from "next/link";
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { Button } from "@/components/ui/button";

export type vendorProps = {
  _id: string;
  email: string;
  businessName: string;
  dateApplied: string;
  contactPerson: string;
  tursabNumber: string;
  createdAt: string;
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
    text="You don’t have any bookings yet."
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
      header: "Business Name",
      accessor: "businessName",
    },
    {
      header: "Date Applied",
      accessor: "dateApplied",
    },
    {
      header: "Contact Person",
      accessor: "contactPerson",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "TÜRSAB Number",
      accessor: "tursabNumber",
    },
    {
      header: "Action",
      accessor: "role",
      render: (item) => (
        <Link
          href={`/vendor/vendor-application/detail/${item._id}`}
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
      name="Vendor Applications"
      rightSideComponent={
        <div className="flex justify-start items-center gap-2">
          <SearchComponent
            searchQuery={searchQuery}
            onChangeFunc={setSearchQuery}
          />
        </div>
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        {/* Filter buttons */}
        <div className="flex justify-start items-start w-full gap-1.5 h-fit flex-wrap md:flex-nowrap">
          {["all", "Upcoming", "Past", "Cancelled"].map((filter) => {
            const isActive =
              (filter === "all" && filters.includes("all")) ||
              filters.includes(filter.toLowerCase());

            const handleClick = () => {
              if (filter === "all") {
                setFilters(["all"]);
              } else {
                setFilters((prev) => {
                  const withoutAll = prev.filter((f) => f !== "all");
                  if (withoutAll.includes(filter.toLowerCase() as any)) {
                    const updated = withoutAll.filter(
                      (f) => f !== filter.toLowerCase()
                    );
                    return updated.length === 0 ? ["all"] : updated;
                  } else {
                    return [...withoutAll, filter.toLowerCase()];
                  }
                });
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
          <ServerPaginationProvider<vendorProps>
            apiEndpoint="/api/admin/vendor-applications" // Your API endpoint
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
