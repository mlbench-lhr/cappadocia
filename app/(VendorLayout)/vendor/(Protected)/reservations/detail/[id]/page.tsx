"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import Image from "next/image";
import { LocationIcon, PhoneIcon, MailIcon } from "@/public/allIcons/page";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import { BookingWithPopulatedData } from "@/lib/types/booking";
import axios from "axios";
import { useParams } from "next/navigation";
import moment from "moment";
import { percentage } from "@/lib/helper/smallHelpers";
import ReservationPageSkeleton from "@/components/Skeletons/ReservationPageSkeleton";
import { formatPricing } from "@/lib/helper/textsFormat";
import { getPartOfDay } from "@/lib/helper/timeFunctions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Swal from "sweetalert2";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const { id }: { id: string } = useParams();
  const [reload, setReload] = useState<number>(0);
  console.log("id-----", id);
  const [startLoading, setStartLoading] = useState<boolean>(false);
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const [data, setData] = useState<BookingWithPopulatedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/booking/detail/${id}`);
        console.log("response----", response.data);

        if (response.data) {
          setData(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, [reload]);

  if (!data) {
    return <ReservationPageSkeleton />;
  }
  const handleStartBooking = async () => {
    if (!data?._id) return;
    try {
      setStartLoading(true);
      await axios.patch(`/api/booking/update/${data._id}`, {
        status: "in-progress",
      });
      await Swal.fire("Started!", "Booking started successfully.", "success");
      setReload(reload + 1);
    } catch (error) {
      await Swal.fire(
        "Failed",
        "Failed to cancel booking. Please try again.",
        "error"
      );
    } finally {
      setStartLoading(false);
    }
  };
  return (
    <BasicStructureWithName name="Details" showBackOption>
      <div className="flex flex-col justify-start items-start w-full lg:w-[95%] xl:w-[90%] 2xl:w-[80%] gap-3 h-fit pb-8">
        <BoxProviderWithName noBorder={true}>
          <div className="grid grid-cols-10 gap-3.5">
            <div className="col-span-10">
              <BoxProviderWithName
                noBorder={true}
                className="!p-0"
                leftSideComponent={
                  <div className="w-[260px] md:w-fit text-sm md:text-base font-semibold ">
                    Booking Information /{" "}
                    <span className="text-primary"> #{data.bookingId}</span>
                  </div>
                }
                rightSideComponent={
                  <div className="flex justify-start items-center gap-2">
                    <Button variant={"green_secondary_button"} size={"sm"}>
                      <Link
                        href={
                          "/vendor/tours-and-activities/detail/" +
                          data.activity._id
                        }
                      >
                        View Tour Details
                      </Link>
                    </Button>
                    <Button
                      variant={"main_green_button"}
                      size={"sm"}
                      onClick={handleStartBooking}
                      loading={startLoading}
                    >
                      Start Tour
                    </Button>
                  </div>
                }
                textClasses=" text-[18px] font-semibold "
              >
                <BoxProviderWithName textClasses=" text-[18px] font-semibold">
                  <div className="w-full flex justify-start items-start flex-col">
                    <div className="w-full flex justify-between flex-wrap items-center gap-2">
                      <Image
                        src={data.activity.uploads?.[0]}
                        alt=""
                        width={200}
                        height={200}
                        className="w-full md:w-[100px] h-[150px] md:h-[100px] object-cover object-center rounded-2xl"
                      />
                      <div className="w-[calc(100%-110px)] flex justify-center items-start flex-col ">
                        <h2 className="text-base font-semibold">
                          {data.activity.title}
                        </h2>
                        <h3 className="text-sm font-normal">
                          Duration: {getPartOfDay(data.selectDate)} (
                          {data.activity.duration} hours)
                        </h3>
                        <h4 className="text-sm font-normal">
                          {`From : ${data.paymentDetails.currency} ${data.activity.slots?.[0]?.adultPrice}/Adult,  ${data.paymentDetails.currency} ${data.activity.slots?.[0]?.adultPrice}/Child`}
                        </h4>
                      </div>
                    </div>
                    <div className="w-full flex justify-between items-center mt-4">
                      <span className="text-xs font-normal">Date</span>
                      <span className="text-sm font-medium">
                        {moment(data.selectDate).format(
                          "MMM DD, YYYY | hh:mm A"
                        )}{" "}
                      </span>
                    </div>
                    <div className="w-full flex justify-between items-center">
                      <span className="text-xs font-normal">Guests</span>
                      <span className="text-sm font-medium">
                        {data.adultsCount} Adults, {data.childrenCount} Children{" "}
                      </span>
                    </div>
                    <div className="w-full flex justify-between md:justify-start items-center gap-8">
                      <span className="text-xs font-normal">
                        Booking status:
                      </span>
                      <StatusBadge status={data.status} />
                    </div>
                  </div>
                </BoxProviderWithName>
              </BoxProviderWithName>
            </div>
            <div className="col-span-10 md:col-span-4 flex flex-col justify-start items-start gap-3.5">
              <BoxProviderWithName
                className="text-base"
                name="Customer Details"
              >
                <div className="w-full flex-col flex justify-start items-start gap-5">
                  <ProfileBadge
                    size="medium"
                    title={data.user.fullName}
                    subTitle={data.user.email}
                    image={data.user.avatar}
                  />
                  <ProfileBadge
                    size="custom"
                    title="Phone"
                    subTitle={data.phoneNumber}
                    icon={<PhoneIcon color="rgba(0, 0, 0, 0.5)" />}
                  />
                  <ProfileBadge
                    size="custom"
                    title="Email"
                    subTitle={data.user.email}
                    icon={<MailIcon color="rgba(0, 0, 0, 0.5)" />}
                  />
                  <ProfileBadge
                    size="custom"
                    title="Location"
                    subTitle={data?.pickupLocation?.address || ""}
                    icon={<LocationIcon color="rgba(0, 0, 0, 0.5)" />}
                  />
                </div>
              </BoxProviderWithName>
            </div>
            <div className="col-span-10 md:col-span-6 flex flex-col justify-start items-start gap-3.5">
              <BoxProviderWithName className="text-base" name="Price Breakdown">
                <div className="w-full flex-col flex justify-start items-start gap-1">
                  <div className="w-full flex justify-start items-center gap-8">
                    <span className="text-sm md:text-base font-normal">
                      Payment status:
                    </span>
                    <StatusBadge status={data.paymentStatus} />
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-sm md:text-base font-medium">
                      Base Price:{" "}
                    </span>
                    <span className="text-sm md:text-base font-medium">
                      {formatPricing(data)}
                      {/* {data.paymentDetails.currency}
                      {data.activity.slots?.[0].childPrice} ×{" "}
                      {data.childrenCount} Children +
                      {data.paymentDetails.currency}
                      {data.activity.slots?.[0].adultPrice} × {data.adultsCount}{" "}
                      Adults = {data.paymentDetails.currency}
                      {data.paymentDetails.amount} */}
                    </span>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-sm md:text-base font-medium">
                      Total paid:{" "}
                    </span>
                    <span className="text-sm md:text-base font-medium">
                      {data.paymentDetails.currency}
                      {data.paymentDetails.amount}
                    </span>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-sm md:text-base font-medium">
                      Commission (Platform 15%):
                    </span>
                    <span className="text-sm md:text-base font-medium">
                      {data.paymentDetails.currency}
                      {percentage(15, data.paymentDetails.amount)}
                    </span>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-sm md:text-base font-medium">
                      Net Revenue:{" "}
                    </span>
                    <span className="text-sm md:text-base font-medium">
                      €2000
                    </span>
                  </div>
                </div>
              </BoxProviderWithName>
            </div>
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
