"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
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
import { Copy, CopyCheck, Forward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import DownloadInvoiceButton from "@/app/(Protected)/invoices/DownloadButton";
import { TextInputComponent } from "@/components/SmallComponents/InputComponents";
import { useParams } from "next/navigation";
import axios from "axios";
import { BookingWithPopulatedData } from "@/lib/types/booking";
import BookingConfirmPageSkeleton from "@/components/Skeletons/BookingConfirmPageSkeleton";
import { QRCodeSVG } from "qrcode.react";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);
  const [data, setData] = useState<BookingWithPopulatedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  console.log("data-----", data);

  const { id }: { id: string } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/booking/detail/${id}`);
        console.log("response----", response.data);

        if (response.data) {
          setData(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, []);
  const handleShare = async () => {
    if (!data?._id) {
      return;
    }
    const qrLink = `${process.env.NEXT_PUBLIC_BASE_URL}/vendor/reservations/detail/${data._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Reservation Details",
          text: "View reservation details",
          url: qrLink,
        });
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // fallback for desktop browsers
      navigator.clipboard.writeText(qrLink);
      alert("Link copied to clipboard!");
    }
  };
  const handleCopy = async () => {
    if (!data?._id) {
      return;
    }
    const qrLink = `${process.env.NEXT_PUBLIC_BASE_URL}/vendor/reservations/detail/${data._id}`;
    try {
      await navigator.clipboard.writeText(qrLink);
      setIsCopied(true);
    } catch (err) {
      console.log("Copy failed:", err);
    }
  };

  if (loading) {
    return <BookingConfirmPageSkeleton />;
  }
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
                      placeholder={data?.bookingId}
                    />
                  </div>
                  <div className="flex gap-2 items-center justify-start">
                    <span className="text-base font-normal">
                      Payment Status:
                    </span>
                    <StatusBadge status={data?.paymentStatus || ""} />
                  </div>
                  <h3 className="text-[18px] font-semibold">QR Code</h3>
                  <div className="w-[430px] h-[350px] flex justify-center items-center">
                    <QRCodeSVG
                      value={`${process.env.NEXT_PUBLIC_BASE_URL}/vendor/reservations/detail/${data?._id}`}
                      size={180}
                      className="w-[430px] h-[350px] object-contain p-2"
                    />
                  </div>
                  <span className="text-[14px] font-normal">
                    Show this QR code at the tour start point for check-in.
                  </span>
                  <span className="text-[14px] font-medium text-primary">
                    {data?._id}
                  </span>
                  <div className="flex justify-start items-center gap-2">
                    {isCopied ? (
                      <CopyCheck
                        onClick={handleCopy}
                        className="cursor-pointer"
                      />
                    ) : (
                      <Copy onClick={handleCopy} className="cursor-pointer" />
                    )}
                    <Forward onClick={handleShare} className="cursor-pointer" />
                  </div>
                  <Button variant={"main_green_button"}>Pay Now</Button>
                </div>
                <div className="col-span-12 md:col-span-6 flex flex-col gap-2 items-start justify-start">
                  <BoxProviderWithName name="Vendor / Operator Information">
                    <BoxProviderWithName>
                      <div className="w-full flex flex-col gap-3 justify-between items-center">
                        <div className="w-full flex justify-between items-center">
                          <Link
                            href={`/vendor/detail/${data?.vendor._id}`}
                            className="w-[calc(100%-100px)]"
                          >
                            <ProfileBadge
                              size="custom"
                              isTitleLink={true}
                              title={
                                data?.vendor?.vendorDetails?.companyName || ""
                              }
                              subTitle={
                                "TÜRSAB Number: " +
                                data?.vendor?.vendorDetails?.tursabNumber
                              }
                              image={
                                data?.vendor?.avatar || "/placeholderDp.png"
                              }
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
                          text={
                            data?.vendor.vendorDetails.contactPhoneNumber || ""
                          }
                          textClasses="text-black/70"
                        />
                        <IconAndTextTab2
                          icon={<MailIcon />}
                          text={data?.vendor.vendorDetails.businessEmail || ""}
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
