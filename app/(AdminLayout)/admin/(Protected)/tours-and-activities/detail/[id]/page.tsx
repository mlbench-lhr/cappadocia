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
import AddressLocationSelector from "@/components/map";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import ExplorePageSkeleton from "@components/Skeletons/ExplorePageSkeleton";
import { TextAreaInputComponent } from "@/components/SmallComponents/InputComponents";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import UpdatableImageGallery from "@/components/UpdatableImageGallery";
import { uploadMultipleFiles } from "@/lib/utils/upload";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
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
  const [editDescription, setEditDescription] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [description, setDescription] = useState<string>("");
  useEffect(() => {
    setDescription(data?.description || "");
  }, [data?.description]);
  const [uploads, setUploads] = useState<string[]>();
  useEffect(() => {
    setUploads(data?.uploads || []);
  }, [data?.uploads]);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

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

  const updateActivity = async (
    data: { description: string } | { uploads: string[] }
  ) => {
    try {
      setUpdateLoading(true);
      await axios.put(`/api/toursAndActivity/update/${id}`, data);
      setUpdateLoading(false);
      setEditDescription(false);
    } catch (error) {
      console.log("err---", error);
    }
  };

  if (loading) {
    return <ExplorePageSkeleton />;
  }
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !uploads) return;
    if (uploads.length + files.length > 10) {
      setUploadError("Maximum 10 images allowed");
      return;
    }
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image size should be less than 5MB.");
        return;
      }
    }
    setIsUploading(true);
    setUploadError("");
    try {
      const urls = await uploadMultipleFiles(Array.from(files), "uploads");
      setUploads(urls);
      updateActivity({ uploads: urls });
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <BasicStructureWithName name="Details" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit pb-8">
        <BoxProviderWithName noBorder={true}>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-[20px] md:text-[26px] font-semibold mt-2">
                {data?.title}
              </h1>
              <label htmlFor="document-upload">
                {isUploading ? (
                  "Saving..."
                ) : (
                  <Pencil className="cursor-pointer" size={14} />
                )}
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.svg"
                onChange={handleFileSelect}
                disabled={isUploading || (uploads && uploads?.length >= 10)}
                className="hidden"
                id="document-upload"
                multiple
              />
            </div>
            <UpdatableImageGallery
              imagesParam={uploads || []}
              isUploading={isUploading}
            />
            <BoxProviderWithName
              name="Trip Description:"
              className="text-base mt-2"
              rightSideComponent={
                editDescription ? (
                  <Button
                    variant={"main_green_button"}
                    size={"sm"}
                    onClick={() => {
                      updateActivity({
                        description: description,
                      });
                    }}
                    loading={updateLoading}
                  >
                    Save
                  </Button>
                ) : (
                  <Pencil
                    className="cursor-pointer"
                    size={14}
                    onClick={() => {
                      setEditDescription(true);
                    }}
                  />
                )
              }
            >
              {editDescription ? (
                <TextAreaInputComponent
                  label={""}
                  placeholder={"Edit the description"}
                  value={description}
                  onChange={setDescription}
                />
              ) : (
                <span className="text-[14px] fot-normal leading-[14px]">
                  {description}
                </span>
              )}
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
                  {data?.vendor?.vendorDetails?.address && (
                    <AddressLocationSelector
                      value={data?.vendor?.vendorDetails?.address}
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
        <div className="flex gap-3" />
      </div>
    </BasicStructureWithName>
  );
}
