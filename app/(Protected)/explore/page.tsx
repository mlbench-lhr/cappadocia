"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import { ChevronDown } from "lucide-react";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";
import Link from "next/link";

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
    image: "/userDashboard/img2.png",
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

export default function ExplorePage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<
    ("all" | { duration: Date } | { priceRange: string } | { rating: string })[]
  >(["all"]);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  return (
    <BasicStructureWithName
      name="Explore Cappadocia"
      showBackOption
      rightSideComponent={
        <SearchComponent
          searchQuery={searchQuery}
          onChangeFunc={setSearchQuery}
        />
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        <div className="flex justify-start items-start w-full gap-1.5 h-fit flex-wrap md:flex-nowrap">
          <div
            className={`${
              filters.includes("all") ? " bg-secondary text-primary" : "border"
            } px-4 py-3 leading-tight rounded-[14px] text-[12px] font-medium`}
          >
            All
          </div>
          <div
            className={`${
              filters.some((f) => typeof f === "object" && "duration" in f)
                ? " bg-secondary text-primary"
                : "border"
            } px-4 py-3 leading-tight rounded-[14px] text-[12px] font-medium flex justify-between items-center gap-2`}
          >
            Duration
            <ChevronDown size={16} />
          </div>
          <div
            className={`${
              filters.some((f) => typeof f === "object" && "priceRange" in f)
                ? " bg-secondary text-primary"
                : "border"
            } px-4 py-3 leading-tight rounded-[14px] text-[12px] font-medium flex justify-between items-center gap-2`}
          >
            Price Range
            <ChevronDown size={16} />
          </div>
          <div
            className={`${
              filters.some((f) => typeof f === "object" && "rating" in f)
                ? " bg-secondary text-primary"
                : "border"
            } px-4 py-3 leading-tight rounded-[14px] text-[12px] font-medium flex justify-between items-center gap-2`}
          >
            Rating
            <ChevronDown size={16} />
          </div>
        </div>
        <BoxProviderWithName className="">
          <div className="w-full space-y-0">
            <BoxProviderWithName
              noBorder={true}
              name="Popular Tours"
              rightSideLink="/dashboard"
              rightSideLabel="View All Tours"
            >
              <div className="w-full space-y-3 grid grid-cols-12 gap-3">
                {exploreData.map((item) => (
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
                        <div className="bg-white cursor-pointer h-[26px] w-[26px] rounded-[6px] absolute top-3 right-3 flex justify-center items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="12"
                            viewBox="0 0 14 12"
                            fill="none"
                          >
                            <path
                              d="M0 3.90148C0 7.14348 2.68 8.87082 4.64133 10.4175C5.33333 10.9628 6 11.4768 6.66667 11.4768C7.33333 11.4768 8 10.9635 8.692 10.4168C10.654 8.87148 13.3333 7.14348 13.3333 3.90215C13.3333 0.660817 9.66667 -1.63985 6.66667 1.47748C3.66667 -1.63985 0 0.659484 0 3.90148Z"
                              fill="#B32053"
                            />
                          </svg>
                        </div>
                        <div className="w-full h-[25px] flex text-white bg-primary justify-between items-center mb-2 px-1.5">
                          <div className="flex justify-start items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333C2.98467 13.3333 0 10.3487 0 6.66667C0 2.98467 2.98467 0 6.66667 0ZM6.66667 2.66667C6.48986 2.66667 6.32029 2.7369 6.19526 2.86193C6.07024 2.98695 6 3.15652 6 3.33333V6.66667C6.00004 6.84346 6.0703 7.013 6.19533 7.138L8.19533 9.138C8.32107 9.25944 8.48947 9.32663 8.66427 9.32512C8.83907 9.3236 9.00627 9.25348 9.12988 9.12988C9.25348 9.00627 9.3236 8.83906 9.32512 8.66427C9.32664 8.48947 9.25944 8.32107 9.138 8.19533L7.33333 6.39067V3.33333C7.33333 3.15652 7.2631 2.98695 7.13807 2.86193C7.01305 2.7369 6.84348 2.66667 6.66667 2.66667Z"
                                fill="white"
                              />
                            </svg>
                            <span className="text-[10px] font-[400]">
                              5 Days
                            </span>
                          </div>
                          <div className="flex justify-start items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="12"
                              viewBox="0 0 15 12"
                              fill="none"
                            >
                              <path
                                d="M7.33333 6C8.582 6 9.71333 6.41333 10.5433 6.99133C11.332 7.54133 12 8.35867 12 9.238C12 9.72067 11.794 10.1207 11.4693 10.418C11.164 10.6987 10.7653 10.8807 10.3547 11.0047C9.534 11.2533 8.45333 11.3333 7.33333 11.3333C6.21333 11.3333 5.13267 11.2533 4.312 11.0047C3.90133 10.8807 3.50267 10.6987 3.19667 10.418C2.87333 10.1213 2.66667 9.72133 2.66667 9.23867C2.66667 8.35933 3.33467 7.542 4.12333 6.992C4.95333 6.41333 6.08467 6 7.33333 6ZM12 6.66667C12.696 6.66667 13.328 6.89667 13.7953 7.222C14.222 7.52 14.6667 8.01533 14.6667 8.61933C14.6667 8.964 14.5167 9.25 14.2933 9.45467C14.0893 9.642 13.8373 9.752 13.6073 9.82133C13.294 9.916 12.924 9.96467 12.54 9.986C12.6213 9.756 12.6667 9.506 12.6667 9.238C12.6667 8.21467 12.0273 7.34533 11.312 6.742C11.5379 6.69209 11.7686 6.66683 12 6.66667ZM2.66667 6.66667C2.90533 6.66756 3.13467 6.69267 3.35467 6.742C2.64 7.34533 2 8.21467 2 9.238C2 9.506 2.04533 9.756 2.12667 9.986C1.74267 9.96467 1.37333 9.916 1.05933 9.82133C0.829333 9.752 0.577333 9.642 0.372667 9.45467C0.255351 9.34957 0.161522 9.22091 0.0973073 9.07708C0.0330922 8.93326 -6.5246e-05 8.77751 9.63883e-08 8.62C9.63883e-08 8.01667 0.444 7.52067 0.871333 7.22267C1.39991 6.8603 2.02581 6.66646 2.66667 6.66667ZM11.6667 2.66667C12.1087 2.66667 12.5326 2.84226 12.8452 3.15482C13.1577 3.46738 13.3333 3.89131 13.3333 4.33333C13.3333 4.77536 13.1577 5.19928 12.8452 5.51184C12.5326 5.8244 12.1087 6 11.6667 6C11.2246 6 10.8007 5.8244 10.4882 5.51184C10.1756 5.19928 10 4.77536 10 4.33333C10 3.89131 10.1756 3.46738 10.4882 3.15482C10.8007 2.84226 11.2246 2.66667 11.6667 2.66667ZM3 2.66667C3.44203 2.66667 3.86595 2.84226 4.17851 3.15482C4.49107 3.46738 4.66667 3.89131 4.66667 4.33333C4.66667 4.77536 4.49107 5.19928 4.17851 5.51184C3.86595 5.8244 3.44203 6 3 6C2.55797 6 2.13405 5.8244 1.82149 5.51184C1.50893 5.19928 1.33333 4.77536 1.33333 4.33333C1.33333 3.89131 1.50893 3.46738 1.82149 3.15482C2.13405 2.84226 2.55797 2.66667 3 2.66667ZM7.33333 0C8.04058 0 8.71885 0.280951 9.21895 0.781048C9.71905 1.28115 10 1.95942 10 2.66667C10 3.37391 9.71905 4.05219 9.21895 4.55228C8.71885 5.05238 8.04058 5.33333 7.33333 5.33333C6.62609 5.33333 5.94781 5.05238 5.44772 4.55228C4.94762 4.05219 4.66667 3.37391 4.66667 2.66667C4.66667 1.95942 4.94762 1.28115 5.44772 0.781048C5.94781 0.280951 6.62609 0 7.33333 0Z"
                                fill="white"
                              />
                            </svg>
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
                          <div className="flex justify-start items-center gap-1">
                            <span className="text-base font-medium text-black">
                              ${item.price}
                            </span>
                            <span className="">/Person</span>
                          </div>

                          <div className="w-full flex justify-between items-center -mt-1">
                            <div className="flex justify-start items-center gap-2">
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
                  </div>
                ))}
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName
              className="!py-0"
              noBorder={true}
              name="Popular Activities"
              rightSideLink="/dashboard"
              rightSideLabel="View All Activities"
            >
              <div className="w-full space-y-3 grid grid-cols-12 gap-3">
                {exploreData.map((item) => (
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="12"
                            viewBox="0 0 14 12"
                            fill="none"
                          >
                            <path
                              d="M0 3.90148C0 7.14348 2.68 8.87082 4.64133 10.4175C5.33333 10.9628 6 11.4768 6.66667 11.4768C7.33333 11.4768 8 10.9635 8.692 10.4168C10.654 8.87148 13.3333 7.14348 13.3333 3.90215C13.3333 0.660817 9.66667 -1.63985 6.66667 1.47748C3.66667 -1.63985 0 0.659484 0 3.90148Z"
                              fill="#B32053"
                            />
                          </svg>
                        </div>
                        <div className="w-full h-[25px] flex text-white bg-primary justify-between items-center mb-2 px-1.5">
                          <div className="flex justify-start items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333C2.98467 13.3333 0 10.3487 0 6.66667C0 2.98467 2.98467 0 6.66667 0ZM6.66667 2.66667C6.48986 2.66667 6.32029 2.7369 6.19526 2.86193C6.07024 2.98695 6 3.15652 6 3.33333V6.66667C6.00004 6.84346 6.0703 7.013 6.19533 7.138L8.19533 9.138C8.32107 9.25944 8.48947 9.32663 8.66427 9.32512C8.83907 9.3236 9.00627 9.25348 9.12988 9.12988C9.25348 9.00627 9.3236 8.83906 9.32512 8.66427C9.32664 8.48947 9.25944 8.32107 9.138 8.19533L7.33333 6.39067V3.33333C7.33333 3.15652 7.2631 2.98695 7.13807 2.86193C7.01305 2.7369 6.84348 2.66667 6.66667 2.66667Z"
                                fill="white"
                              />
                            </svg>
                            <span className="text-[10px] font-[400]">
                              5 Days
                            </span>
                          </div>
                          <div className="flex justify-start items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="12"
                              viewBox="0 0 15 12"
                              fill="none"
                            >
                              <path
                                d="M7.33333 6C8.582 6 9.71333 6.41333 10.5433 6.99133C11.332 7.54133 12 8.35867 12 9.238C12 9.72067 11.794 10.1207 11.4693 10.418C11.164 10.6987 10.7653 10.8807 10.3547 11.0047C9.534 11.2533 8.45333 11.3333 7.33333 11.3333C6.21333 11.3333 5.13267 11.2533 4.312 11.0047C3.90133 10.8807 3.50267 10.6987 3.19667 10.418C2.87333 10.1213 2.66667 9.72133 2.66667 9.23867C2.66667 8.35933 3.33467 7.542 4.12333 6.992C4.95333 6.41333 6.08467 6 7.33333 6ZM12 6.66667C12.696 6.66667 13.328 6.89667 13.7953 7.222C14.222 7.52 14.6667 8.01533 14.6667 8.61933C14.6667 8.964 14.5167 9.25 14.2933 9.45467C14.0893 9.642 13.8373 9.752 13.6073 9.82133C13.294 9.916 12.924 9.96467 12.54 9.986C12.6213 9.756 12.6667 9.506 12.6667 9.238C12.6667 8.21467 12.0273 7.34533 11.312 6.742C11.5379 6.69209 11.7686 6.66683 12 6.66667ZM2.66667 6.66667C2.90533 6.66756 3.13467 6.69267 3.35467 6.742C2.64 7.34533 2 8.21467 2 9.238C2 9.506 2.04533 9.756 2.12667 9.986C1.74267 9.96467 1.37333 9.916 1.05933 9.82133C0.829333 9.752 0.577333 9.642 0.372667 9.45467C0.255351 9.34957 0.161522 9.22091 0.0973073 9.07708C0.0330922 8.93326 -6.5246e-05 8.77751 9.63883e-08 8.62C9.63883e-08 8.01667 0.444 7.52067 0.871333 7.22267C1.39991 6.8603 2.02581 6.66646 2.66667 6.66667ZM11.6667 2.66667C12.1087 2.66667 12.5326 2.84226 12.8452 3.15482C13.1577 3.46738 13.3333 3.89131 13.3333 4.33333C13.3333 4.77536 13.1577 5.19928 12.8452 5.51184C12.5326 5.8244 12.1087 6 11.6667 6C11.2246 6 10.8007 5.8244 10.4882 5.51184C10.1756 5.19928 10 4.77536 10 4.33333C10 3.89131 10.1756 3.46738 10.4882 3.15482C10.8007 2.84226 11.2246 2.66667 11.6667 2.66667ZM3 2.66667C3.44203 2.66667 3.86595 2.84226 4.17851 3.15482C4.49107 3.46738 4.66667 3.89131 4.66667 4.33333C4.66667 4.77536 4.49107 5.19928 4.17851 5.51184C3.86595 5.8244 3.44203 6 3 6C2.55797 6 2.13405 5.8244 1.82149 5.51184C1.50893 5.19928 1.33333 4.77536 1.33333 4.33333C1.33333 3.89131 1.50893 3.46738 1.82149 3.15482C2.13405 2.84226 2.55797 2.66667 3 2.66667ZM7.33333 0C8.04058 0 8.71885 0.280951 9.21895 0.781048C9.71905 1.28115 10 1.95942 10 2.66667C10 3.37391 9.71905 4.05219 9.21895 4.55228C8.71885 5.05238 8.04058 5.33333 7.33333 5.33333C6.62609 5.33333 5.94781 5.05238 5.44772 4.55228C4.94762 4.05219 4.66667 3.37391 4.66667 2.66667C4.66667 1.95942 4.94762 1.28115 5.44772 0.781048C5.94781 0.280951 6.62609 0 7.33333 0Z"
                                fill="white"
                              />
                            </svg>
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
                          <div className="flex justify-start items-center gap-1">
                            <span className="text-base font-medium text-black">
                              ${item.price}
                            </span>
                            <span className="">/Person</span>
                          </div>

                          <div className="w-full flex justify-between items-center -mt-1">
                            <div className="flex justify-start items-center gap-2">
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
                  </div>
                ))}
              </div>
            </BoxProviderWithName>
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
