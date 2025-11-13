"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";
import {
  ClockIcon,
  HeartIcon,
  PeopleIcon,
  StarIcon,
  VehicleIcon,
} from "@/public/sidebarIcons/page";
import { Column } from "@/app/(AdminLayout)/admin/Components/Table/page";
import moment from "moment";
import Link from "next/link";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import { StatusText } from "@/components/SmallComponents/StatusText";
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";

export type DashboardCardProps = {
  image: string;
  title: string;
  description: string;
};

export type exploreProps = {
  image: string;
  title: string;
  rating: number;
  groupSize: number;
  price: number;
  pickupAvailable: Boolean;
  _id: string;
  vendorDetails: {
    title: string;
    tursabNumber: number;
    image: string;
  };
};

const exploreData: exploreProps[] = [
  {
    image: "/userDashboard/img8.png",
    title: "Sunset ATV Safari Tour",
    rating: 4.5,
    groupSize: 20,
    price: 465,
    pickupAvailable: true,
    _id: "0",
    vendorDetails: {
      image: "/userDashboard/img8.png",
      title: "SkyView Balloon Tours",
      tursabNumber: 12345,
    },
  },
  {
    image: "/userDashboard/img4.png",
    title: "Sunrise Hot Air Balloon Ride",
    rating: 4.5,
    groupSize: 20,
    price: 120,
    pickupAvailable: true,
    _id: "1",
    vendorDetails: {
      image: "/userDashboard/img8.png",
      title: "SkyView Balloon Tours",
      tursabNumber: 12345,
    },
  },
  {
    image: "/userDashboard/img2.png",
    title: "Sunset ATV Safari Tour",
    rating: 3.9,
    groupSize: 20,
    price: 250,
    pickupAvailable: true,
    _id: "2",
    vendorDetails: {
      image: "/userDashboard/img8.png",
      title: "SkyView Balloon Tours",
      tursabNumber: 12345,
    },
  },
  {
    image: "/userDashboard/img9.png",
    title: "Sunrise Hot Air Balloon Ride",
    rating: 4.8,
    groupSize: 20,
    price: 95,
    pickupAvailable: true,
    _id: "3",
    vendorDetails: {
      image: "/userDashboard/img8.png",
      title: "SkyView Balloon Tours",
      tursabNumber: 12345,
    },
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
  const [bookings, setBookings] = useState<exploreProps[]>(exploreData);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const columns: Column[] = [
    {
      header: "Booking ID",
      accessor: "bookingId",
      render: (item) => <span>#{item?._id?.replace(/\D/g, "").slice(-5)}</span>,
    },
    {
      header: "Tour Title",
      accessor: "title",
    },
    {
      header: "Tour Status",
      accessor: "tourStatus",
      render: (item) => <StatusText status={item.tourStatus} />,
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
          href={`/admin/bookings/detail/${item._id}`}
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

  const RightSideActions = () => {
    return (
      <div className="flex justify-start items-center gap-2">
        <SearchComponent
          searchQuery={searchQuery}
          onChangeFunc={setSearchQuery}
        />
        <Button className="" variant={"main_green_button"}>
          <Link href={"/explore"}>Explore More</Link>
        </Button>
      </div>
    );
  };

  return (
    <BasicStructureWithName
      name="My Favorites"
      showBackOption
      rightSideComponent={RightSideActions}
    >
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        {/* Filter buttons */}
        <div className="flex justify-start items-start w-full gap-1.5 h-fit flex-wrap md:flex-nowrap">
          {["all", "Tours", "Activities"].map((filter) => {
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
          <ServerPaginationProvider<exploreProps>
            apiEndpoint="/api/bookings" // Your API endpoint
            setState={setBookings} // Optional: if you need bookings in state
            presentData={bookings} // Optional: if you need bookings in state
            queryParams={queryParams}
            LoadingComponent={BookingsLoadingSkeleton}
            NoDataComponent={NoBookingsFound}
            itemsPerPage={7}
          >
            {(data, isLoading, refetch) => (
              <div className="w-full space-y-3 grid grid-cols-12 gap-3">
                {data.map((item) => (
                  <div className="space-y-3 col-span-12 md:col-span-6 lg:col-span-3">
                    <BoxProviderWithName
                      key={item._id}
                      noBorder={true}
                      className="border md:border !px-3.5"
                    >
                      <div className="flex justify-start items-start flex-col rounded-t-xl overflow-hidden relative">
                        <Image
                          alt=""
                          src={item.image}
                          width={120}
                          height={120}
                          className="w-full h-[120px] object-cover object-center"
                        />
                        <div className="bg-white h-[26px] w-[26px] rounded-[6px] absolute top-3 right-3 flex justify-center items-center">
                          <HeartIcon color="#B32053" />
                        </div>
                        <div className="w-full h-[25px] flex text-white bg-primary justify-between items-center mb-2 px-1.5">
                          <div className="flex justify-start items-center gap-1">
                            <ClockIcon color="white" />
                            <span className="text-[10px] font-[400]">
                              5 Days
                            </span>
                          </div>
                          <div className="flex justify-start items-center gap-1">
                            <PeopleIcon color="white" />
                            <span className="text-[10px] font-[400]">
                              {item.groupSize} People
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1 w-full text-[rgba(34,30,31,0.50)] text-xs font-normal leading-tight">
                          <ProfileBadge
                            title="SkyView Balloon Tours"
                            subTitle={
                              "TÜRSAB Number: " +
                              item.vendorDetails.tursabNumber
                            }
                            image="/userDashboard/img2.png"
                          />
                          <Link
                            href={`/explore/detail/${item._id}`}
                            className="text-base font-semibold text-black line-clamp-1 hover:underline"
                          >
                            {item.title}
                          </Link>
                          <div className="flex justify-start items-center gap-1">
                            <span className="font-semibold">Group Size: </span>
                            <span className="">
                              Up to {item.groupSize} people
                            </span>
                          </div>
                          <div className="flex justify-start items-center gap-1">
                            <VehicleIcon color="rgba(0, 0, 0, 0.7)" />
                            <span className="">
                              Pickup:
                              {item.pickupAvailable
                                ? " Available"
                                : " Not Available"}{" "}
                            </span>
                          </div>
                          <div className="flex justify-start items-center gap-1">
                            <span className="text-base font-medium text-black">
                              ${item.price}
                            </span>
                            <span className="">/Person</span>
                          </div>

                          <div className="w-full flex justify-between items-center -mt-1">
                            <div className="flex justify-start items-center gap-2">
                              <div className="flex justify-start items-center gap-1">
                                <StarIcon />
                                <span className="">{item.rating}</span>
                              </div>
                            </div>
                            <Button
                              variant={"green_secondary_button"}
                              className="w-[92px] flex font-[500]"
                              style={{ height: "26px", fontSize: "10px" }}
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </BoxProviderWithName>
                  </div>
                ))}
              </div>
            )}
          </ServerPaginationProvider>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
