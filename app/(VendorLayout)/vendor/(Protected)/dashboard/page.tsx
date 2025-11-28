"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useMemo, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import {
  BookingIcon,
  DollarIcon,
  PaymentIcon2,
  StarIcon,
  TourIcon,
} from "@/public/allIcons/page";
import { ChartAreaGradient } from "./Graph";
import Link from "next/link";
import axios from "axios";
import { UpcomingReservations } from "./UpcomingReservations";

export type DashboardCardProps = {
  image: React.ReactNode;
  title: number | string;
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

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const vendorData = useAppSelector((s) => s.auth.user);
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [data, setData] = useState({
    totalBookings: 0,
    upcomingTrips: 0,
    paymentsDone: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  useEffect(() => {
    const getData = async () => {
      let response = await axios.get("/api/vendor/dashboard");
      setData(response.data);
    };
    getData();
  }, []);

  const dashboardCardData: DashboardCardProps[] = useMemo(() => {
    return [
      {
        image: <BookingIcon color="white" />,
        title: data.totalBookings,
        description: "Total Bookings",
      },
      {
        image: <TourIcon color="white" />,
        title: data.upcomingTrips,
        description: "upcoming Trips",
      },
      {
        image: <DollarIcon color="white" />,
        title: data.paymentsDone,
        description: "Payments Done",
      },
      {
        image: <PaymentIcon2 color="white" />,
        title: data.pendingPayments,
        description: "pending Payments",
      },
    ];
  }, [data.totalBookings, vendorData?.vendorDetails?.paymentInfo?.currency]);

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
                    {item.image}
                  </div>
                </div>
                <span className="text-sm md:text-base font-medium">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
          <ChartAreaGradient />
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
                  <Link
                    href={`/admin/tours-and-activities/detail/${"69204f6ba4bb81f02d007a64"}`}
                    className="text-xs font-semibold -mt-2 text-black hover:underline"
                  >
                    Hot Air Balloon
                  </Link>
                  <div className="text-xs font-normal leading-tight text-black/70">
                    Absolutely breathtaking! The sunrise over the valleys was
                    magical. Highly recommend!
                  </div>
                </BoxProviderWithName>
              ))}
            </div>
          </BoxProviderWithName>
        </div>
      </div>
      <UpcomingReservations />
    </BasicStructureWithName>
  );
}
