"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import Image from "next/image";
import {
  CancellationPolicyIcon,
  ClockIcon,
  CheckIcon,
  Vehicle2Icon,
  WorldIcon,
  CrossIcon,
  LocationIcon,
  StarIcon,
  PhoneIcon,
  MailIcon,
} from "@/public/allIcons/page";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
import { exploreProps } from "@/app/(Protected)/dashboard/page";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";

export type InvoiceData = {
  invoice: {
    invoiceNumber: string;
    invoiceDate: string; // ISO date string (YYYY-MM-DD)
    bookingId: string;
  };
  tourDetails: {
    title: string;
    dateTime: string; // ISO date-time string
    participants: {
      adults: number;
      children: number;
    };
    durationHours: number;
    meetingPoint: string;
  };
  travelerInformation: {
    fullName: string;
    passportNumber: string;
    nationality: string;
    contact: string;
    email: string;
  };
  paymentDetails: {
    method: string;
    transactionId: string;
    currency: string;
    amountPaid: number;
    status: "Paid" | "Pending" | "Failed";
  };
  priceBreakdown: {
    basePrice: {
      adults: number;
      currency: string;
      perAdult: number;
      total: number;
    };
    childPrice: {
      children: number;
      currency: string;
      perChild: number;
      total: number;
    };
    participants?: {
      adults: number;
      children?: number;
    };
    serviceFee: number;
    totalPaid: number;
  };
  vendorInformation: {
    operator: string;
    tursabNumber: string;
    contact: string;
    email: string;
  };
};
const invoiceData: InvoiceData = {
  invoice: {
    invoiceNumber: "INV-001245",
    invoiceDate: "2025-10-12",
    bookingId: "BK-000789",
  },
  tourDetails: {
    title: "Hot Air Balloon Sunrise Ride",
    dateTime: "2025-10-14T05:15:00",
    participants: {
      adults: 2,
      children: 1,
    },
    durationHours: 3,
    meetingPoint: "Göreme Town Square, Cappadocia",
  },
  travelerInformation: {
    fullName: "Sarah Mitchell",
    passportNumber: "C98765432",
    nationality: "United Kingdom",
    contact: "+90 384 555 9876",
    email: "Info@Skyadventures.Com",
  },
  paymentDetails: {
    method: "MasterCard **** 4421",
    transactionId: "TXN-568742195",
    currency: "EUR",
    amountPaid: 450.0,
    status: "Paid",
  },
  priceBreakdown: {
    basePrice: { adults: 2, currency: "€", perAdult: 160, total: 320 },
    childPrice: { children: 1, currency: "€", perChild: 100, total: 100 },
    serviceFee: 20,
    totalPaid: 450,
  },
  vendorInformation: {
    operator: "Cappadocia Sky Adventures",
    tursabNumber: "11098",
    contact: "+90 384 555 9876",
    email: "Info@Skyadventures.Com",
  },
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

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);
  const LocationIconWithPadding = () => {
    return (
      <div className="py-2 bg-white">
        <LocationIcon color="rgba(0, 0, 0, 0.50)" />
      </div>
    );
  };
  return (
    <BasicStructureWithName name="Details" showBackOption>
      <div className="flex flex-col justify-start items-start w-full lg:w-[80%] xl:w-[70%] 2xl:w-[60%] gap-3 h-fit pb-8">
        <BoxProviderWithName noBorder={true}>
          <div className="grid grid-cols-10 gap-3.5">
            <div className="col-span-10">
              <BoxProviderWithName
                noBorder={true}
                className="!p-0"
                leftSideComponent={
                  <div className=" text-sm md:text-base font-semibold ">
                    Booking Information /{" "}
                    <span className="text-primary"> #1242</span>
                  </div>
                }
                textClasses=" text-[18px] font-semibold "
              >
                <BoxProviderWithName textClasses=" text-[18px] font-semibold ">
                  <div className="w-full flex justify-start items-start flex-col">
                    <div className="w-full flex justify-between items-center gap-2">
                      <Image
                        src={"/userDashboard/img30.png"}
                        alt=""
                        width={80}
                        height={80}
                        className="rounded-[9px]"
                      />
                      <div className="w-full flex justify-center items-start flex-col">
                        <h2 className="text-base font-semibold">
                          Red Tour (North Cappadocia)
                        </h2>
                        <h3 className="text-sm font-normal">
                          Duration: Full Day (8 hours)
                        </h3>
                        <h4 className="text-sm font-normal">
                          From €80 /Person
                        </h4>
                      </div>
                    </div>
                    <div className="w-full flex justify-between items-center mt-4">
                      <span className="text-xs font-normal">Date</span>
                      <span className="text-sm font-medium">
                        Jan 16 - Jan 20, 2025
                      </span>
                    </div>
                    <div className="w-full flex justify-between items-center">
                      <span className="text-xs font-normal">Guests</span>
                      <span className="text-sm font-medium">
                        2 Adults and 1 Child
                      </span>
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
                    title="Amanda Chavez"
                    subTitle={"amnadachaved@gmail.com"}
                    image="/userDashboard/cimg.png"
                  />
                  <ProfileBadge
                    size="custom"
                    title="Phone"
                    subTitle={"+90 384 123 4567"}
                    icon={<PhoneIcon color="rgba(0, 0, 0, 0.5)" />}
                  />
                  <ProfileBadge
                    size="custom"
                    title="Email"
                    subTitle={"info@adventuretours.com"}
                    icon={<MailIcon color="rgba(0, 0, 0, 0.5)" />}
                  />
                  <ProfileBadge
                    size="custom"
                    title="Location"
                    subTitle={"Cappadocia,Turkey"}
                    icon={<LocationIcon color="rgba(0, 0, 0, 0.5)" />}
                  />
                </div>
              </BoxProviderWithName>
            </div>
            <div className="col-span-10 md:col-span-6 flex flex-col justify-start items-start gap-3.5">
              <BoxProviderWithName className="text-base" name="Price Breakdown">
                <div className="w-full flex-col flex justify-start items-start gap-1">
                  <div className="w-full flex justify-start items-center gap-8">
                    <span className="text-base font-normal">
                      Payment status:
                    </span>
                    <StatusBadge status="Paid" />
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-base font-medium">Base Price: </span>
                    <span className="text-base font-medium">
                      €60 × 5 Guests = €300
                    </span>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-base font-medium">Total Paid: </span>
                    <span className="text-base font-medium">€300</span>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-base font-medium">
                      Commission (Platform 15%):
                    </span>
                    <span className="text-base font-medium">€200</span>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-base font-medium">Net Revenue: </span>
                    <span className="text-base font-medium">€2000</span>
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
