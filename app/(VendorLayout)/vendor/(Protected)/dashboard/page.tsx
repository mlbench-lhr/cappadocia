"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useMemo, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import {
  BookingIcon,
  DollarIcon,
  PaymentIcon2,
  TourIcon,
} from "@/public/allIcons/page";
import { ChartAreaGradient } from "./Graph";
import axios from "axios";
import { UpcomingReservations } from "./UpcomingReservations";
import { RecentCustomerFeedback } from "./RecentCustomerFeedback";
import { Skeleton } from "@/components/ui/skeleton";

export type DashboardCardProps = {
  image: React.ReactNode;
  title: number | string;
  description: string;
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
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
      try {
        setLoading(true);
        let response = await axios.get("/api/vendor/dashboard");
        setData(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
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
            {loading
              ? dashboardCardData.map((item, index) => (
                  <div
                    className="bg-secondary border gap-3 md:gap-0 h-fit md:h-[120px] rounded-2xl py-2 md:py-3 px-4.5 text-primary flex flex-col justify-between items-start line-clamp-1"
                    key={index}
                  >
                    <div className="w-full flex justify-between items-center">
                      <Skeleton className="text-2xl md:text-4xl font-semibold line-clamp-1 text-transparent">
                        {item?.title}
                      </Skeleton>
                      <Skeleton className="flex justify-center items-center w-[30px] md:w-[36px] h-[30px] md:h-[36px] rounded-full bg-primary">
                        {item?.image}
                      </Skeleton>
                    </div>
                    <Skeleton className="text-sm md:text-base font-medium text-transparent">
                      {item?.description}
                    </Skeleton>
                  </div>
                ))
              : dashboardCardData.map((item, index) => (
                  <div
                    className="bg-secondary border gap-3 md:gap-0 h-fit md:h-[120px] rounded-2xl py-2 md:py-3 px-4.5 text-primary flex flex-col justify-between items-start line-clamp-1"
                    key={index}
                  >
                    <div className="w-full flex justify-between items-center">
                      <h1 className="text-2xl md:text-4xl font-semibold line-clamp-1">
                        {item?.title}
                      </h1>
                      <div className="flex justify-center items-center w-[30px] md:w-[36px] h-[30px] md:h-[36px] rounded-full bg-primary">
                        {item?.image}
                      </div>
                    </div>
                    <span className="text-sm md:text-base font-medium">
                      {item?.description}
                    </span>
                  </div>
                ))}
          </div>
          <ChartAreaGradient />
        </div>
        <RecentCustomerFeedback />
      </div>
      <UpcomingReservations />
    </BasicStructureWithName>
  );
}
