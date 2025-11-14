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

export type DashboardCardProps = {
  image: string;
  amount: string;
  description: string;
};

export type bookingProps = {
  bookingId: string;
  amount: number;
  tourStatus: "Upcoming" | "Completed" | "Cancelled";
  paymentStatus: "Paid" | "Refunded" | "Pending" | "Cancelled";
  date: Date;
  _id: string;
  currency: "€" | "₺" | "$";
};

const bookingData: bookingProps[] = [
  {
    bookingId: "BKG001",
    amount: 20,
    currency: "$",
    tourStatus: "Upcoming",
    paymentStatus: "Paid",
    date: new Date("2025-12-01"),
    _id: "1",
  },
  {
    bookingId: "BKG002",
    amount: 20,
    currency: "$",
    tourStatus: "Completed",
    paymentStatus: "Refunded",
    date: new Date("2025-10-15"),
    _id: "2",
  },
  {
    bookingId: "BKG003",
    amount: 20,
    currency: "$",
    tourStatus: "Cancelled",
    paymentStatus: "Cancelled",
    date: new Date("2025-11-20"),
    _id: "3",
  },
  {
    bookingId: "BKG004",
    amount: 20,
    currency: "$",
    tourStatus: "Upcoming",
    paymentStatus: "Pending",
    date: new Date("2025-12-10"),
    _id: "4",
  },
];
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
  const [bookings, setBookings] = useState<bookingProps[]>(bookingData);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const columns: Column[] = [
    {
      header: "Invoice ID",
      accessor: "bookingId",
      render: (item) => <span>#{item?._id?.replace(/\D/g, "").slice(-5)}</span>,
    },
    {
      header: "Booking ID",
      accessor: "bookingId",
      render: (item) => <span>#{item?._id?.replace(/\D/g, "").slice(-5)}</span>,
    },
    {
      header: "Amount (€/$/₺)",
      accessor: "amount",
      render: (item) => <span>{item.currency + item?.amount}</span>,
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
          <span>{moment(item.date).format("MMM DD, YYYY | hh:mm A")}</span>
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
          searchQuery={searchQuery}
          onChangeFunc={setSearchQuery}
        />
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        <BoxProviderWithName noBorder={true}>
          {/* Server Pagination Provider wraps the table */}
          <ServerPaginationProvider<bookingProps>
            apiEndpoint="/api/bookings" // Your API endpoint
            setState={setBookings} // Optional: if you need bookings in state
            presentData={bookings} // Optional: if you need bookings in state
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
