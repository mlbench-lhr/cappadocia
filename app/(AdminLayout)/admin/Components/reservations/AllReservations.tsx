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
    | "pending Admin Approval";
  date: Date;
  _id: string;
  price: string;
};

// Loading skeleton component
const BookingsLoadingSkeleton = () => (
  <div className="w-full space-y-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <ReservationsListSkeleton />
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
          <ServerPaginationProvider<BookingWithPopulatedData>
            apiEndpoint="/api/booking/getAll"
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
                              title={item.user.fullName}
                              subTitle={item.user.email}
                              image={item.user.avatar}
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
                                {item.activity.title}
                              </span>
                            </div>
                            <div className="flex flex-col justify-start items-start">
                              <span className="text-xs font-normal text-black/70">
                                Booking ID:
                              </span>
                              <span className="text-xs font-semibold">
                                #{item.bookingId}
                              </span>
                            </div>
                            <div className="flex flex-col justify-start items-start">
                              <span className="text-xs font-normal text-black/70">
                                Reservation Date
                              </span>
                              <span className="text-xs font-semibold">
                                {moment(item.selectDate).format("MMM DD, YYYY")}
                              </span>
                            </div>
                            {/* <div className="flex flex-col justify-start items-start">
                              <span className="text-xs font-normal text-black/70">
                                Activity Date
                              </span>
                              <span className="text-xs font-semibold">
                                26 July, 2025
                              </span>
                            </div> */}
                            <div className="flex flex-col justify-start items-start col-span-2">
                              <span className="text-xs font-normal text-black/70">
                                Pickup Location
                              </span>
                              {item.pickupLocation ? (
                                <span className="text-xs font-semibold">
                                  {item.pickupLocation.address}
                                </span>
                              ) : (
                                <>
                                  <span className="text-xs font-semibold">
                                    Not Added
                                  </span>
                                  <span className="text-xs font-normal text-primary hover:no-underline underline">
                                    Ask for pickup location
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="flex flex-col justify-start items-start">
                              <span className="text-xs font-normal text-black/70">
                                Participants
                              </span>
                              <span className="text-xs font-semibold">
                                {item.adultsCount} Adults, {item.childrenCount}{" "}
                                Children
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 justify-between items-center mt-4 w-full border-t pt-4">
                            <div className="md:xl md:text-[26px] font-semibold text-primary">
                              ${item.paymentDetails.amount}
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
                                <Link
                                  href={
                                    "/admin/reservations/details/" + item._id
                                  }
                                >
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
