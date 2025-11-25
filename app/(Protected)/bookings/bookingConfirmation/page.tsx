"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import Image from "next/image";
import {
  LocationIcon,
  PhoneIcon,
  MailIcon,
  StarIcon,
} from "@/public/allIcons/page";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import Link from "next/link";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
import { Copy, Forward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import DownloadInvoiceButton from "@/app/(Protected)/invoices/DownloadButton";
import { TextInputComponent } from "@/components/SmallComponents/InputComponents";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  return (
    <BasicStructureWithName
      name="Booking Details"
      showBackOption
      rightSideComponent={<DownloadInvoiceButton />}
    >
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        <div className="w-full flex flex-col justify-start items-start gap-4 md:gap-6">
          <BoxProviderWithName noBorder={true} className="">
            <div className="w-full flex flex-col justify-start items-start gap-4 md:gap-6">
              <div className="w-full grid grid-cols-12">
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2 items-start justify-start">
                  <div className="w-full md:w-[360px]">
                    <TextInputComponent
                      label="Booking ID:"
                      placeholder="434124"
                    />
                  </div>
                  <div className="flex gap-2 items-center justify-start">
                    <span className="text-base font-normal">
                      Payment Status:
                    </span>
                    <StatusBadge status="paid" />
                  </div>
                  <h3 className="text-[18px] font-semibold">QR Code</h3>
                  <div className="w-[430px] h-[350px] flex justify-center items-center">
                    <Image
                      src={"/userDashboard/qrCode.png"}
                      alt=""
                      width={430}
                      height={350}
                      className="w-[430px] h-[350px] object-contain"
                    />
                  </div>
                  <span className="text-[14px] font-normal">
                    Show this QR code at the tour start point for check-in.
                  </span>
                  <span className="text-[14px] font-medium text-primary">
                    12tsNYRjzZ3LcLyEvn4XJCB4FV12GbWU
                  </span>
                  <div className="flex justify-start items-center gap-2">
                    <Copy />
                    <Forward />
                  </div>
                  <Button variant={"main_green_button"}>Pay Now</Button>
                </div>
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2 items-start justify-start">
                  <BoxProviderWithName name="Vendor / Operator Information">
                    <BoxProviderWithName>
                      <div className="w-full flex flex-col gap-3 justify-between items-center">
                        <div className="w-full flex justify-between items-center">
                          <Link
                            href={`/vendor/detail/1`}
                            className="w-[calc(100%-100px)]"
                          >
                            <ProfileBadge
                              size="custom"
                              title="SkyView Balloon Tours"
                              subTitle={"TÜRSAB Number: " + 1232}
                              image="/userDashboard/img2.png"
                              extraComponent={
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
                              }
                            />
                          </Link>
                          <div className="w-fit h-fit px-1.5 py-1 bg-secondary rounded-[10px]">
                            <IconAndTextTab2
                              icon={<LocationIcon />}
                              text={`1.2 mi`}
                            />
                          </div>
                        </div>
                        <Button
                          variant={"main_green_button"}
                          className="w-full"
                        >
                          Chat
                        </Button>
                      </div>
                      <div className="flex flex-col justify-start items-start gap-2 mt-3">
                        <span className="text-base font-semibold">
                          Contact Information
                        </span>
                        <IconAndTextTab2
                          icon={<PhoneIcon />}
                          text={`+90 384 123 4567`}
                          textClasses="text-black/70"
                        />
                        <IconAndTextTab2
                          icon={<MailIcon />}
                          text={`info@skyviewballoon.com`}
                          textClasses="text-black/70"
                        />
                      </div>
                    </BoxProviderWithName>
                  </BoxProviderWithName>
                </div>
              </div>
            </div>
          </BoxProviderWithName>
        </div>
      </div>
    </BasicStructureWithName>
  );
}
