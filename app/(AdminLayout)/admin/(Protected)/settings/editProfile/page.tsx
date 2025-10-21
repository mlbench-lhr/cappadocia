"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditProfile() {
  const userData = useAppSelector((state) => state.auth.user);
  const [firstName, setFirstName] = useState<undefined | string>("");
  const [lastName, setLastName] = useState<undefined | string>("");
  const [email, setEmail] = useState<undefined | string>("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setFirstName(userData?.firstName);
    setLastName(userData?.lastName);
    setEmail(userData?.email);
  }, [userData?.firstName, userData?.lastName, userData?.email]);

  async function handleSubmit() {
    console.log("e----", firstName, lastName, email);
    try {
      setSubmitLoading(true);
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userData?.id,
          firstName,
          lastName,
          email,
        }),
      });
    } catch (error) {
      console.error("Error fetching blog fields", error);
    } finally {
      setSubmitLoading(false);
    }
  }
  return (
    <div className="w-full h-full flex justify-between items-end flex-col">
      <div className="w-full grid grid-cols-2 gap-[20px]">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-[10px]">
          <Label htmlFor="firstName" className="label-style">
            First Name <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="firstName"
            className="input-style"
            placeholder="Enter First Name"
            value={firstName || ""}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="col-span-2 md:col-span-1 flex flex-col gap-[10px]">
          <Label htmlFor="firstName" className="label-style">
            Last Name <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="lastName"
            className="input-style"
            placeholder="Enter Last Name"
            value={lastName || ""}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div
          className="col-span-2 flex flex-col gap-[10px]"
          style={{ cursor: "not-allowed" }}
        >
          <Label htmlFor="email" className="label-style">
            Email <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="email"
            className="input-style"
            disabled
            placeholder="Enter Email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <Button
        variant={"main_green_button"}
        className="mt-5"
        onClick={handleSubmit}
        loading={submitLoading}
      >
        Save Changes
      </Button>
    </div>
  );
}

import { AdminLayout } from "@/components/admin/admin-layout";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";

export default function App() {
  const userData = useAppSelector((state) => state.auth.user);
  const [avatar, setAvatar] = useState(userData?.avatar);
  useEffect(() => {
    setAvatar(userData?.avatar);
  }, [userData?.avatar]);
  const handleAvatarUpload = async (url: string) => {
    console.log("url", url);
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
    <AdminLayout>
      <div className="min-h-screen w-full">
        <div className="w-full mx-auto">
          <div className="w-full flex justify-between items-start flex-col gap-[24px]">
            <div className="w-fit mb-0 spacey-[15px]">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Edit Profile
              </h1>
            </div>
            <div className="w-full h-full rounded-[15px] py-[16px] grid grid-cols-3">
              <div className="w-full h-full pe-[30px] flex justify-between items-start flex-col col-span-3 pt-[16px]">
                <div className="w-full h-full pb-6 flex justify-center items-center gap-3">
                  <AvatarUpload
                    currentAvatar={avatar}
                    onAvatarUpload={handleAvatarUpload}
                    size={70}
                  />
                </div>
              </div>
              <div className="w-full h-full pb-[16px] grid col-span-3">
                <EditProfile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
