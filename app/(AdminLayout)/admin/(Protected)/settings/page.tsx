"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { useState } from "react";
import { ChangePass } from "./changePassword/page";
import Image from "next/image";
import {
  Bell,
  ChevronRight,
  DollarSign,
  EditIcon,
  Lock,
  LogOut,
} from "lucide-react";
import { SettingProvider } from "./SettingProvider";
import { Terms } from "./Terms-and-conditions/page";
import LogoutDialog from "@/components/LogoutDialog";
import { Promotions } from "./Promotions/page";
import NotificationSettings from "@/components/NotificationSettings";

// Edit Profile comp

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect } from "react";
import { FormTextInput } from "@/components/SmallComponents/InputComponents";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { updateUser } from "@/lib/store/slices/authSlice";
import { AvatarUpload } from "@/components/ui/avatar-upload";

function AdminEditProfile() {
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

// main comp

export default function App() {
  const userData = useAppSelector((state) => state.auth.user);

  const options: {
    icons: any;
    name:
      | "Profile"
      | "Change Password"
      | "Promotions"
      | "Payment Management"
      | "Notifications";
  }[] = [
    { icons: EditIcon, name: "Profile" },
    { icons: Lock, name: "Change Password" },
    { icons: Bell, name: "Promotions" },
    { icons: Bell, name: "Notifications" },
    { icons: DollarSign, name: "Payment Management" },
  ];
  const components = {
    Profile: <AdminEditProfile />,
    "Change Password": <ChangePass />,
    Promotions: <Promotions />,
    Notifications: <NotificationSettings />,
    "Payment Management": <Terms />,
  };

  const [activeComp, setActiveComp] = useState<
    | "Profile"
    | "Change Password"
    | "Promotions"
    | "Payment Management"
    | "Notifications"
  >("Profile");

  return (
    <div className="flex flex-col gap-[32px] justify-start items-start w-full h-fit lg:h-[calc(100vh-120px)]">
      <div className="p-4 lg:p-6 bg-white rounded-[24px] w-full relative h-fit lg:h-full border-2">
        <div className="w-full mx-auto grid grid-cols-3 h-fit lg:h-full">
          <div className="col-span-3 lg:col-span-1 border-r-none lg:border-r-2 pe-0 lg:pe-6 pb-8 lg:pb-0 pt-0 lg:pt-10 h-fit lg:h-full lg:sticky lg:top-0">
            <div className="w-full flex flex-col border-b-2 pb-4 justify-center items-center">
              <Image
                src={userData?.avatar || "/placeholderDp.png"}
                width={70}
                height={70}
                alt=""
                className="h-[70px] w-[70px] rounded-full "
              />
              <h2 className="text-base font-semibold mt-2">
                {userData?.fullName}
              </h2>
              <h3 className="text-sm font-normal">{userData?.email}</h3>
            </div>
            <div className="w-full overflow-auto flex justify-start items-center">
              <div className="w-fit lg:w-full flex flex-row lg:flex-col justify-start items-start gap-3 pt-4 snap-x snap-mandatory">
                {options.map((item, index) => {
                  let Icon = item.icons;
                  return (
                    <div
                      key={index}
                      className={`w-fit lg:w-full flex justify-between items-center shrink-0 snap-start ${
                        item.name === "Payment Management"
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() => {
                        item.name !== "Payment Management" &&
                          setActiveComp(item.name);
                      }}
                    >
                      <div
                        className={`w-fit text-sm lg:text-base font-medium flex justify-start items-center gap-2 ${
                          item.name === activeComp && "text-primary"
                        }`}
                      >
                        <Icon size={16} className="hidden lg:block" />
                        <div className="w-fit">{item.name}</div>
                      </div>
                      <ChevronRight
                        size={20}
                        className={`hidden lg:block ${
                          item.name === activeComp && "text-primary"
                        }`}
                      />
                    </div>
                  );
                })}
                <LogoutDialog
                  triggerComponent={
                    <div
                      className={`w-fit text-sm lg:text-base font-medium flex justify-start items-center gap-2 cursor-pointer`}
                    >
                      <LogOut size={16} className="hidden lg:block" />
                      <div className="w-fit">Logout</div>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
          <SettingProvider label={activeComp}>
            {components[activeComp]}
          </SettingProvider>
        </div>
      </div>
    </div>
  );
}
