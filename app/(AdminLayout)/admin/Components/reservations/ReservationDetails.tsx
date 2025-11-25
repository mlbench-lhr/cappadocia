"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  IconAndTextTab,
  IconAndTextTab2,
} from "@/components/SmallComponents/IconAndTextTab";
import {
  ClockIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
} from "@/public/allIcons/page";
import AddressLocationSelector, { LocationData } from "@/components/map";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";

// QR Code Component
const QRCode: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border mt-4">
      <h3 className="text-lg font-bold mb-2">QR Code</h3>

      <div className="flex gap-4">
        <div className="w-32 h-32 ">
          <Image
            src="/admin-images/reservation/QR.png"
            alt="QR"
            width={20}
            height={20}
            className="w-full h-full"
          />
        </div>

        <div className="flex-1">
          <p className="text-gray-600 mb-2">
            Show this QR code at the tour start point for check-in.
          </p>
          <a href="#" className="text-pink-600 text-sm underline">
            12tsNYRjzZ3LcLyEvn4XJCB4FV12GbWU
          </a>
        </div>
      </div>
    </div>
  );
};

import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { BookingWithPopulatedData } from "@/lib/types/booking";
import moment from "moment";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import AdminReservationPageSkeleton from "@/components/Skeletons/AdminReservationPageSkeleton";

// Main App Component
const ReservationDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const [data, setData] = useState<BookingWithPopulatedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  console.log("data-----", data);

  const { id }: { id: string } = useParams();
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
  }, []);

  if (!data || loading) {
    return <AdminReservationPageSkeleton />;
  }

  return (
    <BasicStructureWithName
      showBackOption={true}
      name="Booking Detail"
      rightSideComponent={
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Payment Status:</span>
          <StatusBadge status={data.paymentStatus} />
        </div>
      }
    >
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BoxProviderWithName
            noBorder={true}
            className="!p-0"
            leftSideComponent={
              <div className=" text-sm md:text-base font-semibold ">
                Booking Information /{" "}
                <span className="text-primary"> #{data.bookingId}</span>
              </div>
            }
            rightSideLink={
              "/admin/tours-and-activities/detail/" + data.activity._id
            }
            rightSideLabel="Activity Details"
            textClasses=" text-[18px] font-semibold "
          >
            <div className="mb-4">
              <span className="text-blue-500 font-medium">
                Tour Status: {data.status}
              </span>
            </div>

            <div className="mb-6 w-full">
              <Image
                src={data.activity.uploads[0]}
                alt="QR"
                width={350}
                height={300}
                className="w-full  h-auto lg:h-[300px] object-cover object-center rounded-2xl"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 w-full md:w-[calc(100%-128px)] text-[rgba(34,30,31,0.50)] text-xs font-normal leading-0">
              <h1 className=" text-base font-semibold text-black leading-tight line-clamp-1">
                {data.activity.title}
              </h1>
              <IconAndTextTab
                icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                text={`Date and Time: ${moment(data.selectDate).format(
                  "MMM DD, YYYY | hh:mm A"
                )}`}
              />
              <IconAndTextTab
                icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                text={`Participants: ${data.adultsCount} Adults, ${data.childrenCount} Children `}
              />
              <IconAndTextTab
                icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                text={`Booking ID: #${data?.bookingId}`}
              />
              <IconAndTextTab
                icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                text={`Location: ${data?.vendor?.vendorDetails?.address?.address}`}
              />
              <IconAndTextTab
                icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                text={`Duration: ${data?.activity?.duration} minutes`}
              />
              <IconAndTextTab
                icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                text={`Meeting Point: ${data?.pickupLocation?.address}`}
              />
              <IconAndTextTab
                icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                text={`Price per Person: ${data.paymentDetails.currency} ${data.activity.slots?.[0]?.adultPrice}/Adult,  ${data.paymentDetails.currency} ${data.activity.slots?.[0]?.adultPrice}/Child`}
              />
              <IconAndTextTab
                icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                text={`Total Price:  ${data.paymentDetails.currency} ${data.paymentDetails.amount}`}
              />
            </div>
          </BoxProviderWithName>
          <div>
            <BoxProviderWithName name="Vendor / Operator Information">
              <BoxProviderWithName>
                <div className="w-full flex flex-col gap-3 justify-between items-center">
                  <div className="w-full flex justify-between items-center">
                    <div className="w-[calc(100%-100px)]">
                      <ProfileBadge
                        size="large"
                        title={data.vendor.vendorDetails.companyName}
                        subTitle={
                          "TÜRSAB Number: " +
                          data.vendor.vendorDetails.tursabNumber
                        }
                        image={data.vendor.avatar || "/placeholderDp.png"}
                      />
                    </div>
                    <div className="w-fit h-fit px-1.5 py-1 bg-secondary rounded-[10px]">
                      <IconAndTextTab2
                        icon={<LocationIcon />}
                        text={`1.2 mi`}
                      />
                    </div>
                  </div>
                  <Button variant={"main_green_button"} className="w-full">
                    Chat
                  </Button>
                </div>
                <div className="flex flex-col justify-start items-start gap-2 mt-3">
                  <span className="text-base font-semibold">
                    Contact Information
                  </span>
                  <IconAndTextTab2
                    icon={<PhoneIcon />}
                    text={data.vendor.vendorDetails.contactPhoneNumber}
                    textClasses="text-black/70"
                  />
                  <IconAndTextTab2
                    icon={<MailIcon />}
                    text={data.vendor.vendorDetails.businessEmail}
                    textClasses="text-black/70"
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2 mt-3">
                  <span className="text-base font-semibold">Location</span>
                  <IconAndTextTab2
                    icon={<LocationIcon />}
                    text={`Location: ${data.vendor.vendorDetails.address.address}`}
                    textClasses="text-black/70"
                  />
                  {data.pickupLocation && (
                    <AddressLocationSelector
                      value={data.pickupLocation as LocationData}
                      readOnly={true}
                      label="Enter Your Business Address"
                      className=" w-full h-[188px] rounded-xl "
                      placeholder="Type address or click on map"
                    />
                  )}
                </div>
              </BoxProviderWithName>
            </BoxProviderWithName>
            <BoxProviderWithName className="mt-4">
              <ProfileBadge
                size="medium"
                title={data.user.fullName}
                subTitle={data.user.email}
                image={data.user.avatar}
              />
              <div className="flex flex-col justify-start items-start gap-2 mt-3">
                <IconAndTextTab2
                  icon={<PhoneIcon />}
                  text={data.user.phoneNumber}
                  textClasses="text-black/70"
                />
              </div>
            </BoxProviderWithName>
            <QRCode />
          </div>
        </div>
      </div>
    </BasicStructureWithName>
  );
};

export default ReservationDetails;
