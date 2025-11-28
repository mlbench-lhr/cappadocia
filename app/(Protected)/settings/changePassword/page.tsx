"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import { useAppSelector } from "@/lib/store/hooks";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
        <div className="col-span-2 w-full grid grid-cols-2 gap-[20px]">
          <div className="col-span-2  flex flex-col gap-[10px] relative">
            <Label htmlFor="oldPassword" className="label-style">
              Old Password <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              type={showPassword3 ? "text" : "password"}
              id="oldPassword"
              className="input-style"
              placeholder="Enter First Name"
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
        </div>
        <div className="col-span-2  flex flex-col gap-[10px] relative">
          <Label htmlFor="oldPassword" className="label-style">
            New Password <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            className="input-style"
            placeholder="Enter Last Name"
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
        <div className="col-span-2  flex flex-col gap-[10px] relative">
          <Label htmlFor="confirmPassword" className="label-style">
            Confirm New Password <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type={showPassword2 ? "text" : "password"}
            id="confirmPassword"
            className="input-style"
            placeholder="Enter confirmPassword"
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
      </div>
      <Button
        variant={"main_green_button"}
        className="mt-5"
        onClick={handleSubmit}
        loading={isSubmitting}
      >
        Update Password
      </Button>
    </div>
  );
}
