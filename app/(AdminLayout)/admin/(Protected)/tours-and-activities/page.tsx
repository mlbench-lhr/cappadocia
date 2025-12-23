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
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BookingWithPopulatedData } from "@/lib/types/booking";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";

// Loading skeleton component
const BookingsLoadingSkeleton = () => (
  <div className="w-full space-y-2 animate-pulse">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="h-10 md:h-16 bg-gray-200 rounded-lg" />
    ))}
  </div>
);

// No data component
const NoBookingsFound = () => <NoDataComponent text="No Tours Added Yet" />;

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<string[]>(["all"]);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const columns: Column[] = [
    {
      header: "Tour Title",
      accessor: "title",
      render: (item) => {
        return (
          <div className="w-[350px] md:w-fit">
            <ProfileBadge
              size="medium"
              title={item?.title || ""}
              subTitle={moment(item?.createdAt).format("DD MMM YYYY")}
              image={item?.uploads?.[0] || "/placeholderDp.png"}
            />
          </div>
        );
      },
    },
    {
      header: "Vendor",
      accessor: "vendor",
      render: (item) => {
        return <span>{item?.vendor?.vendorDetails?.contactPersonName}</span>;
      },
    },
    {
      header: "Price",
      accessor: "price",
      render: (item) => {
        return <span>$ {item?.slots?.[0]?.adultPrice}</span>;
      },
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
          href={`/admin/tours-and-activities/detail/${item._id}`}
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
      subHeading={"Total Applications: " + totalItems}
      rightSideComponent={
        <div className="w-full md:w-fit flex justify-start items-center gap-2">
          <SearchComponent
            searchQuery={searchQuery}
            onChangeFunc={setSearchQuery}
          />
        </div>
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-0 md:gap-3 h-fit">
        <BoxProviderWithName noBorder={true} className="p-0!">
          {/* Server Pagination Provider wraps the table */}
          <ServerPaginationProvider<BookingWithPopulatedData>
            apiEndpoint="/api/toursAndActivity/getAll" // Your API endpoint
            queryParams={queryParams}
            LoadingComponent={BookingsLoadingSkeleton}
            NoDataComponent={NoBookingsFound}
            setTotalItems={setTotalItems}
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
