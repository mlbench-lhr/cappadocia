"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import {
  CancellationPolicyIcon,
  ClockIcon,
  CheckIcon,
  Vehicle2Icon,
  WorldIcon,
  CrossIcon,
  LocationIcon,
  PaymentIcon,
} from "@/public/allIcons/page";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
import AddressLocationSelector, { LocationData } from "@/components/map";
import ImageGallery from "@/app/(Protected)/explore/detail/[id]/ImageGallery";
import RejectVendorDialog from "@/components/RejectVendorDialog";
import { VendorDetails } from "@/lib/mongodb/models/User";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  ToursAndActivity,
  ToursAndActivityWithVendor,
} from "@/lib/mongodb/models/ToursAndActivity";

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
    status: "paid" | "pending" | "Failed";
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

export interface UserResponse {
  id: string;
  _id: string;

  email: string;
  fullName: string;
  phoneNumber: string;
  avatar: string | null;
  googleId: string | null;
  password: string | null;

  role: string;
  isRoleVerified: boolean;
  isEmailVerified: boolean;

  roleRejected: {
    isRoleRejected: boolean;
    reason?: string;
  };

  emailVerificationOTP: string | null;
  emailVerificationOTPExpires: string | null;

  resetPasswordOTP: string | null;
  resetPasswordOTPExpires: string | null;

  dataUpdated: boolean;

  vendorDetails?: VendorDetails; // ← short and clean

  createdAt: string;
  updatedAt: string;
  __v?: number;
}

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

  const [data, setData] = useState<ToursAndActivityWithVendor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  console.log("data?.vendor?.vendorDetails?.address-----", data);

  const { id }: { id: string } = useParams();
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/toursAndActivity/detail/${id}`);
        console.log("response----", response);

        if (response.data?.data) {
          setData(response.data?.data);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, []);

  if (loading) {
    return <BasicStructureWithName name="">Loading....</BasicStructureWithName>;
  }

  return (
    <BasicStructureWithName name="Details" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit pb-8">
        <BoxProviderWithName noBorder={true}>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <h1 className="text-[20px] md:text-[26px] font-semibold mt-2">
              Blue Tour – Hidden Cappadocia
            </h1>
            <ImageGallery imagesParam={data?.uploads || []} />
            <BoxProviderWithName
              name="Trip Description:"
              className="text-base mt-2"
            >
              <span className="text-[14px] fot-normal leading-[14px]">
                {data?.description}
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
                      subTitle={
                        "TÜRSAB Number: " +
                        data?.vendor?.vendorDetails?.tursabNumber
                      }
                      icon={<CancellationPolicyIcon />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Pick-up Service"
                      subTitle={
                        data?.pickupAvailable
                          ? "Pickup from your location"
                          : "Pickup service not available"
                      }
                      icon={<Vehicle2Icon />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Tour Duration"
                      subTitle={data?.duration + " hours"}
                      icon={<ClockIcon color="#D8018D" size={20} />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Languages Offered"
                      subTitle={data?.languages?.join(", ") || ""}
                      icon={<WorldIcon />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Payment Options"
                      subTitle={"Book Now, Pay Later Available"}
                      icon={<PaymentIcon />}
                    />
                  </div>
                </BoxProviderWithName>
              </div>
            </BoxProviderWithName>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
              <BoxProviderWithName name="What’s Included" className="text-base">
                <div className="w-full flex-col flex justify-start items-start gap-5">
                  {data?.included.map((item, index) => (
                    <IconAndTextTab2
                      key={index}
                      icon={<CheckIcon />}
                      text={item}
                      textClasses="text-black text-[14px] font-normal"
                    />
                  ))}
                </div>
              </BoxProviderWithName>
              <BoxProviderWithName
                name="Not Included in the Package:"
                className="text-base"
              >
                <div className="w-full flex-col flex justify-start items-start gap-5">
                  {data?.notIncluded.map((item, index) => (
                    <IconAndTextTab2
                      key={index}
                      icon={<CrossIcon />}
                      text={item}
                      textClasses="text-black text-[14px] font-normal"
                    />
                  ))}
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
                    {data?.itinerary.map((item, index) => (
                      <IconAndTextTab2
                        icon={<LocationIconWithPadding />}
                        text={item}
                        textClasses="text-black text-[14px] font-normal pt-2"
                        alignClass=" items-start "
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full col-span-1">
                  {data?.vendor?.vendorDetails?.address && (
                    <AddressLocationSelector
                      value={data?.vendor?.vendorDetails?.address}
                      onChange={(data) => {
                        setLocation1(data);
                      }}
                      readOnly={true}
                      label="Enter Your Business Address"
                      placeholder="Type address or click on map"
                    />
                  )}
                </div>
              </div>
            </BoxProviderWithName>
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
