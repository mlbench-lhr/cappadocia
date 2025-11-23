"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import { StarIcon } from "@/public/allIcons/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ChartAreaGradient } from "./Graph";

export type DashboardCardProps = {
  image: string;
  title: string;
  description: string;
};

export type UpComingReservationsProps = {
  image: string;
  title: string;
  date: Date;
  adultCount: number;
  childCount: number;
  bookingId: string;
  status: "paid" | "pending";
  _id: string;
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

const dashboardCardData: DashboardCardProps[] = [
  {
    image: "/Icons/db1.png",
    title: "5",
    description: "Total Bookings",
  },
  {
    image: "/Icons/db2.png",
    title: "4",
    description: "upcoming Trips",
  },
  {
    image: "/Icons/db3.png",
    title: "$1,250",
    description: "Payments Done",
  },
  {
    image: "/Icons/db4.png",
    title: "$150",
    description: "pending Payments",
  },
];

const upComingReservationsData: UpComingReservationsProps[] = [
  {
    image: "/userDashboard/img3.png",
    title: "Private Cappadocia Photography Tour",
    date: new Date("2024-05-15T11:00:00"),
    adultCount: 3,
    childCount: 3,
    bookingId: "TRX-47012",
    status: "paid",
    _id: "1",
  },
  {
    image: "/userDashboard/img4.png",
    title: "Cappadocia Hot Air Balloon Ride",
    date: new Date("2024-05-15T11:00:00"),
    adultCount: 3,
    childCount: 0,
    bookingId: "TRX-47012",
    status: "paid",
    _id: "2",
  },
  {
    image: "/userDashboard/img5.png",
    title: "Sunset ATV Safari Tour",
    date: new Date("2024-05-15T11:00:00"),
    adultCount: 1,
    childCount: 0,
    bookingId: "TRX-47012",
    status: "pending",
    _id: "3",
  },
  {
    image: "/userDashboard/img5.png",
    title: "Sunset ATV Safari Tour",
    date: new Date("2024-05-15T11:00:00"),
    adultCount: 1,
    childCount: 0,
    bookingId: "TRX-47012",
    status: "pending",
    _id: "3",
  },
  {
    image: "/userDashboard/img5.png",
    title: "Sunset ATV Safari Tour",
    date: new Date("2024-05-15T11:00:00"),
    adultCount: 1,
    childCount: 0,
    bookingId: "TRX-47012",
    status: "pending",
    _id: "3",
  },
];

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
    image: "/userDashboard/img9.png",
    title: "Sunrise Hot Air Balloon Ride",
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
];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  return (
    <BasicStructureWithName name="Dashboard">
      <div className="grid grid-cols-16 w-full gap-4 h-fit">
        <div className="col-span-16 xl:col-span-9 bg-red-40 h-full flex flex-col justify-start items-start gap-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardCardData.map((item, index) => (
              <div
                className="bg-secondary border h-[110px] rounded-2xl py-3 px-4.5 text-primary flex flex-col justify-between items-start line-clamp-1"
                key={index}
              >
                <div className="w-full flex justify-between items-center">
                  <h1 className="text-4xl font-semibold line-clamp-1">
                    {item.title}
                  </h1>
                  <div className="flex justify-center items-center w-[36px] h-[36px] rounded-full bg-primary">
                    <Image alt="" src={item.image} width={20} height={20} />
                  </div>
                </div>
                <span className="text-base font-medium">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
          <BoxProviderWithName
            className="flex-1"
            name="Total Revenue"
            rightSideComponent={
              <div className="flex justify-start items-center gap-2">
                <span className="text-[20px] font-medium">$120k</span>
                <span className="text-[13px] font-medium bg-primary rounded-[45px] w-[55px] h-[25px] text-white flex justify-center items-center">
                  +10%
                </span>
              </div>
            }
            hFull={true}
          >
            <div className="h-full flex flex-col justify-center items-start gap-4 relative w-full overflow-hidden">
              <ChartAreaGradient />
            </div>
          </BoxProviderWithName>
        </div>
        <div className="col-span-16 xl:col-span-7 space-y-2">
          <BoxProviderWithName
            name="Recent Customer Feedback"
            className="!px-0 !pb-0"
            noBorder={true}
          >
            <div className="w-full space-y-3">
              {upComingReservationsData.map((item, index) => (
                <BoxProviderWithName
                  leftSideComponent={
                    <ProfileBadge
                      title="John D."
                      subTitle="Apr 10, 2024"
                      image="/userDashboard/cimg.png"
                      size="medium"
                    />
                  }
                  rightSideComponent={
                    <div className="w-fit flex justify-start items-center gap-1">
                      <StarIcon />
                      <span className="text-[12px] font-medium text-black/60">
                        5
                      </span>
                    </div>
                  }
                  key={index}
                  noBorder={true}
                  className="!border !px-3.5"
                >
                  <span className="text-sm font-normal leading-tight text-black/70">
                    Absolutely breathtaking! The sunrise over the valleys was
                    magical. Highly recommend!
                  </span>
                </BoxProviderWithName>
              ))}
            </div>
          </BoxProviderWithName>
        </div>
      </div>
      <div className="grid grid-cols-16 w-full mt-4 h-fit">
        <div className="col-span-16 space-y-2">
          <BoxProviderWithName
            leftSideComponent={
              <div className="flex justify-start items-center gap-2">
                <span className="text-base font-semibold">Reservations</span>
                <Select>
                  <SelectTrigger className="w-full" style={{ height: "30px" }}>
                    Today
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {["Today", "This Week", "This Month"]?.map((item) => (
                      <SelectItem key={item} value={item as string}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            }
          >
            <div className="w-full space-y-3">
              <BoxProviderWithName
                leftSideComponent={
                  <ProfileBadge
                    title="John D."
                    subTitle="Apr 10, 2024"
                    image="/userDashboard/cimg.png"
                    size="medium"
                  />
                }
                rightSideComponent={
                  <div className="md:xl md:text-[26px] font-semibold text-primary">
                    $569.00
                  </div>
                }
                noBorder={true}
                className="!px-0"
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
                    <span className="text-xs font-semibold">#CT-98213 </span>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <span className="text-xs font-normal text-black/70">
                      Reservation Date
                    </span>
                    <span className="text-xs font-semibold">26 July, 2025</span>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <span className="text-xs font-normal text-black/70">
                      Activity Date
                    </span>
                    <span className="text-xs font-semibold">26 July, 2025</span>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <span className="text-xs font-normal text-black/70">
                      Pickup Location
                    </span>
                    <span className="text-xs font-semibold">Not Added</span>
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
                  <div className="flex flex-col justify-start items-start mt-4">
                    <Button size={"lg"} variant={"green_secondary_button"}>
                      View All Reservations
                    </Button>
                  </div>
                </div>
              </BoxProviderWithName>
            </div>
          </BoxProviderWithName>
        </div>
      </div>
    </BasicStructureWithName>
  );
}
