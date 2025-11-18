"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { TourAndActivityCard } from "@/components/TourAndActivityCard";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Link from "next/link";
import { exploreProps } from "../../../dashboard/page";
import AddressLocationSelector, { LocationData } from "@/components/map";

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
  const [location1, setLocation1] = useState<LocationData>({
    address: "1600 Amphitheatre Parkway, Mountain View, CA",
    coordinates: { lat: 37.4224764, lng: -122.0842499 },
  });

  return (
    <BasicStructureWithName name="Vendor Profile" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit pb-8">
        <BoxProviderWithName noBorder={true}>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="w-full overflow-hidden h-[320px] relative">
              <Image
                src={"/userDashboard/vcimg.png"}
                alt=""
                width={100}
                height={100}
                className="w-full h-[280px] object-cover object-center rounded-[10px]"
              />
              <Image
                src={"/userDashboard/img2.png"}
                alt=""
                width={100}
                height={100}
                className="h-[90px] md:h-[180px] w-[90px] md:w-[180px] object-cover object-center rounded-full absolute left-4 sm:left-8 lg:left-14 bottom-0 ring-2 ring-white"
              />
            </div>
            <div className="w-full flex flex-col md:flex-row justify-between items-start -mt-10 sm:-mt-8 md:mt-3 lg:-mt-8 pb-4 gap-3 md:gap-0">
              <div className="flex flex-col justify-center items-start ps-[110px] sm:ps-[140px] w-full md:ps-0 lg:ps-[230px]">
                <h2 className="text-lg sm:text-xl md:text-[26px] font-medium ">
                  Adventure Tours Co.
                </h2>
                <h2 className="text-xs sm:text-sm md:text-base font-medium text-black/70">
                  TÜRSAB Number: 12345
                </h2>
              </div>
              <Button
                variant={"main_green_button"}
                className="w-full md:w-[160px]"
              >
                Chat
              </Button>
            </div>
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3.5">
              <div className="flex flex-col justify-center items-center border rounded-2xl h-[100px] md:h-[130px]">
                <h2 className="text-2xl md:text-[37px] font-medium ">12</h2>
                <h2 className="text-sm md:text-base font-medium ">
                  Active Tours
                </h2>
              </div>
              <div className="flex flex-col justify-center items-center border rounded-2xl h-[100px] md:h-[130px]">
                <h2 className="text-2xl md:text-[37px] font-medium ">412</h2>
                <h2 className="text-sm md:text-base font-medium ">
                  Total Bookings
                </h2>
              </div>
              <div className="flex flex-col justify-center items-center border rounded-2xl h-[100px] md:h-[130px]">
                <h2 className="text-2xl md:text-[37px] font-medium ">4.2</h2>
                <h2 className="text-sm md:text-base font-medium ">
                  Average Rating
                </h2>
              </div>
              <div className="flex flex-col justify-center items-center border rounded-2xl h-[100px] md:h-[130px]">
                <h2 className="text-2xl md:text-[37px] font-medium ">8</h2>
                <h2 className="text-sm md:text-base font-medium ">
                  Years Active
                </h2>
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-3.5">
              <div className="col-span-1 md:col-span-3 flex flex-col justify-start items-start gap-3.5">
                <BoxProviderWithName name="About Us" className="text-base ">
                  <div className="text-sm md:text-base text-black/50 font-normal w-full">
                    Our mission is to provide safe, enjoyable, and memorable
                    travel experiences. With over 15 years of experience, we
                    have served more than 10,000 happy travelers.We are a
                    licensed and registered business with years of experience in
                    the travel and tourism industry. Our services are designed
                    for travelers who value professionalism, transparency, and
                    reliability.we focus on delivering the best customer
                    satisfaction. From the moment you book with us until the end
                    of your journey, we ensure a smooth and enjoyable
                    experience.
                  </div>
                </BoxProviderWithName>
                <BoxProviderWithName
                  name="Languages Offered"
                  className="text-base flex-1 "
                >
                  <div className="text-sm md:text-base text-black/50 font-normal w-full flex-col flex justify-start items-start gap-3.5">
                    <span>English</span>
                    <span>Chinese</span>
                    <span>Turkish</span>
                  </div>
                </BoxProviderWithName>
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col justify-start items-start gap-3.5">
                <BoxProviderWithName
                  className="text-base"
                  name="Contact Information"
                >
                  <div className="w-full flex-col flex justify-start items-start gap-5">
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
                  </div>
                </BoxProviderWithName>
              </div>
            </div>
            <BoxProviderWithName name="Gallery" className=" mt-4">
              <div className="grid grid-cols-10 h-fit lg:h-[360px] gap-2 lg:gap-3.5">
                <div className="col-span-5 lg:col-span-4 rounded-[14px] overflow-hidden h-[200px] lg:h-full">
                  <Image
                    src={"/userDashboard/img20.png"}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-full lg:h-full object-cover object-center"
                  />
                </div>
                <div className="col-span-5 lg:col-span-2 rounded-[14px] overflow-hidden h-[200px] lg:h-full">
                  <Image
                    src={"/userDashboard/img21.png"}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-full lg:h-full object-cover object-center"
                  />
                </div>
                <div className="col-span-10 bg-red-40 lg:col-span-4 grid lg:grid-cols-none grid-cols-2 grid-rows-none lg:grid-row-2 rounded-[14px] overflow-hidden h-[200px] lg:h-full gap-x-2 lg:gap-x-0 gap-y-0 lg:gap-y-3.5">
                  <div className="row-span-2 lg:row-span-1 rounded-[14px] overflow-hidden h-[200px] lg:h-full col-span-1">
                    <Image
                      src={"/userDashboard/img22.png"}
                      alt=""
                      width={100}
                      height={100}
                      className="w-full h-full lg:h-full object-cover object-center"
                    />
                  </div>
                  <div className="row-span-2 lg:row-span-1 rounded-[14px] overflow-hidden h-[200px] lg:h-full col-span-1">
                    <Image
                      src={"/userDashboard/img23.png"}
                      alt=""
                      width={100}
                      height={100}
                      className="w-full h-full lg:h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName
              name="Reviews"
              noBorder={true}
              className="!p-0 mt-4"
              rightSideLink="/explore"
              rightSideLabel="See All"
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="col-span-1 rounded-2xl px-2 md:px-3.5 py-3 bg-secondary border">
                  <div className="flex justify-start items-center w-full gap-3">
                    <span className="text-[14px] font-medium text-primary">
                      5
                    </span>
                    <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                      <div className="w-[70%] relative rounded-full overflow-hidden h-[8px] bg-primary"></div>
                    </div>
                  </div>
                  <div className="flex justify-start items-center w-full gap-3">
                    <span className="text-[14px] font-medium text-primary">
                      4
                    </span>
                    <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                      <div className="w-[50%] relative rounded-full overflow-hidden h-[8px] bg-primary"></div>
                    </div>
                  </div>
                  <div className="flex justify-start items-center w-full gap-3">
                    <span className="text-[14px] font-medium text-primary">
                      3
                    </span>
                    <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                      <div className="w-[60%] relative rounded-full overflow-hidden h-[8px] bg-primary"></div>
                    </div>
                  </div>
                  <div className="flex justify-start items-center w-full gap-3">
                    <span className="text-[14px] font-medium text-primary">
                      2
                    </span>
                    <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                      <div className="w-[30%] relative rounded-full overflow-hidden h-[8px] bg-primary"></div>
                    </div>
                  </div>
                  <div className="flex justify-start items-center w-full gap-3">
                    <span className="text-[14px] font-medium text-primary">
                      1
                    </span>
                    <div className="w-[calc(100%-22px)] relative rounded-full overflow-hidden h-[8px] bg-[#E8D3D3]">
                      <div className="w-[20%] relative rounded-full overflow-hidden h-[8px] bg-primary"></div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 rounded-2xl px-2 md:px-3.5 py-3 bg-secondary border flex flex-col justify-center items-center gap-2">
                  <h1 className="text-4xl md:text-[56px] font-semibold text-primary">
                    4.0
                  </h1>
                  <div className="w-fit flex justify-start items-center gap-1">
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </div>
                  <span className="text-[14px] font-normal text-black/70">
                    9,676 reviews
                  </span>
                </div>
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName
              name="All Reviews"
              noBorder={true}
              className="!p-0 mt-4"
              rightSideLink="/explore"
              rightSideLabel="See All"
            >
              <div className="w-full flex-col flex justify-start items-center gap-3.5">
                <div className="rounded-2xl px-2 md:px-3.5 py-3 border flex flex-col justify-center items-start gap-2">
                  <div className="w-full flex justify-between items-center">
                    <ProfileBadge
                      size="medium"
                      title="John D."
                      subTitle={"Apr 10, 2024"}
                      image="/userDashboard/img2.png"
                    />
                    <div className="w-fit flex justify-start items-center gap-1">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <span className="text-[12px] font-medium text-black/60">
                        5
                      </span>
                    </div>
                  </div>
                  <span className="text-[14px] font-normal text-black/70 leading-[18px]">
                    The The sunrise hot air balloon ride was the absolute
                    highlight of our trip to Cappadocia. The pickup from our
                    hotel was smooth, the driver was punctual, and the staff at
                    the launch site were super professional. Our pilot explained
                    everything clearly, and once we were in the air, it was pure
                    magic — floating over the fairy chimneys with the sun rising
                    behind the valleys. The ride lasted about an hour, which was
                    perfect. After landing, they even served us a small
                    celebratory drink. Highly recommend booking in advance as
                    spots sell out quickly air balloon ride was absolutely
                    magical! Everything was well organized, and the view of
                    Cappadocia at sunrise is something I’ll never forget.
                  </span>
                </div>
                <div className="rounded-2xl px-2 md:px-3.5 py-3 border flex flex-col justify-center items-start gap-2">
                  <div className="w-full flex justify-between items-center">
                    <ProfileBadge
                      size="medium"
                      title="John D."
                      subTitle={"Apr 10, 2024"}
                      image="/userDashboard/img2.png"
                    />
                    <div className="w-fit flex justify-start items-center gap-1">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <span className="text-[12px] font-medium text-black/60">
                        5
                      </span>
                    </div>
                  </div>
                  <span className="text-[14px] font-normal text-black/70 leading-[18px]">
                    The The sunrise hot air balloon ride was the absolute
                    highlight of our trip to Cappadocia. The pickup from our
                    hotel was smooth, the driver was punctual, and the staff at
                    the launch site were super professional. Our pilot explained
                    everything clearly, and once we were in the air, it was pure
                    magic — floating over the fairy chimneys with the sun rising
                    behind the valleys. The ride lasted about an hour, which was
                    perfect. After landing, they even served us a small
                    celebratory drink. Highly recommend booking in advance as
                    spots sell out quickly air balloon ride was absolutely
                    magical! Everything was well organized, and the view of
                    Cappadocia at sunrise is something I’ll never forget.
                  </span>
                </div>
                <Button variant={"outline"} className="text-primary">
                  See more Reviews
                </Button>
              </div>
            </BoxProviderWithName>
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
