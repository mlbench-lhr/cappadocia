"use client";
import Image from "next/image";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import Link from "next/link";
import { BookingIcon, ClockIcon, PeopleIcon } from "@/public/allIcons/page";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import { BookingWithPopulatedData } from "@/lib/types/booking";
import { HorizontalTourCardSkeleton } from "@/components/Skeletons/HorizontalTourCardSkeleton";

export const UpcomingReservations = () => {
  const [toursAndActivity, setToursAndActivity] =
    useState<BookingWithPopulatedData[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/booking/getAll?limit=3`);
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
    <BoxProviderWithName name="Upcoming Reservations">
      <div className="w-full space-y-3">
        {loading
          ? [...Array(2)].map((item, index) => (
              <HorizontalTourCardSkeleton key={index} />
            ))
          : toursAndActivity?.map((item, index) => (
              <BoxProviderWithName
                key={index}
                noBorder={true}
                className="!border !px-3.5"
              >
                <div className="flex justify-start items-center gap-2 flex-col md:flex-row">
                  <Image
                    alt=""
                    src={item.activity.uploads?.[0]}
                    width={120}
                    height={120}
                    className="w-full md:w-[120px] h-[120px] object-cover object-center rounded-xl"
                  />
                  <div className="space-y-1 w-full md:w-[calc(100%-128px)] text-[rgba(34,30,31,0.50)] text-xs font-normal leading-0">
                    <h1 className="text-base font-semibold text-black leading-tight line-clamp-1">
                      {item.activity.title}
                    </h1>
                    <div className="flex justify-start items-center gap-1">
                      <ClockIcon color="rgba(0, 0, 0, 0.5)" />
                      <span className="">
                        {moment(item.selectDate).format(
                          "MMM DD, YYYY | hh:mm A"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-start items-center gap-1">
                      <PeopleIcon color="rgba(0, 0, 0, 0.5)" />
                      <span className="">
                        Participants: {item?.adultsCount} Adults,{" "}
                        {item.childrenCount} Children
                      </span>
                    </div>
                    <div className="flex justify-start items-center gap-1">
                      <BookingIcon color="rgba(0, 0, 0, 0.5)" size="15" />
                      <span className="">Booking ID: #{item.bookingId} </span>
                    </div>
                    <div className="w-full flex justify-between items-center mt-2">
                      <StatusBadge status={item.paymentStatus} />
                      <Link
                        href={`/bookings/detail/${item._id}`}
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
  );
};
