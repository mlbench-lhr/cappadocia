"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LocationIcon,
  StarIcon,
  PhoneIcon,
  MailIcon,
} from "@/public/allIcons/page";
import AddressLocationSelector from "@/components/map";
import ImageGallery from "@/app/(Protected)/explore/detail/[id]/ImageGallery";
import LightboxProvider from "@/components/providers/LightBoxProvider";
import { useParams } from "next/navigation";
import axios from "axios";
import { VendorDetailsType } from "@/lib/types/vendor";
import { timeSince } from "@/lib/helper/timeFunctions";
import VendorProfileSkeleton from "@/components/Skeletons/VendorProfileSkeleton";
import ReviewSection from "../../../detail/[id]/ReviewSection";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const [data, setData] = useState<VendorDetailsType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { id }: { id: string } = useParams();
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/vendors/detail/${id}`);
        console.log("response----", response);

        if (response.data?.user) {
          setData(response.data?.user);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, []);

  if (!data || loading) {
    return <VendorProfileSkeleton />;
  }

  return (
    <BasicStructureWithName name="Vendor Profile" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit pb-8">
        <BoxProviderWithName noBorder={true}>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="w-full overflow-hidden h-[320px] relative">
              <LightboxProvider
                images={[
                  data.vendorDetails.cover || "/coverPicPlaceholder.png",
                ]}
              >
                <Image
                  src={data.vendorDetails.cover || "/coverPicPlaceholder.png"}
                  alt=""
                  width={100}
                  height={100}
                  className="w-full h-[280px] object-cover object-center rounded-[10px]"
                />
              </LightboxProvider>
              <LightboxProvider images={[data.avatar || "/placeholderDp.png"]}>
                <Image
                  src={data.avatar || "/placeholderDp.png"}
                  alt=""
                  width={100}
                  height={100}
                  className="h-[90px] md:h-[180px] w-[90px] md:w-[180px] object-cover object-center rounded-full absolute left-4 sm:left-8 lg:left-14 bottom-0 ring-2 ring-white"
                />
              </LightboxProvider>
            </div>
            <div className="w-full flex flex-col md:flex-row justify-between items-start -mt-10 sm:-mt-8 md:mt-3 lg:-mt-8 pb-4 gap-3 md:gap-0">
              <div className="flex flex-col justify-center items-start ps-[110px] sm:ps-[140px] w-full md:ps-0 lg:ps-[230px]">
                <h2 className="text-lg sm:text-xl md:text-[26px] font-medium ">
                  {data.vendorDetails.companyName}
                </h2>
                <h2 className="text-xs sm:text-sm md:text-base font-medium text-black/70">
                  TÜRSAB Number: {data.vendorDetails.tursabNumber}
                </h2>
              </div>
              <Button
                variant={"main_green_button"}
                className="w-full md:w-[160px]"
                asChild
              >
                <Link href={`/messages?sender=${data._id}`}>Chat</Link>
              </Button>
            </div>
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3.5">
              <div className="flex flex-col justify-center items-center border rounded-2xl h-[100px] md:h-[130px]">
                <h2 className="text-2xl md:text-[37px] font-medium ">
                  {data.activeTours}
                </h2>
                <h2 className="text-sm md:text-base font-medium ">
                  active Tours
                </h2>
              </div>
              <div className="flex flex-col justify-center items-center border rounded-2xl h-[100px] md:h-[130px]">
                <h2 className="text-2xl md:text-[37px] font-medium ">
                  {data.totalBookings}
                </h2>
                <h2 className="text-sm md:text-base font-medium ">
                  Total Bookings
                </h2>
              </div>
              <div className="flex flex-col justify-center items-center border rounded-2xl h-[100px] md:h-[130px]">
                <h2 className="text-2xl md:text-[37px] font-medium ">
                  {data.vendorDetails.rating?.average?.toFixed(1)}
                </h2>
                <h2 className="text-sm md:text-base font-medium ">
                  Average Rating
                </h2>
              </div>
              <div className="flex flex-col justify-center items-center border rounded-2xl h-[100px] md:h-[130px]">
                <h2 className="text-2xl md:text-[37px] font-medium ">
                  {timeSince(data.createdAt).value}
                </h2>
                <h2 className="text-sm md:text-base font-medium ">
                  {timeSince(data.createdAt).unit} active
                </h2>
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-3.5">
              <div className="col-span-1 md:col-span-3 flex flex-col justify-start items-start gap-3.5">
                <BoxProviderWithName name="About Us" className="text-base ">
                  <div className="text-sm md:text-base text-black/50 font-normal w-full">
                    {data.vendorDetails.aboutUs}
                  </div>
                </BoxProviderWithName>
                <BoxProviderWithName
                  name="Languages Offered"
                  className="text-base flex-1 "
                >
                  <div className="text-sm md:text-base text-black/50 font-normal w-full flex-col flex justify-start items-start gap-3.5">
                    {data.vendorDetails.languages.map((item, index) => (
                      <span key={index}>{item}</span>
                    ))}
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
                      subTitle={data.phoneNumber}
                      icon={<PhoneIcon color="rgba(0, 0, 0, 0.5)" />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Email"
                      subTitle={data.email}
                      icon={<MailIcon color="rgba(0, 0, 0, 0.5)" />}
                    />
                    <ProfileBadge
                      size="custom"
                      title="Location"
                      subTitle={data.vendorDetails.address.address}
                      icon={<LocationIcon color="rgba(0, 0, 0, 0.5)" />}
                    />
                    <AddressLocationSelector
                      value={data.vendorDetails.address}
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
              <ImageGallery imagesParam={data.latestUploads} />
            </BoxProviderWithName>
            <ReviewSection type="vendor" />
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
