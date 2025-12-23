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
import UpdatableImageGallery from "@/components/UpdatableImageGallery";
import { TextAreaInputComponent } from "@/components/SmallComponents/InputComponents";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMultipleFiles } from "@/lib/utils/upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { VendorDetails } from "@/lib/mongodb/models/User";
import axios from "axios";
import { useParams } from "next/navigation";
import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import BookingPageSkeleton from "@/components/Skeletons/BookingPageSkeleton";
import Swal from "sweetalert2";
import { Switch } from "@/components/ui/switch";

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

  const [data, setData] = useState<ToursAndActivityWithVendor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [editCategory, setEditCategory] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [editDescription, setEditDescription] = useState<boolean>(false);
  const [uploads, setUploads] = useState<string[]>([]);
  const [editUploads, setEditUploads] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [refreshData, setRefreshData] = useState<number>(0);

  const { id }: { id: string } = useParams();
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/toursAndActivity/detail/${id}`);
        console.log("response----", response);

        if (response.data?.data) {
          setData(response.data?.data);
          setTitle(response.data?.data?.title || "");
          setCategory(response.data?.data?.category || "");
          setDescription(response.data?.data?.description || "");
          setUploads(response.data?.data?.uploads || []);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, [refreshData]);
  const updateActivity = async (payload: Record<string, any>) => {
    try {
      setUpdateLoading(true);
      await axios.put(`/api/toursAndActivity/update/${id}`, payload);
      setUpdateLoading(false);
      setEditTitle(false);
      setEditCategory(false);
      setEditDescription(false);
    } catch (error) {
      console.log("err---", error);
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <BookingPageSkeleton />;
  }

  return (
    <BasicStructureWithName name="Details" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit pb-8">
        <BoxProviderWithName noBorder={true}>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="w-full flex justify-between items-center">
              {editTitle ? (
                <div className="flex items-center gap-2 w-full max-w-lg">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Edit tour title"
                  />
                  <Button
                    variant={"main_green_button"}
                    size={"sm"}
                    onClick={() => updateActivity({ title })}
                    loading={updateLoading}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <h1 className="text-sm md:text-[20px] font-semibold mt-2 flex-1">
                    {title}
                  </h1>
                  <Pencil
                    className="cursor-pointer"
                    size={14}
                    onClick={() => setEditTitle(true)}
                  />
                </div>
              )}
            </div>
            <div className="w-full flex items-center gap-3 mt-1">
              <BoxProviderWithName
                name="Category"
                className="text-base"
                rightSideComponent={
                  editCategory ? (
                    <Button
                      variant={"main_green_button"}
                      size={"sm"}
                      onClick={() => updateActivity({ category })}
                      loading={updateLoading}
                    >
                      Save
                    </Button>
                  ) : (
                    <Pencil
                      className="cursor-pointer"
                      size={14}
                      onClick={() => setEditCategory(true)}
                    />
                  )
                }
              >
                {editCategory ? (
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tour">Tour</SelectItem>
                      <SelectItem value="Activity">Activity</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-[14px] font-normal leading-[14px]">
                    {category}
                  </span>
                )}
              </BoxProviderWithName>
            </div>
            <div className="w-full flex flex-col gap-2 mt-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="text-sm inline-flex items-center gap-1"
                    onClick={() => setEditUploads((p) => !p)}
                  >
                    <Pencil className="cursor-pointer" size={14} />
                    <span>{editUploads ? "Done" : "Edit"}</span>
                  </button>
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer inline-flex items-center gap-1"
                  >
                    {isUploading ? (
                      <span>Uploading...</span>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Add Images</span>
                      </>
                    )}
                  </label>
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files) return;
                    if (uploads.length + files.length > 10) {
                      setUploadError("Images must be between 4–10.");
                      return;
                    }
                    for (const file of Array.from(files)) {
                      if (file.size > 25 * 1024 * 1024) {
                        setUploadError("Image size should be less than 25MB.");
                        return;
                      }
                    }
                    setIsUploading(true);
                    setUploadError("");
                    try {
                      const urls = await uploadMultipleFiles(
                        Array.from(files),
                        "uploads"
                      );
                      const combined = [...uploads, ...urls];
                      if (combined.length < 4 || combined.length > 10) {
                        setUploadError("Images must be between 4–10.");
                        setIsUploading(false);
                        return;
                      }
                      setUploads(combined);
                      await updateActivity({ uploads: combined });
                    } catch (error) {
                      setUploadError("Upload failed. Please try again.");
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  disabled={isUploading || uploads.length >= 10}
                  className="hidden"
                  id="document-upload"
                  multiple
                />
              </div>
              {uploadError && (
                <span className="text-xs text-red-500">{uploadError}</span>
              )}
            </div>
            <UpdatableImageGallery
              imagesParam={uploads}
              isUploading={isUploading}
              editable={editUploads}
              onRemove={async (index) => {
                const filtered = uploads.filter((_, i) => i !== index);
                if (filtered.length < 4) {
                  setUploadError("Images must be between 4–10.");
                  return;
                }
                try {
                  setUploads(filtered);
                  await updateActivity({ uploads: filtered });
                } catch {
                  setUploadError("Failed to update images.");
                }
              }}
            />
            <BoxProviderWithName
              name="Trip Description:"
              className="text-base mt-2"
              rightSideComponent={
                editDescription ? (
                  <Button
                    variant={"main_green_button"}
                    size={"sm"}
                    onClick={() => updateActivity({ description })}
                    loading={updateLoading}
                  >
                    Save
                  </Button>
                ) : (
                  <Pencil
                    className="cursor-pointer"
                    size={14}
                    onClick={() => setEditDescription(true)}
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
              name="Active status"
              className="text-base mt-2"
              rightSideComponent={
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!data?.active}
                    onCheckedChange={(checked) => {
                      updateActivity({ active: checked });
                      setData((prev) =>
                        prev ? { ...prev, active: checked } : prev
                      );
                    }}
                  />
                  <span className="text-sm">
                    {data?.active ? "Active" : "Inactive"}
                  </span>
                </div>
              }
            >
              <span className="text-[12px] md:text-[14px]">
                Toggle to show or hide this tour from users.
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
                      subTitle={
                        data?.allowPayLater
                          ? "Book Now, Pay Later Available"
                          : "Book Now, Pay Later Not Available"
                      }
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
