"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";
import Link from "next/link";
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { Button } from "@/components/ui/button";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import { BookingWithPopulatedData } from "@/lib/types/booking";
import moment from "moment";
import ReservationsListSkeleton from "@/components/Skeletons/ReservationsListSkeleton";
import { Column, DynamicTable } from "../Table/page";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import { StatusText } from "@/components/SmallComponents/StatusText";
export type DashboardCardProps = {
  image: string;
  title: string;
  description: string;
};

export type bookingProps = {
  bookingId: string;
  title: string;
  tourStatus:
    | "upcoming"
    | "completed"
    | "cancelled"
    | "active"
    | "pending admin approval";
  date: Date;
  _id: string;
  price: string;
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
  <NoDataComponent text="No Reservations Found Yet" />
);

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<string[]>(["all"]);
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
      render: (item) => (
        <>{`Participants: ${item?.adultsCount} Adults, ${item.childrenCount} Children `}</>
      ),
    },
    {
      header: "Status",
      accessor: "paymentStatus",
      render: (item) => (
        <StatusBadge
          status={item.paymentStatus}
          textClasses="text-xs md:text-base font-normal"
          widthClasses="w-fit md:w-[93px]"
        />
      ),
    },
    {
      header: "Booked By",
      accessor: "bookedBy",
      render: (item) => {
        console.log("item-----", item);
        return (
          <div className="w-[180px] md:w-fit">
            <ProfileBadge
              size="small"
              title={item?.user?.fullName || ""}
              subTitle={item?.user?.email}
              image={item?.user?.avatar || "/placeholderDp.png"}
            />
          </div>
        );
      },
    },
    {
      header: "Action",
      accessor: "role",
      render: (item) => (
        <Link
          href={`/admin/reservations/details/${item._id}`}
          className="text-[#B32053] underline"
        >
          View Details
        </Link>
      ),
    },
  ];
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  // Prepare query params for the API
  const queryParams = {
    search: searchQuery,
    filters: filters.includes("all") ? [] : filters,
    // You can add more params like sortBy, sortOrder, etc.
  };

  return (
    <BasicStructureWithName
      name="Reservations"
      rightSideComponent={
        <SearchComponent
          placeholder="Search by booking id..."
          searchQuery={searchQuery}
          onChangeFunc={setSearchQuery}
        />
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-0 md:gap-3 h-fit">
        <BoxProviderWithName noBorder={true}>
          {/* Server Pagination Provider wraps the table */}
          <ServerPaginationProvider<BookingWithPopulatedData>
            apiEndpoint="/api/booking/getAll"
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
