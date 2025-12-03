"use client";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { BookingWithPopulatedData } from "@/lib/types/booking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import ReservationsListSkeleton from "@/components/Skeletons/ReservationsListSkeleton";

export const UpcomingReservations = () => {
  const [toursAndActivity, setToursAndActivity] =
    useState<BookingWithPopulatedData[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/booking/getAll?limit=2`);
        console.log("response----", response);

        if (response.data?.data) {
          setToursAndActivity(response.data?.data);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, []);

  return (
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
            {loading
              ? [...Array(2)].map((item, index) => (
                  <ReservationsListSkeleton key={index} />
                ))
              : toursAndActivity?.map((item, index) => (
                  <BoxProviderWithName
                    leftSideComponent={
                      <ProfileBadge
                        title={item.user.fullName}
                        subTitle={item.user.email}
                        image={item.user.avatar || "/placeholderDp.png"}
                        size="medium"
                      />
                    }
                    rightSideComponent={
                      <div className="md:xl md:text-[26px] font-semibold text-primary">
                        {item.paymentDetails.currency}
                        {item.paymentDetails.amount}
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
                      <div className="flex flex-col justify-start items-start mt-4">
                        <Button
                          size={"lg"}
                          variant={"green_secondary_button"}
                          asChild
                        >
                          <Link href={"/vendor/reservations"}>
                            View All Reservations
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </BoxProviderWithName>
                ))}
          </div>
        </BoxProviderWithName>
      </div>
    </div>
  );
};
