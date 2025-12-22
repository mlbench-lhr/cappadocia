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
  setSlotField,
} from "@/lib/store/slices/tourAndActivitySlice";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadMultipleFiles } from "@/lib/utils/upload";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import CalendarGrid from "@/components/Calendar/page";
import Image from "next/image";
import { languagesOptions } from "@/lib/constants";
import AddressLocationSelector, {
  LocationData as MapLocationData,
} from "@/components/map";
import type { LatLng } from "@/lib/store/slices/addbooking";
import { getPartOfDay } from "@/lib/helper/timeFunctions";

const LatLngSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});
export const LocationData = z.object({
  address: z.string().min(1, ""),
  coordinates: LatLngSchema.nullable(),
});

const tourFormSchema = z.object({
  title: z.string().min(1, "Tour title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.number().min(1, "Duration must be at least 1 hour"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  pickupAvailable: z.boolean(),
  kidsAllowed: z.boolean().default(true),
  cancellationPolicy: z.string().min(1, "Cancellation policy is required"),
  included: z.array(z.string()).min(1, "At least one item must be included"),
  notIncluded: z
    .array(z.string())
    .min(1, "At least one item must be not included"),
  notSuitableFor: z.array(z.string()).optional().default([]),
  importantInformation: z.array(z.string()).optional().default([]),
  itinerary: z
    .array(z.string())
    .min(1, "At least one itinerary stop is required"),
  uploads: z
    .array(z.string())
    .min(4, "At least 4 images are required")
    .max(10, "Maximum 10 images allowed"),
  location: LocationData,
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
  const vendorLocation = useAppSelector(
    (s) => s.auth.user?.vendorDetails?.address?.coordinates
  );
  const vendorCoords = vendorLocation as LatLng;
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [newIncluded, setNewIncluded] = useState<string>("");
  const [newNotIncluded, setNewNotIncluded] = useState<string>("");
  const [newItinerary, setNewItinerary] = useState<string>("");
  const [newNotSuitableFor, setNewNotSuitableFor] = useState<string>("");
  const [newImportantInformation, setNewImportantInformation] =
    useState<string>("");
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
      kidsAllowed:
        typeof toursState.kidsAllowed === "boolean"
          ? toursState.kidsAllowed
          : true,
      cancellationPolicy: toursState.cancellationPolicy || "",
      included: toursState.included || [],
      notIncluded: toursState.notIncluded || [],
      notSuitableFor: toursState.notSuitableFor || [],
      importantInformation: toursState.importantInformation || [],
      itinerary: toursState.itinerary || [],
      uploads: toursState.uploads || [],
      location: toursState.location || {
        address: "",
        coordinates: null,
      },
    },
  });
  console.log("errors---", errors);

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
    if (watchedValues.kidsAllowed !== undefined)
      dispatch(
        setField({ field: "kidsAllowed", value: watchedValues.kidsAllowed })
      );
    if (watchedValues.location)
      dispatch(setField({ field: "location", value: watchedValues.location }));
  }, [
    watchedValues.title,
    watchedValues.category,
    watchedValues.description,
    watchedValues.duration,
    watchedValues.pickupAvailable,
    watchedValues.kidsAllowed,
    watchedValues.location,
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

  const [step, setStep] = useState<1 | 2>(2);
  const [calendarData, setCalendarData] = useState<{
    slots: {
      startDate: Date;
      endDate: Date;
      adultPrice: number;
      childPrice: number;
      seatsAvailable: number;
    }[];
    stopBookingDates: Date[];
  }>({ slots: [], stopBookingDates: [] });
  const [calendarError, setCalendarError] = useState<string>("");

  const isConsecutive = (a: Date, b: Date) => {
    const msPerDay = 24 * 60 * 60 * 1000;
    const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
    const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
    return bMid - aMid === msPerDay;
  };

  const dayKey = (d: Date) => {
    const dt = new Date(d);
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
  };

  const expandSlotDays = (s: {
    startDate: Date;
    endDate: Date;
    adultPrice: number;
    childPrice: number;
    seatsAvailable: number;
  }) => {
    const days: number[] = [];
    let cur = new Date(s.startDate);
    const end = new Date(s.endDate);
    cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate());
    const endMid = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    while (cur.getTime() <= endMid.getTime()) {
      days.push(cur.getTime());
      cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000);
    }
    return days;
  };

  const mergeSlots = (
    prev: {
      startDate: Date;
      endDate: Date;
      adultPrice: number;
      childPrice: number;
      seatsAvailable: number;
    }[],
    next: {
      startDate: Date;
      endDate: Date;
      adultPrice: number;
      childPrice: number;
      seatsAvailable: number;
    }[]
  ) => {
    const map = new Map<
      number,
      { adultPrice: number; childPrice: number; seatsAvailable: number }
    >();

    for (const s of prev) {
      for (const ms of expandSlotDays(s)) {
        map.set(ms, {
          adultPrice: s.adultPrice,
          childPrice: s.childPrice,
          seatsAvailable: s.seatsAvailable,
        });
      }
    }
    for (const s of next) {
      for (const ms of expandSlotDays(s)) {
        map.set(ms, {
          adultPrice: s.adultPrice,
          childPrice: s.childPrice,
          seatsAvailable: s.seatsAvailable,
        });
      }
    }

    const sortedDays = Array.from(map.keys()).sort((a, b) => a - b);
    const result: {
      startDate: Date;
      endDate: Date;
      adultPrice: number;
      childPrice: number;
      seatsAvailable: number;
    }[] = [];
    let current: {
      startDate: Date;
      endDate: Date;
      adultPrice: number;
      childPrice: number;
      seatsAvailable: number;
    } | null = null;
    for (const ms of sortedDays) {
      const v = map.get(ms)!;
      const dayDate = new Date(ms);
      if (!current) {
        current = {
          startDate: dayDate,
          endDate: dayDate,
          adultPrice: v.adultPrice,
          childPrice: v.childPrice,
          seatsAvailable: v.seatsAvailable,
        };
        continue;
      }
      const same =
        current.adultPrice === v.adultPrice &&
        current.childPrice === v.childPrice &&
        current.seatsAvailable === v.seatsAvailable;
      const consecutive = isConsecutive(current.endDate, dayDate);
      if (same && consecutive) {
        current.endDate = dayDate;
      } else {
        result.push(current);
        current = {
          startDate: dayDate,
          endDate: dayDate,
          adultPrice: v.adultPrice,
          childPrice: v.childPrice,
          seatsAvailable: v.seatsAvailable,
        };
      }
    }
    if (current) result.push(current);
    return result;
  };

  const onSubmit = async (data: TourFormData) => {
    console.log("Form submitted:", data);
    // Sync all arrays to Redux before submission
    dispatch(setField({ field: "uploads", value: data.uploads }));
    dispatch(setField({ field: "included", value: data.included }));
    dispatch(setField({ field: "notIncluded", value: data.notIncluded }));
    dispatch(
      setField({ field: "notSuitableFor", value: data.notSuitableFor || [] })
    );
    dispatch(
      setField({
        field: "importantInformation",
        value: data.importantInformation || [],
      })
    );
    dispatch(setField({ field: "itinerary", value: data.itinerary }));
    dispatch(setField({ field: "languages", value: selectedLanguages }));
    setStep(2);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (toursState.uploads.length + files.length > 10) {
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

  const handleAddNotSuitableFor = () => {
    if (newNotSuitableFor.trim()) {
      dispatch(
        addArrayItem({ field: "notSuitableFor", value: newNotSuitableFor })
      );
      setValue("notSuitableFor", [
        ...toursState.notSuitableFor,
        newNotSuitableFor,
      ]);
      setNewNotSuitableFor("");
    }
  };

  const handleRemoveNotSuitableFor = (index: number) => {
    dispatch(deleteArrayItem({ field: "notSuitableFor", index }));
    setValue(
      "notSuitableFor",
      toursState.notSuitableFor.filter((_, i) => i !== index)
    );
  };

  const handleAddImportantInformation = () => {
    if (newImportantInformation.trim()) {
      dispatch(
        addArrayItem({
          field: "importantInformation",
          value: newImportantInformation,
        })
      );
      setValue("importantInformation", [
        ...toursState.importantInformation,
        newImportantInformation,
      ]);
      setNewImportantInformation("");
    }
  };

  const handleRemoveImportantInformation = (index: number) => {
    dispatch(deleteArrayItem({ field: "importantInformation", index }));
    setValue(
      "importantInformation",
      toursState.importantInformation.filter((_, i) => i !== index)
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

  const handleAddTour = async () => {
    try {
      setLoading(true);
      const cleanedSlots = calendarData.slots.map((s) => ({
        startDate: s.startDate,
        endDate: s.endDate,
        adultPrice: s.adultPrice,
        childPrice: s.childPrice,
        seatsAvailable: s.seatsAvailable,
      }));
      const requireChild = !!toursState.kidsAllowed;
      const hasValidSlot = cleanedSlots.some(
        (s) =>
          s.adultPrice > 0 &&
          (requireChild ? s.childPrice > 0 : true) &&
          s.seatsAvailable > 0
      );
      if (!hasValidSlot) {
        setCalendarError(
          requireChild
            ? "Please add at least one slot with non-zero adult, child price and seats."
            : "Please add at least one slot with non-zero adult price and seats."
        );
        setLoading(false);
        return;
      }
      dispatch(setSlotField(cleanedSlots as any));
      dispatch(
        setField({
          field: "stopBookingDates",
          value: calendarData.stopBookingDates as any,
        })
      );
      await axios.post("/api/toursAndActivity/add", {
        toursState: {
          ...toursState,
          slots: cleanedSlots,
          stopBookingDates: calendarData.stopBookingDates,
        },
      });
      router.push("/vendor/tours-and-activities");
    } catch (error) {
      console.log("error-", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicStructureWithName
      name={
        step === 2
          ? "Add Tours /Availability & Pricing"
          : "Add Tours / Activity"
      }
      rightSideComponent={
        <div className="text-sm font-semibold">
          <span className="text-primary">Step {step}</span>
          <span className={step === 2 ? "text-primary" : "text-gray-500"}>
            {" "}
            / 2
          </span>
        </div>
      }
      showBackOption
    >
      <div className="flex flex-col justify-start items-start w-full gap-5 h-fit">
        {step === 1 && (
          <>
            <BoxProviderWithName
              name="Tour Information"
              textClasses=" text-[14px] font-semibold "
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
                      disabled={isUploading || toursState.uploads.length >= 10}
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
                          Click to upload images ({toursState.uploads.length}
                          /10)
                        </span>
                      )}
                    </label>
                  </div>

                  {uploadError && (
                    <p className="text-sm text-red-500">{uploadError}</p>
                  )}
                  {errors.uploads?.message && (
                    <p className="text-sm text-red-500">
                      {errors.uploads?.message}
                    </p>
                  )}

                  <div className="flex justify-start items-center gap-2">
                    {toursState.uploads.map((url, index) => (
                      <div
                        key={index}
                        className="flex relative w-fit items-center justify-between"
                      >
                        <Image src={url} alt="" width={100} height={100} />
                        <button
                          type="button"
                          onClick={() => handleFileRemove(index)}
                          className=" ml-2 absolute top-1 right-1 p-1 rounded-full bg-white text-black hover:text-red-500"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName
              name="Tour Location"
              textClasses=" text-[18px] font-semibold "
            >
              <div className="w-full lg:w-1/2 mt-2">
                {vendorCoords &&
                typeof (vendorCoords as any)?.lat === "number" &&
                typeof (vendorCoords as any)?.lng === "number" ? (
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <AddressLocationSelector
                        value={
                          (field.value as unknown as MapLocationData) || {
                            address: "",
                            coordinates: null,
                          }
                        }
                        onChange={(data) => {
                          field.onChange(data as any);
                          dispatch(
                            setField({ field: "location", value: data })
                          );
                        }}
                        readOnly={false}
                        label="Tour Address & Location"
                        placeholder="Enter tour location"
                        radiusLimit={{
                          center: vendorCoords as any,
                          radiusKm: 10,
                        }}
                      />
                    )}
                  />
                ) : (
                  <div className="text-sm text-red-500">
                    {/* Set vendor business address to enable location selection. */}
                  </div>
                )}
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName
              name="Policies & Languages"
              textClasses=" text-[14px] font-semibold "
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
                          setCancellationPolicyHours(
                            cancellationPolicyHours + 1
                          )
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
                        dispatch(
                          addArrayItem({ field: "languages", value: lang })
                        );
                      }
                      e.target.value = "";
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[14px] bg-white"
                  >
                    <option value="">Select a language</option>
                    {languagesOptions.map(
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
                          className="flex items-center gap-2 px-3 py-1 bg-secondary text-primary rounded-full text-sm"
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
                            className="text-primary hover:primary flex items-center justify-center"
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
              textClasses=" text-[14px] font-semibold "
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[14px] font-semibold">
                    Duration (start time – end time)
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[12px]">Start Time</Label>
                      <input
                        type="time"
                        step="1"
                        value={startTime}
                        onChange={(e) => {
                          const v = e.target.value;
                          setStartTime(v);
                          dispatch(
                            setField({ field: "durationStartTime", value: v })
                          );
                          const parse = (t: string) => {
                            const [hh, mm, ss] = t.split(":");
                            const h = parseInt(hh || "0");
                            const m = parseInt(mm || "0");
                            const s = parseInt(ss || "0");
                            return h * 60 + m + s / 60;
                          };
                          const compute = (s: string, e2: string) => {
                            if (!s || !e2) return 0;
                            let start = parse(s);
                            let end = parse(e2);
                            let diff = end - start;
                            if (diff < 0) diff += 24 * 60;
                            const hours = diff / 60;
                            return Math.max(0, Math.round(hours * 100) / 100);
                          };
                          const hours = compute(v, endTime);
                          setValue("duration", hours);
                          dispatch(
                            setField({ field: "duration", value: hours })
                          );
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[14px] bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[12px]">End Time</Label>
                      <input
                        type="time"
                        step="1"
                        value={endTime}
                        onChange={(e) => {
                          const v = e.target.value;
                          setEndTime(v);
                          dispatch(
                            setField({ field: "durationEndTime", value: v })
                          );
                          const parse = (t: string) => {
                            const [hh, mm, ss] = t.split(":");
                            const h = parseInt(hh || "0");
                            const m = parseInt(mm || "0");
                            const s = parseInt(ss || "0");
                            return h * 60 + m + s / 60;
                          };
                          const compute = (s: string, e2: string) => {
                            if (!s || !e2) return 0;
                            let start = parse(s);
                            let end = parse(e2);
                            let diff = end - start;
                            if (diff < 0) diff += 24 * 60;
                            const hours = diff / 60;
                            return Math.max(0, Math.round(hours * 100) / 100);
                          };
                          const hours = compute(startTime, v);
                          setValue("duration", hours);
                          dispatch(
                            setField({ field: "duration", value: hours })
                          );
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[14px] bg-white"
                        required
                      />
                    </div>
                  </div>
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
                <div className="space-y-2 mt-2">
                  <Label className="text-[14px] font-semibold">
                    Kids Allowed
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="kidsAllowed"
                      type="checkbox"
                      checked={!!toursState.kidsAllowed}
                      onChange={(e) => {
                        const v = e.target.checked;
                        dispatch(setField({ field: "kidsAllowed", value: v }));
                        setValue("kidsAllowed", v);
                      }}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="kidsAllowed" className="text-sm">
                      Allow children for this tour/activity
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[12px] text-black/60">
                  Estimated time of day
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-[12px] font-medium ${
                    getPartOfDay(startTime)
                      ? "bg-[#F5FBF5] text-black"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {getPartOfDay(startTime) || "—"}
                </span>
              </div>
            </BoxProviderWithName>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <BoxProviderWithName
                name="What's included"
                textClasses=" text-[14px] font-semibold "
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-10">
                    <input
                      type="text"
                      placeholder="Enter included item"
                      value={newIncluded}
                      onChange={(e) => setNewIncluded(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[14px]"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="green_secondary_button"
                      className="h-[44px] w-full"
                      size="lg"
                      type="button"
                      onClick={handleAddIncluded}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="col-span-12 w-full">
                    {errors.included?.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.included?.message}
                      </p>
                    )}
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
                textClasses=" text-[14px] font-semibold "
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-10">
                    <input
                      type="text"
                      placeholder="Enter excluded item"
                      value={newNotIncluded}
                      onChange={(e) => setNewNotIncluded(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[14px]"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="green_secondary_button"
                      className="h-[44px] w-full"
                      size="lg"
                      type="button"
                      onClick={handleAddNotIncluded}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="col-span-12 w-full">
                    {errors.notIncluded?.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.notIncluded?.message}
                      </p>
                    )}
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
                textClasses=" text-[14px] font-semibold "
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-10">
                    <input
                      type="text"
                      placeholder={`Enter stop ${
                        toursState.itinerary.length + 1
                      }`}
                      value={newItinerary}
                      onChange={(e) => setNewItinerary(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[14px]"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="green_secondary_button"
                      className="h-[44px] w-full"
                      size="lg"
                      type="button"
                      onClick={handleAddItinerary}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="col-span-12 w-full">
                    {errors.itinerary?.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.itinerary?.message}
                      </p>
                    )}
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
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <BoxProviderWithName
                name="Who Is This Not Suitable For?"
                textClasses=" text-[14px] font-semibold "
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-10">
                    <input
                      type="text"
                      placeholder="Enter audience not suitable"
                      value={newNotSuitableFor}
                      onChange={(e) => setNewNotSuitableFor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[14px]"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="green_secondary_button"
                      className="h-[44px] w-full"
                      size="lg"
                      type="button"
                      onClick={handleAddNotSuitableFor}
                    >
                      Add
                    </Button>
                  </div>
                  {toursState.notSuitableFor.map((item, index) => (
                    <div
                      key={index}
                      className="col-span-12 flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNotSuitableFor(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </BoxProviderWithName>
              <BoxProviderWithName
                name="Important Information"
                textClasses=" text-[14px] font-semibold "
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-10">
                    <input
                      type="text"
                      placeholder="Enter important note"
                      value={newImportantInformation}
                      onChange={(e) =>
                        setNewImportantInformation(e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[14px]"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="green_secondary_button"
                      className="h-[44px] w-full"
                      size="lg"
                      type="button"
                      onClick={handleAddImportantInformation}
                    >
                      Add
                    </Button>
                  </div>
                  {toursState.importantInformation.map((item, index) => (
                    <div
                      key={index}
                      className="col-span-12 flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImportantInformation(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </BoxProviderWithName>
            </div>
          </>
        )}
        {step === 2 && (
          <div className="w-full overflow-auto">
            <CalendarGrid
              kidsAllowed={!!toursState.kidsAllowed}
              onDataChange={(data) => {
                const cleanedSlots = data.slots.map((s) => ({
                  startDate: s.startDate,
                  endDate: s.endDate,
                  adultPrice: s.adultPrice,
                  childPrice: s.childPrice,
                  seatsAvailable: s.seatsAvailable,
                }));
                const mergedSlots = mergeSlots(
                  calendarData.slots,
                  cleanedSlots
                );
                const stopSet = new Set(
                  [
                    ...calendarData.stopBookingDates,
                    ...data.stopBookingDates,
                  ].map((d) =>
                    new Date(
                      d.getFullYear(),
                      d.getMonth(),
                      d.getDate()
                    ).getTime()
                  )
                );
                const mergedStops = Array.from(stopSet).map(
                  (ms) => new Date(ms)
                );
                setCalendarData({
                  slots: mergedSlots,
                  stopBookingDates: mergedStops,
                });
                setCalendarError("");
                dispatch(setSlotField(mergedSlots as any));
                dispatch(
                  setField({
                    field: "stopBookingDates",
                    value: mergedStops as any,
                  })
                );
              }}
            />
            <div className="w-full md:w-[235px] mt-4">
              <Button
                variant="main_green_button"
                className="w-full"
                type="button"
                onClick={handleAddTour}
                disabled={loading}
                loading={loading}
                loadingText={"Adding..."}
              >
                Add Tour
              </Button>
            </div>
            {calendarError && (
              <div className="mt-2 text-red-600 text-sm">{calendarError}</div>
            )}
          </div>
        )}
        {step === 1 && (
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
        )}
      </div>
    </BasicStructureWithName>
  );
}
