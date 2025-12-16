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
import { InvoicePopulated } from "@/lib/types/invoices";

// Loading skeleton component
const BookingsLoadingSkeleton = () => (
  <div className="w-full space-y-2 md:space-y-4 animate-pulse">
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
      header: "Invoice ID",
      accessor: "invoicesId",
      render: (item) => <span>#{item?.invoicesId}</span>,
    },
    {
      header: "Booking ID",
      accessor: "booking.bookingId",
      render: (item) => <span>#{item?.booking?.bookingId}</span>,
    },
    {
      header: "Amount (€/$/₺)",
      accessor: "booking.paymentDetails.amount",
      render: (item) => (
        <span>
          {item.booking.paymentDetails.currency +
            item.booking.paymentDetails.amount}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "booking.paymentStatus",
      render: (item) => (
        <StatusBadge
          status={item.booking.paymentStatus}
          textClasses="text-xs md:text-base font-normal"
          widthClasses="w-fit md:w-[93px]"
        />
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
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
          href={`/invoices/detail/${item._id}`}
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
      name="Invoices"
      showBackOption
      rightSideComponent={
        <SearchComponent
          placeholder="Search by invoice id..."
          searchQuery={searchQuery}
          onChangeFunc={setSearchQuery}
        />
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-0 md:gap-3 h-fit">
        <BoxProviderWithName noBorder={true}>
          {/* Server Pagination Provider wraps the table */}
          <ServerPaginationProvider<InvoicePopulated>
            apiEndpoint="/api/invoices/getAll" // Your API endpoint
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
