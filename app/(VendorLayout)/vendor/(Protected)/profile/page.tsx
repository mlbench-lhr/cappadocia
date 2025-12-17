"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LocationIcon, PhoneIcon, MailIcon } from "@/public/allIcons/page";
import AddressLocationSelector from "@/components/map";
import ImageGallery from "@/app/(Protected)/explore/detail/[id]/ImageGallery";
import LightboxProvider from "@/components/providers/LightBoxProvider";
import { useParams } from "next/navigation";
import axios from "axios";
import { VendorDetailsType } from "@/lib/types/vendor";
import { timeSince } from "@/lib/helper/timeFunctions";
import VendorProfileSkeleton from "@/components/Skeletons/VendorProfileSkeleton";
import { uploadFile } from "@/lib/utils/upload";
import { updateUser } from "@/lib/store/slices/authSlice";
import { Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewSection from "@/app/(Protected)/explore/detail/[id]/ReviewSection";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const userData = useAppSelector((s) => s.auth.user);
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<"avatar" | "cover" | null>(
    null
  );

  const [data, setData] = useState<VendorDetailsType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { id }: { id: string } = useParams();
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/vendors/detail/${userData?.id}`);
        console.log("response----", response);

        if (response.data?.user) {
          setData(response.data?.user);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    if (userData?.id) {
      getData();
    }
  }, [userData?.id]);

  const handleAvatarUpload = async (
    payload:
      | { id?: string; avatar: string }
      | { id?: string; vendorDetails: { cover: string } }
  ) => {
    console.log("url", payload);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    console.log("responseData------", responseData);
    dispatch(updateUser(responseData?.user));
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit for avatars)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setLoadingType(type);
      const url = await uploadFile(file, "avatar");
      console.log("url-----", url);
      await handleAvatarUpload(
        type === "avatar"
          ? {
              id: userData?.id,
              avatar: url,
            }
          : {
              id: userData?.id,
              vendorDetails: {
                cover: url,
              },
            }
      );
      setLoadingType(null);
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };
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
                  userData?.vendorDetails?.cover || "/coverPicPlaceholder.png",
                ]}
              >
                {loadingType === "cover" ? (
                  <Skeleton className="w-full h-[280px] object-cover object-center rounded-[10px]"></Skeleton>
                ) : (
                  <Image
                    src={
                      userData?.vendorDetails?.cover ||
                      "/coverPicPlaceholder.png"
                    }
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-[280px] object-cover object-center rounded-[10px]"
                  />
                )}
              </LightboxProvider>
              <label
                className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer bottom-14 right-2 shadow-lg"
                htmlFor="document-upload-cover"
              >
                <Camera size={20} className="" color="#B32053" />
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  handleFileSelect(e, "cover");
                }}
                disabled={loadingType ? true : false}
                className="hidden"
                id="document-upload-cover"
              />
              <div className="h-[90px] md:h-[180px] w-[90px] md:w-[180px] rounded-full absolute left-4 sm:left-8 lg:left-14 bottom-0">
                <LightboxProvider
                  images={[data.avatar || "/placeholderDp.png"]}
                >
                  {loadingType === "avatar" ? (
                    <Skeleton className="h-[90px] md:h-[180px] w-[90px] md:w-[180px] object-cover object-center rounded-full ring-2 ring-white"></Skeleton>
                  ) : (
                    <Image
                      src={userData?.avatar || "/placeholderDp.png"}
                      alt=""
                      width={100}
                      height={100}
                      className="h-[90px] md:h-[180px] w-[90px] md:w-[180px] object-cover object-center rounded-full ring-2 ring-white"
                    />
                  )}
                </LightboxProvider>
                <label
                  className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer bottom-4 right-2 shadow-lg"
                  htmlFor="document-upload"
                >
                  <Camera size={20} className="" color="#B32053" />
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    handleFileSelect(e, "avatar");
                  }}
                  disabled={loadingType ? true : false}
                  className="hidden"
                  id="document-upload"
                />
              </div>
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
              {/* <Button
                variant={"main_green_button"}
                className="w-full md:w-[160px]"
                asChild
              >
                <Link href={`/messages?sender=${data._id}`}>Chat</Link>
              </Button> */}
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
            <ReviewSection type="vendor" idFromProp={userData?.id} />
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
