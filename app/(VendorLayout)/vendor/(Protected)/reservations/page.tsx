"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";
import { Column } from "@/app/(AdminLayout)/admin/Components/Table/page";
import moment from "moment";
import Link from "next/link";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { Button } from "@/components/ui/button";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
export type DashboardCardProps = {
  image: string;
  title: string;
  description: string;
};

export type bookingProps = {
  bookingId: string;
  title: string;
  tourStatus:
    | "Upcoming"
    | "Completed"
    | "Cancelled"
    | "Active"
    | "Pending Admin Approval";
  date: Date;
  _id: string;
  price: string;
};

const bookingData: bookingProps[] = [
  {
    bookingId: "BKG001",
    title: "City Tour",
    tourStatus: "Active",
    date: new Date("2025-12-01"),
    _id: "1",
    price: "€250",
  },
  {
    bookingId: "BKG002",
    title: "Mountain Hike",
    tourStatus: "Pending Admin Approval",
    date: new Date("2025-10-15"),
    _id: "2",
    price: "€250",
  },
  {
    bookingId: "BKG003",
    title: "Beach Trip",
    tourStatus: "Cancelled",
    date: new Date("2025-11-20"),
    _id: "3",
    price: "€250",
  },
  {
    bookingId: "BKG004",
    title: "Museum Visit",
    tourStatus: "Pending Admin Approval",
    date: new Date("2025-12-10"),
    _id: "4",
    price: "€250",
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
              <>
                {data.map((item) => (
                  <div className="w-full space-y-2">
                    <BoxProviderWithName>
                      <div className="w-full">
                        <BoxProviderWithName
                          leftSideComponent={
                            <ProfileBadge
                              title="John D."
                              subTitle="Apr 10, 2024"
                              image="/userDashboard/cimg.png"
                              size="medium"
                            />
                          }
                          noBorder={true}
                          className="!p-0"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-2 gap-y-2 items-center">
                            <div className="flex flex-col justify-start items-start">
                              <span className="text-xs font-normal text-black/70">
                                Tour Title
                              </span>
                              <span className="text-xs font-semibold">
                                Sunset ATV Safari Tour
                              </span>
                            </div>
                            <div className="flex flex-col justify-start items-start">
                              <span className="text-xs font-normal text-black/70">
                                Booking ID:
                              </span>
                              <span className="text-xs font-semibold">
                                #CT-98213{" "}
                              </span>
                            </div>
                            <div className="flex flex-col justify-start items-start">
                              <span className="text-xs font-normal text-black/70">
                                Reservation Date
                              </span>
                              <span className="text-xs font-semibold">
                                26 July, 2025
                              </span>
                            </div>
                            <div className="flex flex-col justify-start items-start">
                              <span className="text-xs font-normal text-black/70">
                                Activity Date
                              </span>
                              <span className="text-xs font-semibold">
                                26 July, 2025
                              </span>
                            </div>
                            <div className="flex flex-col justify-start items-start">
                              <span className="text-xs font-normal text-black/70">
                                Pickup Location
                              </span>
                              <span className="text-xs font-semibold">
                                Not Added
                              </span>
                              <span className="text-xs font-normal text-primary hover:no-underline underline">
                                Ask for pickup location
                              </span>
                            </div>
                            <div className="flex flex-col justify-start items-start">
                              <span className="text-xs font-normal text-black/70">
                                Participants
                              </span>
                              <span className="text-xs font-semibold">
                                1 Child, 2 Adults
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 justify-between items-center mt-4 w-full border-t pt-4">
                            <div className="md:xl md:text-[26px] font-semibold text-primary">
                              $569.00
                            </div>
                            <div className="flex gap-2 justify-start items-start">
                              <Button
                                size={"lg"}
                                variant={"green_secondary_button"}
                              >
                                Contact Traveler
                              </Button>
                              <Button
                                size={"lg"}
                                variant={"green_secondary_button"}
                              >
                                <Link href={"/vendor/reservations/detail/1"}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </BoxProviderWithName>
                      </div>
                    </BoxProviderWithName>
                  </div>
                ))}
              </>
            )}
          </ServerPaginationProvider>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
