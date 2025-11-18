"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export function ChangePass() {
  const userData = useAppSelector((state) => state.auth.user);
  const [oldPassword, setOldPassword] = useState<undefined | string>("");
  const [newPassword, setNewPassword] = useState<undefined | string>("");
  const [confirmPassword, setConfirmPassword] = useState<undefined | string>(
    ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/changePassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userData?.id,
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Something went wrong",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: data.message || "Password updated successfully",
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Server error. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-96 h-full flex flex-col justify-between items-end">
      <div className="w-full flex flex-col gap-[20px]">
        {/* Old Password */}
        <div className="flex flex-col gap-[10px] relative">
          <Label htmlFor="oldPassword" className="label-style">
            Old Password <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type={showPassword3 ? "text" : "password"}
            id="oldPassword"
            className="input-style"
            placeholder="Enter Old Password"
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 bottom-2 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword3(!showPassword3)}
          >
            {showPassword3 ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-[10px] relative">
          <Label htmlFor="newPassword" className="label-style">
            New Password <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            className="input-style"
            placeholder="Enter New Password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 bottom-2 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-[10px] relative">
          <Label htmlFor="confirmPassword" className="label-style">
            Confirm New Password <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type={showPassword2 ? "text" : "password"}
            id="confirmPassword"
            className="input-style"
            placeholder="Confirm New Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 bottom-2 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword2(!showPassword2)}
          >
            {showPassword2 ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button
          variant="main_green_button"
          className=""
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          Update Password
        </Button>
      </div>

      {/* Submit Button */}
    </div>
  );
}

import { AdminLayout } from "@/components/admin/admin-layout";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SettingsLayout from "../../../Components/settings/SettingsLayout";

export default function App() {
  const userData = useAppSelector((state) => state.auth.user);
  const [avatar, setAvatar] = useState(userData?.avatar);
  useEffect(() => {
    setAvatar(userData?.avatar);
  }, [userData?.avatar]);
  const handleAvatarUpload = async (url: string) => {
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userData?.id,
        avatar: url,
      }),
    });
    setAvatar(url);
  };

  const [activeComp, setActiveComp] = useState<"profile" | "password">(
    "profile"
  );

  return (
    <SettingsLayout>
      <div className="p-6 w-full">
        <div className="w-full mx-auto">
          <div className="w-full flex justify-between items-start flex-col gap-[24px]">
            <div className="w-fit mb-0 spacey-[15px]">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Change Password
              </h1>
            </div>
            <div className="w-full h-full rounded-[15px] py-[16px] grid grid-cols-3">
              <div className="w-full h-full pb-[16px] grid col-span-3">
                <ChangePass />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
