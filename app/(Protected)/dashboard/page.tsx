"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useMemo, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookingIcon,
  DollarIcon,
  PaymentIcon2,
  TourIcon,
} from "@/public/allIcons/page";
import ImageSlider from "./ImageSlider";
import { ExploreCappadocia } from "./ExploreCappadocia";
import { UpcomingReservations } from "./UpcomingReservations";

import axios from "axios";
import { DashboardCardProps } from "@/app/(VendorLayout)/vendor/(Protected)/dashboard/page";

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
  const [discount, setDiscount] = useState<{
    percentage: number;
    text: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  useEffect(() => {
    const getData = async () => {
      let response = await axios.get("/api/dashboard");
      setData(response.data);
    };
    getData();
  }, []);

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const res = await axios.get("/api/discount");
        const d = res.data?.data;
        if (d) setDiscount(d);
      } catch (e) {}
    };
    fetchDiscount();
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
        description: "Upcoming Trips",
      },
      {
        image: <DollarIcon color="white" />,
        title: data.paymentsDone,
        description: "Payments Done",
      },
      {
        image: <PaymentIcon2 color="white" />,
        title: data.pendingPayments,
        description: "Pending Payments",
      },
    ];
  }, [data.totalBookings, vendorData?.vendorDetails?.paymentInfo?.currency]);

  return (
    <BasicStructureWithName name="Dashboard">
      <div className="grid grid-cols-16 w-full border px-4 py-5.5 rounded-[12px] gap-3 h-fit">
        <div className="col-span-16 h-fit xl:h-full flex-1 xl:col-span-9 flex flex-col justify-start xl:justify-between items-start gap-4">
          {(() => {
            const active = (() => {
              if (!discount) return false;
              const now = new Date();
              const s = new Date(discount.startDate);
              const e = new Date(discount.endDate);
              return (
                Number.isFinite(s.getTime()) &&
                Number.isFinite(e.getTime()) &&
                s <= now &&
                now <= e
              );
            })();
            const fmt = (d: Date) =>
              d.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              });
            const s = discount ? new Date(discount.startDate) : null;
            const e = discount ? new Date(discount.endDate) : null;
            if (active && discount && s && e) {
              return (
                <div className="h-[225px] flex flex-col justify-center items-start gap-4 relative w-full p-7 overflow-hidden rounded-2xl">
                  <Image
                    alt=""
                    src={discount.image || "/userDashboard/img.png"}
                    width={0}
                    height={225}
                    className="w-full h-[225px] absolute top-0 left-0 object-cover object-center"
                  />
                  <div className="h-fit flex flex-col justify-center items-start gap-1 relative w-full text-white">
                    <h1 className="text-4xl font-semibold">
                      {discount.percentage}% Off
                    </h1>
                    <h2 className="text-base font-semibold text-white/80">
                      {discount.text}
                    </h2>
                    <h3 className="text-sm font-semibold text-white/80 mt-0.5">
                      {fmt(s)} - {fmt(e)}
                    </h3>
                    <Button className="h-[32px] w-[110px] flex justify-center mt-3.5 items-center text-base font-medium bg-white text-primary hover:bg-white">
                      <Link href={"/explore"}>Book now</Link>
                    </Button>
                  </div>
                </div>
              );
            }
            return (
              <div className="h-[225px] flex flex-col justify-center items-start gap-4 relative w-full p-7 overflow-hidden rounded-2xl">
                <Image
                  alt=""
                  src={"/userDashboard/img.png"}
                  width={0}
                  height={225}
                  className="w-full h-[225px] absolute top-0 left-0 object-cover object-center"
                />
                <div className="h-fit flex flex-col justify-center items-start gap-1 relative w-full text-white">
                  <h1 className="text-4xl font-semibold">10% Off</h1>
                  <h2 className="text-base font-semibold text-white/80">
                    Get 10% off Cappadocia Hot Air Balloon Rides this weekend!
                  </h2>
                  <h3 className="text-sm font-semibold text-white/80 mt-0.5">
                    Apr 10 - Apr 14
                  </h3>
                  <Button className="h-[32px] w-[110px] flex justify-center mt-3.5 items-center text-base font-medium bg-white text-primary hover:bg-white">
                    <Link href={"/explore"}>Book now</Link>
                  </Button>
                </div>
              </div>
            );
          })()}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardCardData.map((item, index) => (
              <div
                className="bg-secondary border h-[120px] rounded-2xl py-3 px-4.5 text-primary flex flex-col justify-between items-start line-clamp-1"
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
          <ImageSlider />
        </div>
        <div className="col-span-16 xl:col-span-7 space-y-2">
          <UpcomingReservations />
          <ExploreCappadocia />
        </div>
      </div>
    </BasicStructureWithName>
  );
}
