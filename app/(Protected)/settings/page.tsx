"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { useState } from "react";
import { ChangePass } from "./changePassword/page";
import Image from "next/image";
import {
  Bell,
  ChevronRight,
  EditIcon,
  FileCheck,
  Lock,
  LogOut,
  Trash,
} from "lucide-react";
import { SettingProvider } from "./SettingProvider";

export default function App() {
  const userData = useAppSelector((state) => state.auth.user);

  const options: { icons: any; name: string }[] = [
    { icons: EditIcon, name: "Profile" },
    { icons: Lock, name: "Change Password" },
    { icons: Bell, name: "Notifications" },
    { icons: FileCheck, name: "Terms & Conditions" },
    { icons: Trash, name: "Delete Account" },
    { icons: LogOut, name: "Logout" },
  ];

  const [activeComp, setActiveComp] = useState<
    | "Profile"
    | "Change Password"
    | "Notifications"
    | "Terms & Conditions"
    | "Delete Account"
    | "Logout"
  >("Profile");

  return (
    <div className="flex flex-col gap-[32px] justify-start items-start w-full min-h-[calc(100vh-120px)]">
      <div className="p-4 md:p-6 bg-white rounded-[24px] w-full relative min-h-[calc(100vh-120px)] border-2">
        <div className="w-full mx-auto grid grid-cols-3 min-h-[calc(100vh-120px)]">
          <div className="col-span-3 md:col-span-1 border-r-none md:border-r-2 pe-0 md:pe-6 pb-8 md:pb-0 pt-0 md:pt-10 min-h-[calc(100vh-120px)]">
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
            <div className="w-full flex flex-col justify-start items-start gap-4 pt-4">
              {options.map((item, index) => {
                let Icon = item.icons;
                return (
                  <div
                    key={index}
                    className="w-full flex justify-between items-center"
                  >
                    <div
                      className={`w-full text-base font-medium flex justify-start items-center gap-2 ${
                        item.name === activeComp && "text-primary"
                      }`}
                    >
                      <Icon size={16} />
                      {item.name}
                    </div>
                    <ChevronRight size={20} />
                  </div>
                );
              })}
            </div>
          </div>
          <SettingProvider>
            <ChangePass />
          </SettingProvider>
        </div>
      </div>
    </div>
  );
}
