"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import {
  SelectInputComponent,
  TextInputComponent,
} from "@/components/SmallComponents/InputComponents";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { Label } from "@/components/ui/label";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import { ClockIcon, StarIcon } from "@/public/allIcons/page";
import Link from "next/link";

export type DashboardCardProps = {
  image: string;
  title: string;
  description: string;
};

export default function BookingsPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  return (
    <BasicStructureWithName name="Payment" showBackOption>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <BoxProviderWithName
            noBorder={true}
            className="!p-0"
            name="Payment Option"
            textClasses=" text-[18px] font-semibold "
          >
            <div></div>
          </BoxProviderWithName>
        </div>
        <div className="col-span-1">
          <BoxProviderWithName
            noBorder={true}
            className="!p-0"
            name="Payment Summary"
            textClasses=" text-[18px] font-semibold "
          >
            <BoxProviderWithName textClasses=" text-[18px] font-semibold ">
              <div className="w-full flex justify-start items-start flex-col">
                <div className="w-full flex justify-between items-center">
                  <ProfileBadge
                    size="medium"
                    title="John D."
                    subTitle={"Apr 10, 2024"}
                    image="/userDashboard/img2.png"
                  />
                  <div className="w-fit flex justify-start items-center gap-1">
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <span className="text-[12px] font-medium text-black/60">
                      5
                    </span>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center mt-4 gap-2">
                  <Image
                    src={"/userDashboard/img30.png"}
                    alt=""
                    width={80}
                    height={80}
                    className="rounded-[9px]"
                  />
                  <div className="w-full flex justify-center items-start flex-col">
                    <h2 className="text-base font-semibold">
                      Red Tour (North Cappadocia)
                    </h2>
                    <h3 className="text-sm font-normal">
                      Duration: Full Day (8 hours)
                    </h3>
                    <h4 className="text-sm font-normal">From €80 /Person</h4>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center mt-4">
                  <span className="text-xs font-normal">Date</span>
                  <span className="text-sm font-medium">
                    Jan 16 - Jan 20, 2025
                  </span>
                </div>
                <div className="w-full flex justify-between items-center">
                  <span className="text-xs font-normal">Guests</span>
                  <span className="text-sm font-medium">
                    2 Adults and 1 Child
                  </span>
                </div>
                <div className="w-full pt-3.5 border-t mt-3.5">
                  <IconAndTextTab2
                    icon={<ClockIcon color="rgba(0, 0, 0, 0.50)" />}
                    textClasses=" text-sm font-normal text-black w-fit "
                    text="Free cancellation up to 24 hours before tour."
                  />
                </div>
              </div>
              <div className="w-[calc(100%+28px)] flex justify-between items-center mt-4 bg-secondary -ms-3.5 -mb-3 rounded-b-2xl px-3.5 py-2">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">$82383</span>
              </div>
            </BoxProviderWithName>
          </BoxProviderWithName>
        </div>
        <div className="w-full md:w-[300px] mt-4">
          <Button variant={"main_green_button"} className="w-full" asChild>
            <Link href={"/bookings/bookingConfirmation"}>
              Pay Now & Confirm Booking
            </Link>
          </Button>
        </div>
      </div>
    </BasicStructureWithName>
  );
}
