"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import { FormTextInput } from "@/components/SmallComponents/InputComponents";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { updateUser } from "@/lib/store/slices/authSlice";
import { AvatarUpload } from "@/components/ui/avatar-upload";

export function EditProfile() {
  const userData = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(
    payload:
      | {
          email: string;
          fullName: string;
          phoneNumber: string;
        }
      | { avatar: string }
  ) {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      dispatch(updateUser(data?.user));

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Something went wrong",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: data.message || "Profile updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Server error. Please try again later.",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const tourFormSchema = z.object({
    email: z.string().min(1, "Email is required"),
    fullName: z.string().min(1, "Full Name is required"),
    phoneNumber: z.string().min(1, "Phone Number is required"),
  });

  type TourFormData = z.infer<typeof tourFormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    mode: "onChange",
    defaultValues: {
      email: userData?.email,
      fullName: userData?.fullName,
      phoneNumber: userData?.phoneNumber,
    },
  });
  useEffect(() => {
    if (userData) {
      reset({
        email: userData.email,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
      });
    }
  }, [
    userData?.email,
    userData?.fullName,
    userData?.phoneNumber,
    userData?.avatar,
  ]);

  return (
    <div className="w-full lg:w-[70%] h-full flex justify-between items-end flex-col">
      <div className="w-full grid grid-cols-2 gap-[20px]">
        <div className="col-span-2 w-full grid grid-cols-1 gap-[20px]">
          <div className="w-fit">
            <AvatarUpload
              currentAvatar={userData?.avatar || "/placeholderDp.png"}
              onAvatarUpload={(url) => {
                onSubmit({ avatar: url });
              }}
              size={100}
            />
          </div>
          <FormTextInput
            control={control}
            name="email"
            label="Email"
            placeholder="Enter Email"
            type="text"
            required
            disabled
          />
          <FormTextInput
            control={control}
            name="fullName"
            label="Full Name"
            placeholder="Enter Full Name"
            type="text"
            required
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <div className="space-y-1 col-span-1">
                <Label className="text-[14px] font-semibold">
                  Phone Number
                  {<span className="text-red-500 ml-1">*</span>}
                </Label>
                <PhoneNumberInput
                  phoneNumber={field.value}
                  setPhoneNumber={field.onChange}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </div>
      <Button
        variant={"main_green_button"}
        className="mt-5"
        type="button"
        onClick={handleSubmit(onSubmit)}
        loading={isSubmitting}
      >
        Save Changes
      </Button>
    </div>
  );
}
