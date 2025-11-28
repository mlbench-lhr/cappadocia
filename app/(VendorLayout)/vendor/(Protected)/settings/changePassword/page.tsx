"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { useAppSelector } from "@/lib/store/hooks";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

export function ChangePass() {
  const userData = useAppSelector((state) => state.auth.user);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordFormSchema = z
    .object({
      oldPassword: z.string().min(1, "Old Password is required"),
      newPassword: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      message: "New Password cannot be same as old password",
      path: ["newPassword"],
    });
  type PasswordFormData = z.infer<typeof passwordFormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: PasswordFormData) {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/changePassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userData?.id,
          ...values,
        }),
      });

      const data = await res.json();

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
        text: data.message || "Password updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      reset();
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

  return (
    <div className="w-full lg:w-[70%] h-full flex justify-between items-end flex-col">
      <div className="w-full grid grid-cols-2 gap-[20px]">
        {/* Old Password */}
        <Controller
          name="oldPassword"
          control={control}
          render={({ field }) => (
            <div className="col-span-2 flex flex-col gap-[10px]">
              <Label
                htmlFor="oldPassword"
                className="text-[14px] font-semibold"
              >
                Old Password <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showOld ? "text" : "password"}
                  className="pr-10"
                  placeholder="Enter old password"
                  {...field}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowOld(!showOld)}
                >
                  {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>
          )}
        />

        {/* New Password */}
        <Controller
          name="newPassword"
          control={control}
          rules={{
            validate: (value) => {
              const hasUppercase = /[A-Z]/.test(value);
              const hasLowercase = /[a-z]/.test(value);
              const hasNumber = /[0-9]/.test(value);
              const hasSpecial = /[^A-Za-z0-9]/.test(value);
              if (!hasUppercase)
                return "Password must include at least one uppercase letter";
              if (!hasLowercase)
                return "Password must include at least one lowercase letter";
              if (!hasNumber)
                return "Password must include at least one number";
              if (!hasSpecial)
                return "Password must include at least one special character";
              return true;
            },
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          }}
          render={({ field }) => (
            <div className="col-span-2 flex flex-col gap-[10px]">
              <Label
                htmlFor="newPassword"
                className="text-[14px] font-semibold"
              >
                New Password <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  className="pr-10"
                  placeholder="Enter new password"
                  {...field}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Confirm Password */}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <div className="col-span-2 flex flex-col gap-[10px]">
              <Label
                htmlFor="confirmPassword"
                className="text-[14px] font-semibold"
              >
                Confirm New Password{" "}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  className="pr-10"
                  placeholder="Confirm new password"
                  {...field}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <Button
        variant={"main_green_button"}
        className="mt-5"
        type="button"
        onClick={handleSubmit(onSubmit)}
        loading={isSubmitting}
      >
        Update Password
      </Button>
    </div>
  );
}
