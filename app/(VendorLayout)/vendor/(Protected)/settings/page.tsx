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
import { Terms } from "./Terms-and-conditions/page";
import LogoutDialog from "@/components/LogoutDialog";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { EditProfile } from "./EditProfile/page";
import NotificationSettings from "@/components/NotificationSettings";

export default function App() {
  const userData = useAppSelector((state) => state.auth.user);

  const options: {
    icons: any;
    name:
      | "Profile"
      | "Change Password"
      | "Notifications"
      | "Terms & Conditions";
  }[] = [
    { icons: EditIcon, name: "Profile" },
    { icons: Lock, name: "Change Password" },
    { icons: Bell, name: "Notifications" },
    { icons: FileCheck, name: "Terms & Conditions" },
  ];
  const components = {
    Profile: <EditProfile />,
    "Change Password": <ChangePass />,
    Notifications: <NotificationSettings />,
    "Terms & Conditions": <Terms />,
  };

  const [activeComp, setActiveComp] = useState<
    "Profile" | "Change Password" | "Notifications" | "Terms & Conditions"
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
                      className={`w-fit lg:w-full flex justify-between items-center shrink-0 snap-start cursor-pointer`}
                      onClick={() => {
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
                <DeleteAccountDialog
                  triggerComponent={
                    <div
                      className={`w-fit text-sm lg:text-base font-medium flex justify-start items-center gap-2 cursor-pointer`}
                    >
                      <Trash size={16} className="hidden lg:block" />
                      <div className="w-fit">Delete Account</div>
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
