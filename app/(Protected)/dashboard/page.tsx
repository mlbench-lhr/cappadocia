"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import moment from "moment";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import Link from "next/link";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import {
  BookingIcon,
  ClockIcon,
  PeopleIcon,
  StarIcon,
  VehicleIcon,
} from "@/public/sidebarIcons/page";

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
  status: "Paid" | "Pending";
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
    description: "Upcoming Trips",
  },
  {
    image: "/Icons/db3.png",
    title: "$1,250",
    description: "Payments Done",
  },
  {
    image: "/Icons/db4.png",
    title: "$150",
    description: "Pending Payments",
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
    status: "Paid",
    _id: "1",
  },
  {
    image: "/userDashboard/img4.png",
    title: "Cappadocia Hot Air Balloon Ride",
    date: new Date("2024-05-15T11:00:00"),
    adultCount: 3,
    childCount: 0,
    bookingId: "TRX-47012",
    status: "Paid",
    _id: "2",
  },
  {
    image: "/userDashboard/img5.png",
    title: "Sunset ATV Safari Tour",
    date: new Date("2024-05-15T11:00:00"),
    adultCount: 1,
    childCount: 0,
    bookingId: "TRX-47012",
    status: "Pending",
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
      <div className="grid grid-cols-16 w-full border px-4 py-5.5 rounded-[12px] gap-3 h-fit">
        <div className="col-span-16 xl:col-span-9 bg-red-40 h-fit flex flex-col justify-start items-start gap-4">
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
                <Link href={"/bookings/book"}>Book now</Link>
              </Button>
            </div>
          </div>
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
          <div className="h-[360px] flex flex-col justify-center items-start gap-4 relative w-full p-7 overflow-hidden rounded-2xl">
            <Image
              alt=""
              src={"/userDashboard/img2.png"}
              width={0}
              height={360}
              className="w-full h-[360px] absolute top-0 left-0 object-cover object-center"
            />
          </div>
        </div>
        <div className="col-span-16 xl:col-span-7 space-y-2">
          <BoxProviderWithName name="Upcoming Reservations">
            <div className="w-full space-y-3">
              {upComingReservationsData.map((item, index) => (
                <BoxProviderWithName
                  key={index}
                  noBorder={true}
                  className="!border !px-3.5"
                >
                  <div className="flex justify-start items-center gap-2 flex-col md:flex-row">
                    <Image
                      alt=""
                      src={item.image}
                      width={120}
                      height={120}
                      className="w-full md:w-[120px] h-auto md:h-[120px] object-cover object-center"
                    />
                    <div className="space-y-1 w-full md:w-[calc(100%-128px)] text-[rgba(34,30,31,0.50)] text-xs font-normal leading-0">
                      <h1 className="text-base font-semibold text-black leading-tight line-clamp-1">
                        {item.title}
                      </h1>
                      <div className="flex justify-start items-center gap-1">
                        <ClockIcon color="rgba(0, 0, 0, 0.5)" />
                        <span className="">
                          {moment(item.date).format("MMM DD, YYYY | hh:mm A")}
                        </span>
                      </div>
                      <div className="flex justify-start items-center gap-1">
                        <PeopleIcon color="rgba(0, 0, 0, 0.5)" />
                        <span className="">
                          Participants:{" "}
                          {item.adultCount && (
                            <>
                              {item.adultCount}{" "}
                              {item.adultCount > 1 ? "Adults" : "Adult"}
                            </>
                          )}
                          {item.adultCount && item.childCount && ", "}
                          {item.childCount && (
                            <>
                              {item.childCount}{" "}
                              {item.childCount > 1 ? "Children" : "Child"}
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-start items-center gap-1">
                        <BookingIcon color="rgba(0, 0, 0, 0.5)" size="15" />
                        <span className="">Booking ID: #{item.bookingId} </span>
                      </div>
                      <div className="w-full flex justify-between items-center mt-2">
                        <StatusBadge status={item.status} />
                        <Link
                          href={`/explore/detail/${item._id}`}
                          className="text-primary underline hover:no-underline text-xs font-normal"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </BoxProviderWithName>
              ))}
            </div>
          </BoxProviderWithName>
          <BoxProviderWithName
            name="Explore Cappadocia"
            rightSideLink="/explore"
            rightSideLabel="See All"
          >
            <div className="w-full space-y-3">
              {exploreData.map((item, index) => (
                <BoxProviderWithName
                  key={index}
                  noBorder={true}
                  className="!border !px-3.5"
                >
                  <div className="flex justify-start items-center gap-2 flex-col md:flex-row">
                    <Image
                      alt=""
                      src={item.image}
                      width={120}
                      height={120}
                      className="w-full md:w-[120px] h-auto md:h-[120px] object-cover object-center"
                    />
                    <div className="space-y-1 w-full md:w-[calc(100%-128px)] text-[rgba(34,30,31,0.50)] text-xs font-normal leading-tight">
                      <ProfileBadge
                        title="SkyView Balloon Tours"
                        subTitle={
                          "TÜRSAB Number: " + item.vendorDetails.tursabNumber
                        }
                        image="/userDashboard/img2.png"
                      />
                      <span className="text-base font-semibold text-black line-clamp-1">
                        {item.title}
                      </span>
                      <div className="flex justify-start items-center gap-1">
                        <span className="font-semibold">Group Size: </span>
                        <span className="">Up to {item.groupSize} people</span>
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

                      <div className="w-full flex justify-between items-center">
                        <div className="flex justify-start items-center gap-2">
                          <div className="flex justify-start items-center gap-1">
                            <span className="text-base font-medium text-black">
                              ${item.price}
                            </span>
                            <span className="">/Person</span>
                          </div>
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
                          <Link href={"/bookings/book"}>Book now</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </BoxProviderWithName>
              ))}
            </div>
          </BoxProviderWithName>
        </div>
      </div>
    </BasicStructureWithName>
  );
}
