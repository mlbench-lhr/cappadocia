"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import {
  RadioInputComponent,
  FormSelectInput,
  FormTextInput,
  TextInputComponent,
  FormTextAreaInput,
} from "@/components/SmallComponents/InputComponents";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { Label } from "@/components/ui/label";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
import { Button } from "@/components/ui/button";
import AddressLocationSelector from "@/components/map";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import {
  addToArray,
  setField,
  updateArrayItem,
  removeArrayItem,
} from "@/lib/store/slices/addbooking";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { uploadFile, uploadMultipleFiles } from "@/lib/utils/upload";
import { removeDocument } from "@/lib/store/slices/vendorSlice";

// Validation schema
const LatLng = z.object({
  lat: z.number(),
  lng: z.number(),
});
export const LocationData = z.object({
  address: z.string().min(1, ""),
  coordinates: LatLng.nullable().refine((v) => v !== null, {
    message: "Select any location from map",
  }),
});

const bookingSchema = z.object({
  selectDate: z.string().min(1, "Please select a date"),
  participants: z
    .string()
    .min(1, "Number of participants is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    }),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  travelers: z
    .array(
      z.object({
        fullName: z.string().min(2, "Full name must be at least 2 characters"),
        dob: z.string().min(1, "Date of birth is required"),
        nationality: z.string().min(2, "Nationality is required"),
        passport: z.string().min(5, "Valid passport/ID number is required"),
      })
    )
    .min(1, "At least one traveler is required"),
  pickupLocation: LocationData.nullable().refine((v) => !v?.coordinates, {
    message: "Select any location from map",
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const bookingState = useAppSelector((s) => s.addBooking);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  console.log("bookingState:", bookingState);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      selectDate: bookingState.selectDate || "",
      participants: bookingState.participants || "",
      email: bookingState.email || "",
      fullName: bookingState.fullName || "",
      phoneNumber: bookingState.phoneNumber || "",
      travelers: bookingState.travelers,
      pickupLocation: bookingState.pickupLocation,
    },
  });

  console.log("errors:", errors);
  // Sync form values with Redux store
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && !name.startsWith("travelers")) {
        dispatch(
          setField({
            field: name as any,
            value: value[name as keyof typeof value],
          })
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const onSubmit = (data: BookingFormData) => {
    console.log("Form submitted:", data);
    // router.push("/bookings/payment");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploading(true);
    try {
      const url = await uploadMultipleFiles([file, file], "avatars");
      console.log("url-----", url);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Upload failed. Please try again.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = (index: number) => {
    dispatch(removeDocument(index));
  };

  return (
    <BasicStructureWithName name="Add Tours / Activity" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-5 h-fit p-4">
        {/* Trip Details */}
        <BoxProviderWithName
          name="Tour Information"
          textClasses=" text-[18px] font-semibold "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormTextInput
              control={control}
              name="participants"
              label="Tour Title"
              placeholder="Enter no of participants"
              type="text"
              required
            />
            <FormSelectInput
              control={control}
              name="selectDate"
              label="Select Category"
              placeholder="Select Category"
              options={["Tour", "Activity"]}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-2">
            <FormTextAreaInput
              control={control}
              name="participants"
              label="Tour Title"
              placeholder="Enter no of participants"
              type="text"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-2">
            <div className="space-y-2">
              <Label className="text-[14px] font-semibold">
                Upload Images (max. 4)
                <span className="text-red-500 ml-1">*</span>
              </Label>

              <div className="relative">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="hidden"
                  id="document-upload"
                  multiple
                />
                <label
                  htmlFor="document-upload"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">
                        Uploading...
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-600">
                      Click to upload documents (PDF or JPG)
                    </span>
                  )}
                </label>
              </div>

              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}

              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Uploaded Documents:
                </p>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate flex-1"
                  >
                    Document 1
                  </a>
                  <button
                    type="button"
                    onClick={() => handleFileRemove(1)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>{" "}
          </div>
        </BoxProviderWithName>

        {/* Contact Details */}
        <BoxProviderWithName
          name="Policies & Languages"
          textClasses=" text-[18px] font-semibold "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormTextInput
              control={control}
              name="email"
              label="Cancellation Policy"
              type="email"
              required
            />
            <FormTextInput
              control={control}
              name="fullName"
              label="Languages Offered"
              required
            />
          </div>
        </BoxProviderWithName>

        {/* Pickup Details */}
        <BoxProviderWithName
          name="Duration & Pickup Option"
          textClasses=" text-[18px] font-semibold "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormTextInput
              control={control}
              name="email"
              label="Cancellation Policy"
              type="number"
              required
            />
            <RadioInputComponent
              label="Pickup Options"
              options={[
                { value: "now", label: "Available" },
                { value: "later", label: "Not Available" },
              ]}
              value={bookingState.pickupLocation ? "now" : "later"}
              onChange={(value) => {
                if (value === "later") {
                  dispatch(setField({ field: "pickupLocation", value: null }));
                  setValue("pickupLocation", null);
                }
              }}
            />
          </div>
        </BoxProviderWithName>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <BoxProviderWithName
            name="What’s included"
            textClasses=" text-[18px] font-semibold "
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-11">
                <FormTextInput
                  control={control}
                  name="email"
                  label="Enter Text"
                  type="number"
                  required
                />
              </div>
              <div className="flex justify-center items-end">
                <Button variant={"outline"} className="h-[44px]">
                  <X size={24} />
                </Button>
              </div>
              <div className="col-span-3">
                <Button
                  variant={"green_secondary_button"}
                  className="h-[44px]"
                  size={"lg"}
                >
                  <Plus size={24} />
                  Add item
                </Button>
              </div>
            </div>
          </BoxProviderWithName>
          <BoxProviderWithName
            name="What’s not included"
            textClasses=" text-[18px] font-semibold "
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-11">
                <FormTextInput
                  control={control}
                  name="email"
                  label="Enter Text"
                  type="number"
                  required
                />
              </div>
              <div className="flex justify-center items-end">
                <Button variant={"outline"} className="h-[44px]">
                  <X size={24} />
                </Button>
              </div>
              <div className="col-span-3">
                <Button
                  variant={"green_secondary_button"}
                  className="h-[44px]"
                  size={"lg"}
                >
                  <Plus size={24} />
                  Add item
                </Button>
              </div>
            </div>
          </BoxProviderWithName>
          <BoxProviderWithName
            name="Itinerary Builder"
            textClasses=" text-[18px] font-semibold "
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-11">
                <FormTextInput
                  control={control}
                  name="email"
                  label={`Stop ${1}`}
                  type="number"
                  required
                />
              </div>
              <div className="flex justify-center items-end">
                <Button variant={"outline"} className="h-[44px]">
                  <X size={24} />
                </Button>
              </div>
              <div className="col-span-3">
                <Button
                  variant={"green_secondary_button"}
                  className="h-[44px]"
                  size={"lg"}
                >
                  <Plus size={24} />
                  Add item
                </Button>
              </div>
            </div>
          </BoxProviderWithName>
        </div>
        <div className="w-full md:w-[235px] mt-4">
          <Button
            variant={"main_green_button"}
            className="w-full"
            type="button"
            onClick={handleSubmit(onSubmit)}
          >
            Next
          </Button>
        </div>
      </div>
    </BasicStructureWithName>
  );
}
