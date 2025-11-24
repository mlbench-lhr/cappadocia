"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import {
  RadioInputComponent,
  FormTextInput,
  TextInputComponent,
} from "@/components/SmallComponents/InputComponents";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { Label } from "@/components/ui/label";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
import { Button } from "@/components/ui/button";
import AddressLocationSelector from "@/components/map";
import { Plus, Trash2 } from "lucide-react";
import {
  addToArray,
  setField,
  updateArrayItem,
  removeArrayItem,
} from "@/lib/store/slices/addbooking";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";

const LatLng = z.object({
  lat: z.number(),
  lng: z.number(),
});
export const LocationData = z.object({
  address: z.string().min(1, ""),
  coordinates: LatLng.nullable(),
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
  pickupLocation: LocationData.nullable(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingsPage() {
  const { id }: { id: string } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const bookingState = useAppSelector((s) => s.addBooking);
  console.log("bookingState:", bookingState, id);
  const [addPickupNow, setAddPickupNow] = useState(true);
  const userId = useAppSelector((s) => s.auth.user?.id);
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    const adultsCount = data.travelers.filter(
      (p) => moment().diff(p.dob, "years") >= 18
    ).length;
    const childrenCount = data.travelers.length - adultsCount;
    try {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const bookingPayload = {
        activityId: id,
        userId: userId,
        selectDate: data.selectDate,
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        travelers: data.travelers,
        pickupLocation: data.pickupLocation,
        adultsCount,
        childrenCount,
      };

      console.log("Submitting booking:", bookingPayload);

      const response = await axios.post("/api/booking/add", bookingPayload);
      const result = response?.data;
      console.log("result-----", result);
      router.push(`/bookings/payment/${result?.booking?._id}`);
    } catch (error: any) {
      console.error("Booking submission error:", error?.response?.data?.error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.error || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTraveler = () => {
    const newTraveler = {
      fullName: "",
      dob: "",
      nationality: "",
      passport: "",
    };
    dispatch(addToArray({ field: "travelers", value: newTraveler }));
    setValue("travelers", [...bookingState.travelers, newTraveler]);
  };

  const handleRemoveTraveler = (index: number) => {
    dispatch(removeArrayItem({ field: "travelers", index }));
    const updatedTravelers = bookingState.travelers.filter(
      (_, i) => i !== index
    );
    setValue("travelers", updatedTravelers);
  };

  const handleTravelerUpdate = (index: number, key: string, value: string) => {
    dispatch(updateArrayItem({ field: "travelers", index, key, value }));
    const updatedTravelers = [...bookingState.travelers];
    updatedTravelers[index] = { ...updatedTravelers[index], [key]: value };
    setValue("travelers", updatedTravelers);
  };

  return (
    <BasicStructureWithName name="Book Now" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-5 h-fit p-4 xl:w-[80%]">
        {/* Trip Details */}
        <BoxProviderWithName
          noBorder={true}
          className="!p-0"
          name="Trip Details"
          textClasses=" text-[18px] font-semibold "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormTextInput
              control={control}
              name="selectDate"
              label="Select Date"
              placeholder="Select Date"
              type="date"
              required
            />
            <FormTextInput
              control={control}
              name="participants"
              label="Participants"
              placeholder="Enter no of participants"
              type="number"
              required
            />
          </div>
        </BoxProviderWithName>

        {/* Contact Details */}
        <BoxProviderWithName
          noBorder={true}
          className="!p-0"
          name="Contact Details"
          textClasses=" text-[18px] font-semibold "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormTextInput
              control={control}
              name="email"
              label="Email Address"
              type="email"
              required
            />
            <FormTextInput
              control={control}
              name="fullName"
              label="Full Name"
              required
            />
            <div className="space-y-1 col-span-1">
              <Label className="text-[14px] font-semibold">
                Phone Number
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <PhoneNumberInput
                      phoneNumber={field.value}
                      setPhoneNumber={field.onChange}
                    />
                    {error && (
                      <p className="text-sm text-red-500 mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </BoxProviderWithName>

        {/* Travelers Details */}
        <BoxProviderWithName
          noBorder={true}
          className="!p-0"
          name="Travelers Details"
          textClasses=" text-[18px] font-semibold "
          rightSideComponent={
            <Button
              type="button"
              variant={"green_secondary_button"}
              size={"sm"}
              onClick={handleAddTraveler}
            >
              Add Traveler <Plus className="ml-2 h-4 w-4" />
            </Button>
          }
        >
          <div className="space-y-4">
            {bookingState.travelers.map((traveler, index) => (
              <BoxProviderWithName
                key={index}
                noBorder={true}
                className="!p-0"
                name={`Traveler ${index + 1}`}
                rightSideComponent={
                  bookingState.travelers.length > 1 ? (
                    <Button
                      type="button"
                      variant={"destructive"}
                      size={"sm"}
                      onClick={() => handleRemoveTraveler(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInputComponent
                    label="Full Name"
                    value={traveler.fullName}
                    onChange={(value) =>
                      handleTravelerUpdate(index, "fullName", value)
                    }
                    required
                    error={errors.travelers?.[index]?.fullName?.message}
                  />
                  <TextInputComponent
                    label="Date of Birth"
                    type="date"
                    value={traveler.dob}
                    onChange={(value) =>
                      handleTravelerUpdate(index, "dob", value)
                    }
                    required
                    error={errors.travelers?.[index]?.dob?.message}
                  />
                  <TextInputComponent
                    label="Nationality"
                    value={traveler.nationality}
                    onChange={(value) =>
                      handleTravelerUpdate(index, "nationality", value)
                    }
                    required
                    error={errors.travelers?.[index]?.nationality?.message}
                  />
                  <TextInputComponent
                    label="Passport Number / TC ID Number"
                    value={traveler.passport}
                    onChange={(value) =>
                      handleTravelerUpdate(index, "passport", value)
                    }
                    required
                    error={errors.travelers?.[index]?.passport?.message}
                  />
                </div>
              </BoxProviderWithName>
            ))}
          </div>
        </BoxProviderWithName>

        {/* Pickup Details */}
        <BoxProviderWithName
          noBorder={true}
          className="!p-0"
          name="Pickup Details"
          textClasses=" text-[18px] font-semibold "
        >
          <BoxProviderWithName
            noBorder={true}
            className=" !px-3.5 !py-3 bg-[#FFF5DF] w-full md:w-[550px] "
            textClasses=" text-[18px] font-semibold "
          >
            <IconAndTextTab2
              alignClass=" items-center !gap-3"
              textClasses=" text-black/80 text-[14px] font-medium "
              text="Note: Please add your pick-up location at least 24 hours before your activity so your activity provider can assist you."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.905 6.52 11.0007 6.28267 11 6C10.9993 5.71733 10.9033 5.48 10.712 5.288C10.5207 5.096 10.2833 5 10 5C9.71667 5 9.47933 5.096 9.288 5.288C9.09667 5.48 9.00067 5.71733 9 6C8.99933 6.28267 9.09533 6.52033 9.288 6.713C9.48067 6.90567 9.718 7.00133 10 7ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88334 18.6867 3.825 17.9743 2.925 17.075C2.025 16.1757 1.31267 15.1173 0.788001 13.9C0.263335 12.6827 0.000667933 11.3827 1.26582e-06 10C-0.000665401 8.61733 0.262001 7.31733 0.788001 6.1C1.314 4.88267 2.02633 3.82433 2.925 2.925C3.82367 2.02567 4.882 1.31333 6.1 0.788C7.318 0.262667 8.618 0 10 0C11.382 0 12.682 0.262667 13.9 0.788C15.118 1.31333 16.1763 2.02567 17.075 2.925C17.9737 3.82433 18.6863 4.88267 19.213 6.1C19.7397 7.31733 20.002 8.61733 20 10C19.998 11.3827 19.7353 12.6827 19.212 13.9C18.6887 15.1173 17.9763 16.1757 17.075 17.075C16.1737 17.9743 15.1153 18.687 13.9 19.213C12.6847 19.739 11.3847 20.0013 10 20Z"
                    fill="#D59E29"
                  />
                </svg>
              }
            />
          </BoxProviderWithName>
          <BoxProviderWithName noBorder={true} className="!p-0 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RadioInputComponent
                label="Where would you like to be picked up?"
                options={[
                  { value: "now", label: "Add location now" },
                  { value: "later", label: "Add later" },
                ]}
                value={addPickupNow ? "now" : "later"}
                onChange={(value) => {
                  if (value === "later") {
                    setAddPickupNow(false);
                    dispatch(
                      setField({ field: "pickupLocation", value: null })
                    );
                    setValue("pickupLocation", null);
                  } else {
                    setAddPickupNow(true);
                  }
                }}
              />
            </div>
          </BoxProviderWithName>
          {addPickupNow && (
            <div className="w-full lg:w-2/3 mt-4">
              <Controller
                name="pickupLocation"
                control={control}
                render={({ field }) => (
                  <AddressLocationSelector
                    value={
                      field.value || {
                        address: "",
                        coordinates: null,
                      }
                    }
                    onChange={(data) => {
                      field.onChange(data);
                      dispatch(
                        setField({ field: "pickupLocation", value: data })
                      );
                    }}
                    readOnly={false}
                    label="Location"
                    placeholder="Type address or click on map"
                  />
                )}
              />
              {errors.pickupLocation?.coordinates?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.pickupLocation?.coordinates?.message}
                </p>
              )}
            </div>
          )}
          <div className="w-full md:w-[235px] mt-4">
            <Button
              variant={"main_green_button"}
              className="w-full"
              type="button"
              onClick={handleSubmit(onSubmit)}
              loading={isSubmitting}
              loadingText="Adding your booking..."
            >
              Next
            </Button>
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
