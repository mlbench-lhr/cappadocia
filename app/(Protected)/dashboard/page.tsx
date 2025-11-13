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
                Book Now
              </Button>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardCardData.map((item) => (
              <div
                className="bg-secondary border h-[110px] rounded-2xl py-3 px-4.5 text-primary flex flex-col justify-between items-start"
                key={item.title}
              >
                <div className="w-full flex justify-between items-center">
                  <h1 className="text-4xl font-semibold">{item.title}</h1>
                  <div className="flex justify-center items-center w-[36px] h-[36px] rounded-full bg-primary">
                    <Image alt="" src={item.image} width={24} height={24} />
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
              {upComingReservationsData.map((item) => (
                <BoxProviderWithName
                  key={item._id}
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
                    <div className="space-y-2 w-full md:w-[calc(100%-128px)] text-[rgba(34,30,31,0.50)] text-xs font-normal leading-0">
                      <h1 className="text-base font-semibold text-black leading-normal">
                        {item.title}
                      </h1>
                      <div className="flex justify-start items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M8.00001 1.33325C11.682 1.33325 14.6667 4.31792 14.6667 7.99992C14.6667 11.6819 11.682 14.6666 8.00001 14.6666C4.31801 14.6666 1.33334 11.6819 1.33334 7.99992C1.33334 4.31792 4.31801 1.33325 8.00001 1.33325ZM8.00001 3.99992C7.8232 3.99992 7.65363 4.07016 7.52861 4.19518C7.40358 4.32021 7.33334 4.48977 7.33334 4.66659V7.99992C7.33338 8.17672 7.40364 8.34626 7.52868 8.47125L9.52868 10.4713C9.65441 10.5927 9.82281 10.6599 9.99761 10.6584C10.1724 10.6568 10.3396 10.5867 10.4632 10.4631C10.5868 10.3395 10.6569 10.1723 10.6585 9.99752C10.66 9.82272 10.5928 9.65432 10.4713 9.52859L8.66668 7.72392V4.66659C8.66668 4.48977 8.59644 4.32021 8.47142 4.19518C8.34639 4.07016 8.17682 3.99992 8.00001 3.99992Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                        </svg>
                        <span className="">
                          {moment(item.date).format("MMM DD, YYYY | hh:mm AA")}
                        </span>
                      </div>
                      <div className="flex justify-start items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M5.33334 2.66659C4.6261 2.66659 3.94782 2.94755 3.44773 3.44764C2.94763 3.94774 2.66668 4.62602 2.66668 5.33326C2.66668 6.0405 2.94763 6.71878 3.44773 7.21888C3.94782 7.71898 4.6261 7.99993 5.33334 7.99993C6.04059 7.99993 6.71886 7.71898 7.21896 7.21888C7.71906 6.71878 8.00001 6.0405 8.00001 5.33326C8.00001 4.62602 7.71906 3.94774 7.21896 3.44764C6.71886 2.94755 6.04059 2.66659 5.33334 2.66659ZM4.00001 8.66659C3.29277 8.66659 2.61449 8.94755 2.11439 9.44764C1.6143 9.94774 1.33334 10.626 1.33334 11.3333V11.9999C1.33334 12.3535 1.47382 12.6927 1.72387 12.9427C1.97392 13.1928 2.31305 13.3333 2.66668 13.3333H8.00001C8.35363 13.3333 8.69277 13.1928 8.94282 12.9427C9.19287 12.6927 9.33334 12.3535 9.33334 11.9999V11.3333C9.33334 10.626 9.05239 9.94774 8.55229 9.44764C8.0522 8.94755 7.37392 8.66659 6.66668 8.66659H4.00001ZM8.83334 7.26993C9.15201 6.69659 9.33334 6.03659 9.33334 5.33326C9.33349 4.65555 9.16144 3.98892 8.83334 3.39593C9.21189 3.03775 9.68709 2.79834 10.2002 2.70728C10.7133 2.61623 11.2419 2.67752 11.7206 2.88358C12.1992 3.08965 12.607 3.43146 12.8936 3.86676C13.1801 4.30206 13.3328 4.81179 13.3328 5.33293C13.3328 5.85407 13.1801 6.36379 12.8936 6.79909C12.607 7.2344 12.1992 7.57621 11.7206 7.78227C11.2419 7.98834 10.7133 8.04963 10.2002 7.95857C9.68709 7.86752 9.21189 7.62811 8.83334 7.26993ZM10.3107 13.3333C10.5373 12.9413 10.6673 12.4859 10.6673 11.9999V11.3333C10.6686 10.3491 10.3057 9.39928 9.64868 8.66659H12C12.7073 8.66659 13.3855 8.94755 13.8856 9.44764C14.3857 9.94774 14.6667 10.626 14.6667 11.3333V11.9999C14.6667 12.3535 14.5262 12.6927 14.2762 12.9427C14.0261 13.1928 13.687 13.3333 13.3333 13.3333H10.3107Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                        </svg>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3.33333 14C2.96667 14 2.65289 13.8696 2.392 13.6087C2.13111 13.3478 2.00044 13.0338 2 12.6667V4.35C2 4.19445 2.02511 4.04445 2.07533 3.9C2.12556 3.75556 2.20044 3.62223 2.3 3.5L3.13333 2.48334C3.25556 2.32778 3.40822 2.20823 3.59133 2.12467C3.77444 2.04111 3.96622 1.99956 4.16667 2H11.8333C12.0333 2 12.2251 2.04178 12.4087 2.12534C12.5922 2.20889 12.7449 2.32823 12.8667 2.48334L13.7 3.5C13.8 3.62223 13.8751 3.75556 13.9253 3.9C13.9756 4.04445 14.0004 4.19445 14 4.35V12.6667C14 13.0333 13.8696 13.3473 13.6087 13.6087C13.3478 13.87 13.0338 14.0004 12.6667 14H3.33333ZM3.6 4H12.4L11.8333 3.33334H4.16667L3.6 4ZM10.6667 5.33334H5.33333V9.58334C5.33333 9.83889 5.43889 10.0307 5.65 10.1587C5.86111 10.2867 6.07778 10.2949 6.3 10.1833L8 9.33334L9.7 10.1833C9.92222 10.2944 10.1389 10.286 10.35 10.158C10.5611 10.03 10.6667 9.83845 10.6667 9.58334V5.33334Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                        </svg>{" "}
                        <span className="">Booking ID: #{item.bookingId} </span>
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <StatusBadge status={item.status} />
                        <Link
                          href={item._id}
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
              {exploreData.map((item) => (
                <BoxProviderWithName
                  key={item._id}
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
                      <span className="text-base font-semibold text-black">
                        {item.title}
                      </span>
                      <div className="flex justify-start items-center gap-1">
                        <span className="font-semibold">Group Size: </span>
                        <span className="">Up to {item.groupSize} people</span>
                      </div>
                      <div className="flex justify-start items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                        >
                          <path
                            d="M8 2.24534e-10C8.17257 -4.47566e-06 8.33842 0.0669083 8.46267 0.186667L8.52067 0.25L10.9867 3.33333H11.3333C11.8435 3.33331 12.3343 3.52822 12.7055 3.87819C13.0767 4.22816 13.3001 4.70674 13.33 5.216L13.3333 5.33333V8C13.3333 8.17681 13.2631 8.34638 13.1381 8.47141C13.013 8.59643 12.8435 8.66667 12.6667 8.66667H11.886C11.748 9.05656 11.4925 9.3941 11.1548 9.63283C10.817 9.87156 10.4136 9.99975 10 9.99975C9.5864 9.99975 9.18296 9.87156 8.84522 9.63283C8.50747 9.3941 8.25201 9.05656 8.114 8.66667H5.21933C5.08132 9.05656 4.82586 9.3941 4.48812 9.63283C4.15037 9.87156 3.74693 9.99975 3.33333 9.99975C2.91973 9.99975 2.5163 9.87156 2.17855 9.63283C1.8408 9.3941 1.58534 9.05656 1.44733 8.66667H0.666667C0.489856 8.66667 0.320286 8.59643 0.195262 8.47141C0.0702379 8.34638 0 8.17681 0 8V4L0.00466665 3.922L0.0100001 3.88467L0.0213334 3.83267L0.0293333 3.80867L0.0386667 3.77533L1.38133 0.419333C1.43076 0.295626 1.51611 0.189561 1.62638 0.114819C1.73665 0.0400766 1.86678 8.43181e-05 2 2.24534e-10H8ZM3.33333 7.33333C3.15652 7.33333 2.98695 7.40357 2.86193 7.52859C2.7369 7.65362 2.66667 7.82319 2.66667 8C2.66667 8.17681 2.7369 8.34638 2.86193 8.47141C2.98695 8.59643 3.15652 8.66667 3.33333 8.66667C3.51014 8.66667 3.67971 8.59643 3.80474 8.47141C3.92976 8.34638 4 8.17681 4 8C4 7.82319 3.92976 7.65362 3.80474 7.52859C3.67971 7.40357 3.51014 7.33333 3.33333 7.33333ZM10 7.33333C9.82319 7.33333 9.65362 7.40357 9.52859 7.52859C9.40357 7.65362 9.33333 7.82319 9.33333 8C9.33333 8.17681 9.40357 8.34638 9.52859 8.47141C9.65362 8.59643 9.82319 8.66667 10 8.66667C10.1768 8.66667 10.3464 8.59643 10.4714 8.47141C10.5964 8.34638 10.6667 8.17681 10.6667 8C10.6667 7.82319 10.5964 7.65362 10.4714 7.52859C10.3464 7.40357 10.1768 7.33333 10 7.33333ZM6 1.33333H2.45067L1.65067 3.33333H6V1.33333ZM7.68 1.33333H7.33333V3.33333H9.28L7.68 1.33333Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                        </svg>
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="13"
                              height="13"
                              viewBox="0 0 13 13"
                              fill="none"
                            >
                              <path
                                d="M4.89636 2.89288C5.57412 1.67751 5.91273 1.06982 6.41931 1.06982C6.9259 1.06982 7.26451 1.67751 7.94227 2.89288L8.11773 3.20742C8.3103 3.55298 8.40659 3.72577 8.55637 3.83971C8.70615 3.95365 8.89338 3.99591 9.26783 4.08043L9.60805 4.15746C10.924 4.45542 11.5814 4.60413 11.7382 5.1075C11.8944 5.61034 11.4461 6.13511 10.549 7.18411L10.3168 7.45532C10.0622 7.75328 9.93436 7.90253 9.87712 8.08654C9.81989 8.2711 9.83914 8.47009 9.87766 8.86755L9.91296 9.2297C10.0483 10.6296 10.1162 11.3293 9.70648 11.6401C9.29672 11.9509 8.68048 11.6674 7.44906 11.1004L7.1297 10.9538C6.77986 10.7922 6.60494 10.712 6.41931 10.712C6.23369 10.712 6.05877 10.7922 5.70892 10.9538L5.3901 11.1004C4.15815 11.6674 3.54191 11.9509 3.13268 11.6406C2.72239 11.3293 2.79033 10.6296 2.92566 9.2297L2.96097 8.86808C2.99948 8.47009 3.01874 8.2711 2.96097 8.08708C2.90427 7.90253 2.77642 7.75328 2.52179 7.45586L2.28963 7.18411C1.39255 6.13564 0.944271 5.61087 1.10047 5.1075C1.25667 4.60413 1.91518 4.45488 3.23111 4.15746L3.57133 4.08043C3.94525 3.99591 4.13194 3.95365 4.28226 3.83971C4.43257 3.72577 4.52832 3.55298 4.7209 3.20742L4.89636 2.89288Z"
                                fill="#F8C65B"
                              />
                            </svg>
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
              ))}
            </div>
          </BoxProviderWithName>
        </div>
      </div>
    </BasicStructureWithName>
  );
}
