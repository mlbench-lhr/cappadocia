"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import type React from "react";

import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import {
  RadioInputComponent,
  FormSelectInput,
  FormTextInput,
  FormTextAreaInput,
} from "@/components/SmallComponents/InputComponents";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus, X } from "lucide-react";
import {
  setField,
  addArrayItem,
  deleteArrayItem,
} from "@/lib/store/slices/tourAndActivitySlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadMultipleFiles } from "@/lib/utils/upload";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";

const tourFormSchema = z.object({
  title: z.string().min(1, "Tour title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.number().min(1, "Duration must be at least 1 hour"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  pickupAvailable: z.boolean(),
  cancellationPolicy: z.string().min(1, "Cancellation policy is required"),
  included: z.array(z.string()).min(1, "At least one item must be included"),
  notIncluded: z
    .array(z.string())
    .min(1, "At least one item must be not included"),
  itinerary: z
    .array(z.string())
    .min(1, "At least one itinerary stop is required"),
  uploads: z
    .array(z.string())
    .min(1, "At least one image is required")
    .max(4, "Maximum 4 images allowed"),
});

type TourFormData = z.infer<typeof tourFormSchema>;

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const toursState = useAppSelector((s) => s.tourAndActivity);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [cancellationPolicyHours, setCancellationPolicyHours] =
    useState<number>(0);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [newIncluded, setNewIncluded] = useState<string>("");
  const [newNotIncluded, setNewNotIncluded] = useState<string>("");
  const [newItinerary, setNewItinerary] = useState<string>("");
  console.log("toursState---", toursState);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    mode: "onChange",
    defaultValues: {
      title: toursState.title || "",
      category: toursState.category || "",
      description: toursState.description || "",
      duration: toursState.duration || 1,
      languages: toursState.languages || [],
      pickupAvailable: toursState.pickupAvailable || false,
      cancellationPolicy: toursState.cancellationPolicy || "",
      included: toursState.included || [],
      notIncluded: toursState.notIncluded || [],
      itinerary: toursState.itinerary || [],
      uploads: toursState.uploads || [],
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (watchedValues.title)
      dispatch(setField({ field: "title", value: watchedValues.title }));
    if (watchedValues.category)
      dispatch(setField({ field: "category", value: watchedValues.category }));
    if (watchedValues.description)
      dispatch(
        setField({ field: "description", value: watchedValues.description })
      );
    if (watchedValues.duration)
      dispatch(setField({ field: "duration", value: watchedValues.duration }));
    if (watchedValues.pickupAvailable !== undefined)
      dispatch(
        setField({
          field: "pickupAvailable",
          value: watchedValues.pickupAvailable,
        })
      );
  }, [
    watchedValues.title,
    watchedValues.category,
    watchedValues.description,
    watchedValues.duration,
    watchedValues.pickupAvailable,
    dispatch,
  ]);

  useEffect(() => {
    const policy = `Free cancellation up to ${
      cancellationPolicyHours || "0"
    } hours before tour`;
    dispatch(setField({ field: "cancellationPolicy", value: policy }));
    setValue("cancellationPolicy", policy);
  }, [cancellationPolicyHours, dispatch, setValue]);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, [isMobile, dispatch]);

  const onSubmit = async (data: TourFormData) => {
    console.log("Form submitted:", data);
    // Sync all arrays to Redux before submission
    dispatch(setField({ field: "uploads", value: data.uploads }));
    dispatch(setField({ field: "included", value: data.included }));
    dispatch(setField({ field: "notIncluded", value: data.notIncluded }));
    dispatch(setField({ field: "itinerary", value: data.itinerary }));
    dispatch(setField({ field: "languages", value: selectedLanguages }));
    try {
      setLoading(true);
      await axios.post("/api/toursAndActivity/add", {
        toursState,
      });
      router.push("/vendor/tours-and-activities");
      setLoading(true);
    } catch (error) {
      console.log("error-", error);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (toursState.uploads.length + files.length > 4) {
      setUploadError("Maximum 4 images allowed");
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
      const urls = await uploadMultipleFiles(Array.from(files), "avatars");
      if (Array.isArray(urls)) {
        urls.forEach((url) => {
          dispatch(addArrayItem({ field: "uploads", value: url }));
          setValue("uploads", [...toursState.uploads, ...urls]);
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = (index: number) => {
    dispatch(deleteArrayItem({ field: "uploads", index }));
    setValue(
      "uploads",
      toursState.uploads.filter((_, i) => i !== index)
    );
  };

  const handleAddIncluded = () => {
    if (newIncluded.trim()) {
      dispatch(addArrayItem({ field: "included", value: newIncluded }));
      setValue("included", [...toursState.included, newIncluded]);
      setNewIncluded("");
    }
  };

  const handleRemoveIncluded = (index: number) => {
    dispatch(deleteArrayItem({ field: "included", index }));
    setValue(
      "included",
      toursState.included.filter((_, i) => i !== index)
    );
  };

  const handleAddNotIncluded = () => {
    if (newNotIncluded.trim()) {
      dispatch(addArrayItem({ field: "notIncluded", value: newNotIncluded }));
      setValue("notIncluded", [...toursState.notIncluded, newNotIncluded]);
      setNewNotIncluded("");
    }
  };

  const handleRemoveNotIncluded = (index: number) => {
    dispatch(deleteArrayItem({ field: "notIncluded", index }));
    setValue(
      "notIncluded",
      toursState.notIncluded.filter((_, i) => i !== index)
    );
  };

  const handleAddItinerary = () => {
    if (newItinerary.trim()) {
      dispatch(addArrayItem({ field: "itinerary", value: newItinerary }));
      setValue("itinerary", [...toursState.itinerary, newItinerary]);
      setNewItinerary("");
    }
  };

  const handleRemoveItinerary = (index: number) => {
    dispatch(deleteArrayItem({ field: "itinerary", index }));
    setValue(
      "itinerary",
      toursState.itinerary.filter((_, i) => i !== index)
    );
  };

  const handleLanguageChange = (lang: string) => {
    const updated = selectedLanguages.includes(lang)
      ? selectedLanguages.filter((l) => l !== lang)
      : [...selectedLanguages, lang];
    setSelectedLanguages(updated);
    setValue("languages", updated);
  };

  return (
    <BasicStructureWithName name="Add Tours / Activity" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-5 h-fit p-4">
        <BoxProviderWithName
          name="Tour Information"
          textClasses=" text-[18px] font-semibold "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormTextInput
              control={control}
              name="title"
              label="Tour Title"
              placeholder="Enter tour title"
              type="text"
              required
            />
            <FormSelectInput
              control={control}
              name="category"
              label="Select Category"
              placeholder="Select Category"
              options={["Tour", "Activity"]}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-2">
            <FormTextAreaInput
              control={control}
              name="description"
              label="Tour Description"
              placeholder="Enter tour description"
              type="text"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-2">
            <div className="space-y-2">
              <Label className="text-[14px] font-semibold">
                Upload Images (min 4, max 10)
                <span className="text-red-500 ml-1">*</span>
              </Label>

              <div className="relative">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  onChange={handleFileSelect}
                  disabled={isUploading || toursState.uploads.length >= 4}
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
                      Click to upload images ({toursState.uploads.length}/4)
                    </span>
                  )}
                </label>
              </div>

              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}

              <div className="space-y-2 mt-4">
                {toursState.uploads.length > 0 && (
                  <>
                    <p className="text-sm font-medium text-gray-700">
                      Uploaded Images:
                    </p>
                    {toursState.uploads.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate flex-1"
                        >
                          Image {index + 1}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleFileRemove(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </BoxProviderWithName>
        <BoxProviderWithName
          name="Policies & Languages"
          textClasses=" text-[18px] font-semibold "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 col-span-1">
              <Label className="text-[14px] font-semibold">
                Cancellation Policy
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Free cancellation up to X hours before tour"
                  className="bg-white pe-30"
                  readOnly
                  required={true}
                  value={`Free cancellation up to ${cancellationPolicyHours} hours before tour`}
                />
                <div className="absolute right-3 flex w-f justify-center items-center gap-0 top-1/2 translate-y-[-50%]">
                  <button
                    onClick={() =>
                      setCancellationPolicyHours(
                        Math.max(0, cancellationPolicyHours - 1)
                      )
                    }
                    className="p-2 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={cancellationPolicyHours === 0}
                  >
                    <Minus size={15} className="text-gray-600" />
                  </button>
                  <input
                    className="text-center text-[12px] font-normal w-8 text-primary"
                    value={cancellationPolicyHours}
                    onChange={(e) => {
                      const val = e.target.valueAsNumber;
                      if (!isNaN(val)) setCancellationPolicyHours(val);
                    }}
                    type="number"
                  />
                  <button
                    onClick={() =>
                      setCancellationPolicyHours(cancellationPolicyHours + 1)
                    }
                    className="p-2 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={15} className="text-gray-600" />
                  </button>
                </div>
              </div>
              {errors.cancellationPolicy?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cancellationPolicy?.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-[14px] font-semibold">
                Languages Offered
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <select
                value=""
                onChange={(e) => {
                  const lang = e.target.value;
                  if (lang && !selectedLanguages.includes(lang)) {
                    const updated = [...selectedLanguages, lang];
                    setSelectedLanguages(updated);
                    setValue("languages", updated);
                    dispatch(addArrayItem({ field: "languages", value: lang }));
                  }
                  e.target.value = "";
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="">Select a language</option>
                {["English", "Chinese", "Turkish"].map(
                  (lang) =>
                    !selectedLanguages.includes(lang) && (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    )
                )}
              </select>
              {selectedLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                  {selectedLanguages.map((lang) => (
                    <span
                      key={lang}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = selectedLanguages.filter(
                            (l) => l !== lang
                          );
                          setSelectedLanguages(updated);
                          setValue("languages", updated);
                          dispatch(
                            deleteArrayItem({
                              field: "languages",
                              index: toursState.languages.indexOf(lang),
                            })
                          );
                        }}
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.languages?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.languages?.message}
                </p>
              )}
            </div>
          </div>
        </BoxProviderWithName>
        <BoxProviderWithName
          name="Duration & Pickup Option"
          textClasses=" text-[18px] font-semibold "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[14px] font-semibold">
                Duration (hours)
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <input
                type="number"
                placeholder="Enter duration in hours"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value) || 0;
                  setValue("duration", value);
                  dispatch(setField({ field: "duration", value }));
                }}
                defaultValue={toursState.duration || ""}
                required
              />
              {errors.duration?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.duration?.message}
                </p>
              )}
            </div>
            <RadioInputComponent
              label="Pickup Options"
              options={[
                { value: "now", label: "Available" },
                { value: "later", label: "Not Available" },
              ]}
              value={toursState.pickupAvailable ? "now" : "later"}
              onChange={(value) => {
                const isAvailable = value === "now";
                dispatch(
                  setField({ field: "pickupAvailable", value: isAvailable })
                );
                setValue("pickupAvailable", isAvailable);
              }}
            />
          </div>
        </BoxProviderWithName>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <BoxProviderWithName
            name="What's included"
            textClasses=" text-[18px] font-semibold "
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-11">
                <input
                  type="text"
                  placeholder="Enter included item"
                  value={newIncluded}
                  onChange={(e) => setNewIncluded(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-center items-end">
                <Button
                  variant="outline"
                  className="h-[44px] bg-transparent"
                  type="button"
                  disabled
                >
                  <X size={24} />
                </Button>
              </div>
              <div className="col-span-3">
                <Button
                  variant="green_secondary_button"
                  className="h-[44px]"
                  size="lg"
                  type="button"
                  onClick={handleAddIncluded}
                >
                  <Plus size={24} />
                  Add item
                </Button>
              </div>
              {toursState.included.map((item, index) => (
                <div
                  key={index}
                  className="col-span-12 flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIncluded(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </BoxProviderWithName>
          <BoxProviderWithName
            name="What's not included"
            textClasses=" text-[18px] font-semibold "
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-11">
                <input
                  type="text"
                  placeholder="Enter excluded item"
                  value={newNotIncluded}
                  onChange={(e) => setNewNotIncluded(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-center items-end">
                <Button
                  variant="outline"
                  className="h-[44px] bg-transparent"
                  type="button"
                  disabled
                >
                  <X size={24} />
                </Button>
              </div>
              <div className="col-span-3">
                <Button
                  variant="green_secondary_button"
                  className="h-[44px]"
                  size="lg"
                  type="button"
                  onClick={handleAddNotIncluded}
                >
                  <Plus size={24} />
                  Add item
                </Button>
              </div>
              {toursState.notIncluded.map((item, index) => (
                <div
                  key={index}
                  className="col-span-12 flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNotIncluded(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </BoxProviderWithName>
          <BoxProviderWithName
            name="Itinerary Builder"
            textClasses=" text-[18px] font-semibold "
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-11">
                <input
                  type="text"
                  placeholder={`Enter stop ${toursState.itinerary.length + 1}`}
                  value={newItinerary}
                  onChange={(e) => setNewItinerary(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-center items-end">
                <Button
                  variant="outline"
                  className="h-[44px] bg-transparent"
                  type="button"
                  disabled
                >
                  <X size={24} />
                </Button>
              </div>
              <div className="col-span-3">
                <Button
                  variant="green_secondary_button"
                  className="h-[44px]"
                  size="lg"
                  type="button"
                  onClick={handleAddItinerary}
                >
                  <Plus size={24} />
                  Add item
                </Button>
              </div>
              {toursState.itinerary.map((stop, index) => (
                <div
                  key={index}
                  className="col-span-12 flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm">
                    Stop {index + 1}: {stop}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItinerary(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </BoxProviderWithName>
        </div>
        <div className="w-full md:w-[235px] mt-4">
          <Button
            variant="main_green_button"
            className="w-full"
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            loading={loading}
            loadingText={"Loading..."}
          >
            Next
          </Button>
        </div>
      </div>
    </BasicStructureWithName>
  );
}
