"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import Image from "next/image";
import {
  ClockIcon,
  BookingIcon,
  PeopleIcon,
  LocationIcon,
  PhoneIcon,
  MailIcon,
  StarIcon,
} from "@/public/allIcons/page";
import moment from "moment";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import Link from "next/link";
import {
  IconAndTextTab,
  IconAndTextTab2,
} from "@/components/SmallComponents/IconAndTextTab";
import {
  Copy,
  Forward,
  Locate,
  LocateIcon,
  Mail,
  Phone,
  PhoneCallIcon,
  Share,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import { Textarea } from "@/components/ui/textarea";
import DownloadInvoiceButton from "@/app/(Protected)/invoices/DownloadButton";
import AddressLocationSelector, { LocationData } from "@/components/map";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const RightLabel = () => {
    return (
      <span className="text-[#008EFF] text-base font-normal">
        Tour Status: Upcoming
      </span>
    );
  };
  const item = {
    image: "/userDashboard/img3.png",
    title: "Cappadocia balloons flying at sunrise",
    date: new Date("2024-05-15T11:00:00"),
    adultCount: 3,
    childCount: 3,
    bookingId: "TRX-47012",
    status: "Paid",
    _id: "1",
  };
  const [location1, setLocation1] = useState<LocationData>({
    address: "1600 Amphitheatre Parkway, Mountain View, CA",
    coordinates: { lat: 37.4224764, lng: -122.0842499 },
  });

  return (
    <BasicStructureWithName
      name="Booking Details"
      showBackOption
      rightSideComponent={<DownloadInvoiceButton />}
    >
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        <BoxProviderWithName
          name="Booking Information / #1242"
          rightSideComponent={RightLabel}
        >
          <div className="w-full flex flex-col justify-start items-start gap-4 md:gap-6">
            <BoxProviderWithName noBorder={true} className="!border !px-3.5">
              <div className="w-full flex flex-col justify-start items-start gap-4 md:gap-6">
                <div className="flex justify-start items-start gap-4 flex-col md:flex-row">
                  <Image
                    alt=""
                    src={item.image}
                    width={200}
                    height={200}
                    className="w-full md:w-[200px] h-auto md:h-auto object-cover object-center"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full md:w-[calc(100%-128px)] text-[rgba(34,30,31,0.50)] text-xs font-normal leading-0">
                    <h1 className="col-span-2 text-base font-semibold text-black leading-tight line-clamp-1">
                      {item.title}
                    </h1>
                    <IconAndTextTab
                      icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                      text={`Date and Time: ${moment(item.date).format(
                        "MMM DD, YYYY | hh:mm A"
                      )}`}
                    />
                    <IconAndTextTab
                      icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                      text={`Participants: 2 Adults`}
                    />
                    <IconAndTextTab
                      icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                      text={`Booking ID: #CT-2025-001242`}
                    />
                    <IconAndTextTab
                      icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                      text={`Location: Cappadocia,Turkey`}
                    />
                    <IconAndTextTab
                      icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                      text={`Duration: 60 minutes`}
                    />
                    <IconAndTextTab
                      icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                      text={`Meeting Point: Göreme Town Center`}
                    />
                    <IconAndTextTab
                      icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                      text={`Price per Person: €120`}
                    />
                    <IconAndTextTab
                      icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                      text={`Total Price: €350`}
                    />
                    <IconAndTextTab
                      icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                      text={`Payment Method: Not Completed`}
                    />
                  </div>
                </div>
                <div className="w-full grid grid-cols-12">
                  <div className="col-span-12 md:col-span-6 flex flex-col gap-2 items-start justify-start">
                    <div className="flex gap-2 items-center justify-start">
                      <span className="text-base font-normal">
                        Payment Status:
                      </span>
                      <StatusBadge status="Pending" />
                    </div>
                    <h3 className="text-[18px] font-semibold">QR Code</h3>
                    <div className="w-[430px] h-[350px] flex justify-center items-center">
                      <Image
                        src={"/userDashboard/qrCode.png"}
                        alt=""
                        width={430}
                        height={350}
                        className="w-[430px] h-[350px] object-contain"
                      />
                    </div>
                    <span className="text-[14px] font-normal">
                      Show this QR code at the tour start point for check-in.
                    </span>
                    <span className="text-[14px] font-medium text-primary">
                      12tsNYRjzZ3LcLyEvn4XJCB4FV12GbWU
                    </span>
                    <div className="flex justify-start items-center gap-2">
                      <Copy />
                      <Forward />
                    </div>
                    <Button variant={"main_green_button"}>Pay Now</Button>
                  </div>
                  <div className="col-span-12 md:col-span-6 flex flex-col gap-2 items-start justify-start">
                    <BoxProviderWithName name="Vendor / Operator Information">
                      <BoxProviderWithName>
                        <div className="w-full flex flex-col gap-3 justify-between items-center">
                          <div className="w-full flex justify-between items-center">
                            <div className="w-[calc(100%-100px)]">
                              <ProfileBadge
                                size="large"
                                title="SkyView Balloon Tours"
                                subTitle={"TÜRSAB Number: " + 1232}
                                image="/userDashboard/img2.png"
                              />
                            </div>
                            <div className="w-fit h-fit px-1.5 py-1 bg-secondary rounded-[10px]">
                              <IconAndTextTab2
                                icon={<LocationIcon />}
                                text={`1.2 mi`}
                              />
                            </div>
                          </div>
                          <Button
                            variant={"main_green_button"}
                            className="w-full"
                          >
                            Chat
                          </Button>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-2 mt-3">
                          <span className="text-base font-semibold">
                            Contact Information
                          </span>
                          <IconAndTextTab2
                            icon={<PhoneIcon />}
                            text={`+90 384 123 4567`}
                            textClasses="text-black/70"
                          />
                          <IconAndTextTab2
                            icon={<MailIcon />}
                            text={`info@skyviewballoon.com`}
                            textClasses="text-black/70"
                          />
                        </div>
                        <div className="flex flex-col justify-start items-start gap-2 mt-3">
                          <span className="text-base font-semibold">
                            Location
                          </span>
                          <IconAndTextTab2
                            icon={<LocationIcon />}
                            text={`Location: Cappadocia,Turkey`}
                            textClasses="text-black/70"
                          />
                          <AddressLocationSelector
                            value={location1}
                            onChange={(data) => {
                              setLocation1(data);
                            }}
                            readOnly={true}
                            label="Enter Your Business Address"
                            className=" w-full h-[188px] rounded-xl "
                            placeholder="Type address or click on map"
                          />
                          <div className="w-full flex flex-col justify-start items-start gap-2">
                            <div className="w-full flex justify-between items-center">
                              <h3 className="text-base font-semibold">
                                Your Feedback
                              </h3>
                              <div className="w-fit flex justify-start items-center gap-1">
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                              </div>
                            </div>
                            <Textarea
                              className="bg-[#FFF8FB] border h-[90px]"
                              value={
                                "Amazing experience, balloon ride was unforgettable!"
                              }
                            />
                          </div>
                          <Button
                            variant={"main_green_button"}
                            className="w-full"
                          >
                            Edit review
                          </Button>
                        </div>
                      </BoxProviderWithName>
                    </BoxProviderWithName>
                  </div>
                </div>
              </div>
            </BoxProviderWithName>
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
