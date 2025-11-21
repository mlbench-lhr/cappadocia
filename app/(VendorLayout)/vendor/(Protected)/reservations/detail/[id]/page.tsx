"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import Image from "next/image";
import { LocationIcon, PhoneIcon, MailIcon } from "@/public/allIcons/page";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);
  return (
    <BasicStructureWithName name="Details" showBackOption>
      <div className="flex flex-col justify-start items-start w-full lg:w-[80%] xl:w-[70%] 2xl:w-[60%] gap-3 h-fit pb-8">
        <BoxProviderWithName noBorder={true}>
          <div className="grid grid-cols-10 gap-3.5">
            <div className="col-span-10">
              <BoxProviderWithName
                noBorder={true}
                className="!p-0"
                leftSideComponent={
                  <div className=" text-sm md:text-base font-semibold ">
                    Booking Information /{" "}
                    <span className="text-primary"> #1242</span>
                  </div>
                }
                textClasses=" text-[18px] font-semibold "
              >
                <BoxProviderWithName textClasses=" text-[18px] font-semibold ">
                  <div className="w-full flex justify-start items-start flex-col">
                    <div className="w-full flex justify-between items-center gap-2">
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
                        <h4 className="text-sm font-normal">
                          From €80 /Person
                        </h4>
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
                  </div>
                </BoxProviderWithName>
              </BoxProviderWithName>
            </div>
            <div className="col-span-10 md:col-span-4 flex flex-col justify-start items-start gap-3.5">
              <BoxProviderWithName
                className="text-base"
                name="Customer Details"
              >
                <div className="w-full flex-col flex justify-start items-start gap-5">
                  <ProfileBadge
                    size="medium"
                    title="Amanda Chavez"
                    subTitle={"amnadachaved@gmail.com"}
                    image="/userDashboard/cimg.png"
                  />
                  <ProfileBadge
                    size="custom"
                    title="Phone"
                    subTitle={"+90 384 123 4567"}
                    icon={<PhoneIcon color="rgba(0, 0, 0, 0.5)" />}
                  />
                  <ProfileBadge
                    size="custom"
                    title="Email"
                    subTitle={"info@adventuretours.com"}
                    icon={<MailIcon color="rgba(0, 0, 0, 0.5)" />}
                  />
                  <ProfileBadge
                    size="custom"
                    title="Location"
                    subTitle={"Cappadocia,Turkey"}
                    icon={<LocationIcon color="rgba(0, 0, 0, 0.5)" />}
                  />
                </div>
              </BoxProviderWithName>
            </div>
            <div className="col-span-10 md:col-span-6 flex flex-col justify-start items-start gap-3.5">
              <BoxProviderWithName className="text-base" name="Price Breakdown">
                <div className="w-full flex-col flex justify-start items-start gap-1">
                  <div className="w-full flex justify-start items-center gap-8">
                    <span className="text-base font-normal">
                      Payment status:
                    </span>
                    <StatusBadge status="Paid" />
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-base font-medium">Base Price: </span>
                    <span className="text-base font-medium">
                      €60 × 5 Guests = €300
                    </span>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-base font-medium">Total Paid: </span>
                    <span className="text-base font-medium">€300</span>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-base font-medium">
                      Commission (Platform 15%):
                    </span>
                    <span className="text-base font-medium">€200</span>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-base font-medium">Net Revenue: </span>
                    <span className="text-base font-medium">€2000</span>
                  </div>
                </div>
              </BoxProviderWithName>
            </div>
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
