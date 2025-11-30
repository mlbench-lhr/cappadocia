"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
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
  PaymentIcon,
} from "@/public/allIcons/page";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
import AddressLocationSelector, { LocationData } from "@/components/map";
import ImageGallery from "./ImageGallery";
import { useParams } from "next/navigation";
import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import axios from "axios";
import { AlternativeOptions } from "./AlternativeOptions";
import { AvailabilityFilter } from "./AvailabilityFilter";
import Link from "next/link";
import { FavoriteButton } from "@/components/SmallComponents/FavoriteButton";
import ExplorePageSkeleton from "@/components/Skeletons/ExplorePageSkeleton";
import ReviewSection from "./ReviewSection";

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
  const [data, setData] = useState<ToursAndActivityWithVendor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkAvailabilityToggle, setCheckAvailabilityToggle] =
    useState<boolean>(false);

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

  if (!data || loading) {
    return <ExplorePageSkeleton />;
  }
  return (
    <BasicStructureWithName name="Details" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit pb-8">
        <BoxProviderWithName noBorder={true}>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="w-full flex justify-between items-center">
              <Link href={`/explore/vendor/detail/${data.vendor._id}`}>
                <ProfileBadge
                  isTitleLink={true}
                  size="medium"
                  title={data?.vendor?.vendorDetails?.companyName}
                  subTitle={
                    "TÜRSAB Number: " +
                    data?.vendor?.vendorDetails?.tursabNumber
                  }
                  image={data?.vendor?.avatar || "/placeholderDp.png"}
                />
              </Link>
              <div className="drop-shadow-lg w-fit h-fit">
                <FavoriteButton _id={id} />
              </div>
            </div>
            <h1 className="text-[20px] md:text-[26px] font-semibold mt-2">
              {data.title}
            </h1>
            <ImageGallery imagesParam={data?.uploads} />
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
                      title={data?.vendor?.vendorDetails?.companyName || ""}
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
                <BoxProviderWithName className="text-base !p-0" noBorder={true}>
                  <div className="w-full bg-secondary rounded-2xl border px-2 md:px-3.5 py-3 flex flex-col justify-start items-start gap-0 h-fit">
                    <span className="text-[12px] font-normal text-[#6E7070]">
                      From
                    </span>
                    <span className="text-[20px] md:text-[26px] font-semibold text-primary">
                      ${data?.slots?.[0]?.adultPrice}
                    </span>
                    <span className="text-[12px] font-normal text-[#6E7070]">
                      /Person
                    </span>
                    <Button
                      variant={"main_green_button"}
                      className="mt-4"
                      onClick={() => {
                        setCheckAvailabilityToggle(true);
                      }}
                      asChild
                    >
                      <Link href={"#checkAvailabilityToggle"}>
                        Check availability
                      </Link>
                    </Button>
                  </div>
                </BoxProviderWithName>
              </div>
            </BoxProviderWithName>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
              <BoxProviderWithName name="What’s Included" className="text-base">
                <div className="w-full flex-col flex justify-start items-start gap-5">
                  {data?.included?.map((item, index) => (
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
                  {data?.notIncluded?.map((item, index) => (
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
                        key={index}
                        icon={<LocationIconWithPadding />}
                        text={item}
                        textClasses="text-black text-[14px] font-normal pt-2"
                        alignClass=" items-start "
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full col-span-1">
                  <AddressLocationSelector
                    value={data?.vendor?.vendorDetails?.address}
                    readOnly={true}
                    label="Enter Your Business Address"
                    placeholder="Type address or click on map"
                  />
                </div>
              </div>
            </BoxProviderWithName>
            <div className="w-full" id="checkAvailabilityToggle">
              {checkAvailabilityToggle && <AvailabilityFilter />}
            </div>
            <AlternativeOptions />
            <ReviewSection type="activity" />
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
