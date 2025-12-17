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
import moment from "moment";

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
      <div key={i} className="h-10 md:h-16 bg-gray-200 rounded-lg" />
    ))}
  </div>
);

// No data component
const NoBookingsFound = () => (
  <NoDataComponent text="No Vendor Applications Added Yet" />
);

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filters, setFilters] = useState<string[]>(["pending"]);

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
      render: (item) => (
        <span>{moment(item.createdAt).format("MMM DD, YYYY")}</span>
      ),
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
          href={`/admin/vendor-applications/detail/${item._id}`}
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
      subHeading={"Total Applications: " + totalItems}
      rightSideComponent={
        <div className="flex justify-start items-center gap-2 w-full md:w-fit">
          <SearchComponent
            searchQuery={searchQuery}
            onChangeFunc={setSearchQuery}
          />
        </div>
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-0 md:gap-3 h-fit">
        <div className="flex items-center gap-2">
          {["pending", "approved", "rejected"].map((filter) => {
            const isActive =
              (filter === "all" && filters.includes("all")) ||
              filters.includes(filter.toLowerCase());

            return (
              <div
                onClick={() => setFilters([filter])}
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
          <ServerPaginationProvider<vendorProps>
            apiEndpoint="/api/admin/vendor-applications" // Your API endpoint
            queryParams={queryParams}
            LoadingComponent={BookingsLoadingSkeleton}
            NoDataComponent={NoBookingsFound}
            itemsPerPage={7}
            setTotalItems={setTotalItems}
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
