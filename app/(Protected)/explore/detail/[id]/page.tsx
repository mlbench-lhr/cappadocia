"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { InvoiceTextBoxes } from "@/components/InvoiceTextBoxes";
import DownloadInvoiceButton from "@/app/(Protected)/invoices/DownloadButton";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CancellationPolicyIcon,
  ClockIcon,
  PaymentIcon,
  CheckIcon,
  Vehicle2Icon,
  VehicleIcon,
  WorldIcon,
  CrossIcon,
  LocationIcon,
  StarIcon,
} from "@/public/sidebarIcons/page";
import {
  IconAndTextTab,
  IconAndTextTab2,
} from "@/components/SmallComponents/IconAndTextTab";
import { exploreProps } from "../../page";
import { TourAndActivityCard } from "@/components/TourAndActivityCard";

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
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit pb-8">
        <BoxProviderWithName noBorder={true}>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <ProfileBadge
              size="medium"
              title="SkyView Balloon Tours"
              subTitle={"TÜRSAB Number: " + 324234}
              image="/userDashboard/img2.png"
            />
            <h1 className="text-[26px] font-semibold mt-2">
              Blue Tour – Hidden Cappadocia
            </h1>
            <div className="grid grid-cols-10 h-fit lg:h-[360px] gap-3.5">
              <div className="col-span-4 rounded-[14px] overflow-hidden">
                <Image
                  src={"/userDashboard/img20.png"}
                  alt=""
                  width={100}
                  height={100}
                  className="w-full h-auto lg:h-full object-cover object-center"
                />
              </div>
              <div className="col-span-2 rounded-[14px] overflow-hidden">
                <Image
                  src={"/userDashboard/img21.png"}
                  alt=""
                  width={100}
                  height={100}
                  className="w-full h-auto lg:h-full object-cover object-center"
                />
              </div>
              <div className="col-span-4 grid grid-row-2 rounded-[14px] overflow-hidden gap-y-3.5">
                <div className="row-span-1 rounded-[14px] overflow-hidden">
                  <Image
                    src={"/userDashboard/img22.png"}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-auto lg:h-full object-cover object-center"
                  />
                </div>
                <div className="row-span-1 rounded-[14px] overflow-hidden">
                  <Image
                    src={"/userDashboard/img23.png"}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-auto lg:h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
            <BoxProviderWithName
              name="Trip Description:"
              className="text-base mt-2"
            >
              <span className="text-[14px] fot-normal leading-[14px]">
                Enjoy a breathtaking sunrise hot air balloon flight over
                Cappadocia’s fairy chimneys, valleys, and rock formations. The
                tour includes hotel pick-up, a light breakfast, and a
                traditional champagne toast after landing.
              </span>
            </BoxProviderWithName>
            <BoxProviderWithName
              name="About this tour:"
              className="text-base !p-0 mt-2"
              noBorder={true}
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <BoxProviderWithName className="text-base">
                  <div className="w-full flex-col flex justify-start items-start gap-5">
                    <ProfileBadge
                      size="custom"
                      title="SkyView Balloon Tours"
                      subTitle={"TÜRSAB Number: " + 324234}
                      icon={<CancellationPolicyIcon />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Pick-up Service"
                      subTitle={"Pickup from you location"}
                      icon={<Vehicle2Icon />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Tour Duration"
                      subTitle={"4 hours"}
                      icon={<ClockIcon color="rgba(0, 0, 0, 0.50)" size={22} />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Languages Offered"
                      subTitle={"English, Turkish, Arabic"}
                      icon={<WorldIcon />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Payment Options"
                      subTitle={"Book Now, Pay Later Available"}
                      icon={<WorldIcon />}
                    />
                  </div>
                </BoxProviderWithName>
                <BoxProviderWithName className="text-base !p-0" noBorder={true}>
                  <div className="w-full bg-secondary rounded-2xl border px-0 md:px-3.5 py-3 flex flex-col justify-start items-start gap-0 h-fit">
                    <span className="text-[12px] font-normal text-[#6E7070]">
                      From
                    </span>
                    <span className="text-[26px] font-semibold text-primary">
                      $569.00
                    </span>
                    <span className="text-[12px] font-normal text-[#6E7070]">
                      /Person
                    </span>
                    <Button variant={"main_green_button"} className="mt-4">
                      Check availability
                    </Button>
                  </div>
                </BoxProviderWithName>
              </div>
            </BoxProviderWithName>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
              <BoxProviderWithName name="What’s Included" className="text-base">
                <div className="w-full flex-col flex justify-start items-start gap-5">
                  <IconAndTextTab2
                    icon={<CheckIcon />}
                    text={`Professional English-speaking guide`}
                    textClasses="text-black text-[14px] font-normal"
                  />
                  <IconAndTextTab2
                    icon={<CheckIcon />}
                    text={`Hotel pick-up & drop-off (Cappadocia area)`}
                    textClasses="text-black text-[14px] font-normal"
                  />
                  <IconAndTextTab2
                    icon={<CheckIcon />}
                    text={`Air-conditioned transportation`}
                    textClasses="text-black text-[14px] font-normal"
                  />
                  <IconAndTextTab2
                    icon={<CheckIcon />}
                    text={`Lunch at a local restaurant`}
                    textClasses="text-black text-[14px] font-normal"
                  />
                  <IconAndTextTab2
                    icon={<CheckIcon />}
                    text={`Bottled water`}
                    textClasses="text-black text-[14px] font-normal"
                  />
                </div>
              </BoxProviderWithName>
              <BoxProviderWithName
                name="Not Included in the Package:"
                className="text-base"
              >
                <div className="w-full flex-col flex justify-start items-start gap-5">
                  <IconAndTextTab2
                    icon={<CrossIcon />}
                    text={`Professional English-speaking guide`}
                    textClasses="text-black text-[14px] font-normal"
                  />
                  <IconAndTextTab2
                    icon={<CrossIcon />}
                    text={`Hotel pick-up & drop-off (Cappadocia area)`}
                    textClasses="text-black text-[14px] font-normal"
                  />
                  <IconAndTextTab2
                    icon={<CrossIcon />}
                    text={`Air-conditioned transportation`}
                    textClasses="text-black text-[14px] font-normal"
                  />
                  <IconAndTextTab2
                    icon={<CrossIcon />}
                    text={`Lunch at a local restaurant`}
                    textClasses="text-black text-[14px] font-normal"
                  />
                  <IconAndTextTab2
                    icon={<CrossIcon />}
                    text={`Bottled water`}
                    textClasses="text-black text-[14px] font-normal"
                  />
                </div>
              </BoxProviderWithName>
            </div>
            <BoxProviderWithName
              name="Itinerary"
              noBorder={true}
              className="!p-0 mt-4"
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="relative w-full h-[490px] bg-red-00 flex flex-col justify-between items-start">
                  <div className="absolute left-2.5 border-[1px] top-3 h-[90%] border-black/70 border-dashed"></div>
                  <div className="relative w-full h-full bg-red-00 flex flex-col justify-between items-start">
                    <IconAndTextTab2
                      icon={<LocationIconWithPadding />}
                      text={`Pickup`}
                      textClasses="text-black text-[14px] font-normal pt-2"
                      alignClass=" items-start "
                    />
                    <IconAndTextTab2
                      icon={<LocationIconWithPadding />}
                      text={`Step into history at the Göreme Open-Air Museum, a UNESCO World Heritage site featuring ancient rock-cut churches and frescoes. Explore the heart of Cappadocia’s monastic life carved into volcanic stone.`}
                      textClasses="text-black text-[14px] font-normal pt-2"
                      alignClass=" items-start "
                    />
                    <IconAndTextTab2
                      icon={<LocationIconWithPadding />}
                      text={`Pasabag (Monk’s Valley)`}
                      textClasses="text-black text-[14px] font-normal pt-2"
                      alignClass=" items-start "
                    />
                    <IconAndTextTab2
                      icon={<LocationIconWithPadding />}
                      text={`Lunch at local restaurant`}
                      textClasses="text-black text-[14px] font-normal pt-2"
                      alignClass=" items-start "
                    />
                    <IconAndTextTab2
                      icon={<LocationIconWithPadding />}
                      text={`Drop at Same same pickup point`}
                      textClasses="text-black text-[14px] font-normal pt-2"
                      alignClass=" items-start "
                    />
                  </div>
                </div>
                <div className="w-full col-span-1">
                  <Image
                    src={"/userDashboard/map.png"}
                    alt=""
                    width={300}
                    height={490}
                    className="w-full h-[490px] rounded-xl object-cover"
                  />
                </div>
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName
              name="Alternative Options"
              noBorder={true}
              className="!p-0 mt-4"
              rightSideLink="/explore"
              rightSideLabel="See All"
            >
              <div className="w-full space-y-3 grid grid-cols-12 gap-3">
                {exploreData.map((item) => (
                  <TourAndActivityCard item={item} />
                ))}
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
                <div className="col-span-1 rounded-2xl px-0 md:px-3.5 py-3 bg-secondary border">
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
                <div className="col-span-1 rounded-2xl px-0 md:px-3.5 py-3 bg-secondary border flex flex-col justify-center items-center gap-2">
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
              name="Reviews"
              noBorder={true}
              className="!p-0 mt-4"
              rightSideLink="/explore"
              rightSideLabel="See All"
            >
              <div className="w-full flex-col flex justify-start items-center gap-3.5">
                <div className="rounded-2xl px-0 md:px-3.5 py-3 border flex flex-col justify-center items-start gap-2">
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
                <div className="rounded-2xl px-0 md:px-3.5 py-3 border flex flex-col justify-center items-start gap-2">
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
