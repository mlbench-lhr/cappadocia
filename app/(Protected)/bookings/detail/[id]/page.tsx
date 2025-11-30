"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import Image from "next/image";
import {
  ClockIcon,
  LocationIcon,
  PhoneIcon,
  MailIcon,
  StarIcon,
  PeopleIcon,
  BookingIcon,
  ClockIcon2,
  LocationIcon2,
  PricePerPerson,
  TotalPrice,
} from "@/public/allIcons/page";
import moment from "moment";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import {
  IconAndTextTab,
  IconAndTextTab2,
} from "@/components/SmallComponents/IconAndTextTab";
import { Copy, CopyCheck, Forward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import { Textarea } from "@/components/ui/textarea";
import DownloadInvoiceButton from "@/app/(Protected)/invoices/DownloadButton";
import AddressLocationSelector, { LocationData } from "@/components/map";
import axios from "axios";
import { useParams } from "next/navigation";
import { BookingWithPopulatedData } from "@/lib/types/booking";
import Link from "next/link";
import BookingPageSkeleton from "@/components/Skeletons/BookingPageSkeleton";
import { QRCodeSVG } from "qrcode.react";
import { ReviewModal } from "@/components/SmallComponents/ReviewModal";
import Rating from "@/components/SmallComponents/RatingField";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [isCopied, setIsCopied] = useState(false);
  const userId = useAppSelector((s) => s.auth?.user?.id);
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const [data, setData] = useState<BookingWithPopulatedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<number>(0);

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
  }, [reload]);
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
  if (!data || loading) {
    return <BookingPageSkeleton />;
  }
  return (
    <BasicStructureWithName
      name="Booking Details"
      showBackOption
      rightSideComponent={
        <div className="flex justify-start items-center gap-2">
          <Button variant={"green_secondary_button"}>
            <Link href={"/explore/detail/" + data.activity._id}>
              View Tour Details
            </Link>
          </Button>
          {data.paymentStatus === "paid" && (
            <DownloadInvoiceButton bookingId={data?._id} />
          )}
        </div>
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        <BoxProviderWithName
          name={"Booking Information / #" + data?.bookingId}
          rightSideComponent={
            <span className="text-[#008EFF] text-sm md:text-base font-normal capitalize">
              Tour Status: {data.status}
            </span>
          }
        >
          <div className="w-full flex flex-col justify-start items-start gap-4 md:gap-6">
            <BoxProviderWithName noBorder={true} className="!border !px-3.5">
              <div className="w-full flex flex-col justify-start items-start gap-4 md:gap-6">
                <div className="flex justify-start items-start gap-4 flex-col md:flex-row">
                  <Image
                    alt=""
                    src={data?.activity?.uploads?.[0]}
                    width={200}
                    height={200}
                    className="w-full md:w-[200px] h-auto md:h-auto object-cover object-center rounded-2xl"
                  />
                  <div className="grid grid-cols-2 gap-2 w-full md:w-[calc(100%-128px)] text-[rgba(34,30,31,0.50)] text-xs font-normal leading-0">
                    <h1 className="col-span-2 text-base font-semibold text-black leading-tight line-clamp-1">
                      {data.activity.title}
                    </h1>
                    <div className="col-span-2 md:col-span-1">
                      <IconAndTextTab
                        icon={<ClockIcon color="rgba(0, 0, 0, 0.5)" />}
                        text={`Date and Time: ${moment(data.selectDate).format(
                          "MMM DD, YYYY | hh:mm A"
                        )}`}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <IconAndTextTab
                        icon={<PeopleIcon color="rgba(0, 0, 0, 0.5)" />}
                        text={`Participants: ${data.adultsCount} Adults, ${data.childrenCount} Children `}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <IconAndTextTab
                        icon={
                          <BookingIcon size="14" color="rgba(0, 0, 0, 0.5)" />
                        }
                        text={`Booking ID: #${data?.bookingId}`}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <IconAndTextTab
                        icon={
                          <LocationIcon size="14" color="rgba(0, 0, 0, 0.5)" />
                        }
                        text={`Location: ${data?.vendor?.vendorDetails?.address?.address}`}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <IconAndTextTab
                        icon={<ClockIcon2 color="rgba(0, 0, 0, 0.5)" />}
                        text={`Duration: ${data?.activity?.duration} minutes`}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <IconAndTextTab
                        icon={<LocationIcon2 color="rgba(0, 0, 0, 0.5)" />}
                        text={`Meeting Point: ${data?.pickupLocation?.address}`}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <IconAndTextTab
                        icon={<PricePerPerson color="rgba(0, 0, 0, 0.5)" />}
                        text={`Price per Person: ${data.paymentDetails.currency} ${data.activity.slots?.[0]?.adultPrice}/Adult,  ${data.paymentDetails.currency} ${data.activity.slots?.[0]?.adultPrice}/Child`}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <IconAndTextTab
                        icon={<TotalPrice color="rgba(0, 0, 0, 0.5)" />}
                        text={`Total Price:  ${data.paymentDetails.currency} ${data.paymentDetails.amount}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full grid grid-cols-12">
                  <div className="col-span-12 md:col-span-6 flex flex-col gap-2 items-start justify-start">
                    <div className="flex gap-2 items-center justify-start">
                      <span className="text-base font-normal">
                        Payment Status:
                      </span>
                      <StatusBadge status={data.paymentStatus} />
                    </div>
                    <h3 className="text-[18px] font-semibold">QR Code</h3>
                    <div className="w-[150px] md:w-[300px] xl:w-[430px] h-[150px] md:h-[250px] xl:h-[350px] flex justify-center items-center">
                      <QRCodeSVG
                        value={`${process.env.NEXT_PUBLIC_BASE_URL}/vendor/reservations/detail/${data._id}`}
                        size={180}
                        className="w-[150px] md:w-[300px] xl:w-[430px] h-[150px] md:h-[250px] xl:h-[350px] object-contain p-2"
                      />
                    </div>
                    <span className="text-[14px] font-normal">
                      Show this QR code at the tour start point for check-in.
                    </span>
                    <span className="text-[14px] font-medium text-primary">
                      {data._id}
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
                      <Forward
                        onClick={handleShare}
                        className="cursor-pointer"
                      />
                    </div>
                    {data.paymentStatus === "pending" && (
                      <Button variant={"main_green_button"} asChild>
                        <Link href={`/bookings/payment/${data?._id}`}>
                          Pay Now
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-6 flex flex-col gap-2 items-start justify-start">
                    <BoxProviderWithName name="Vendor / Operator Information">
                      <BoxProviderWithName>
                        <div className="w-full flex flex-col gap-3 justify-between items-center">
                          <div className="w-full flex justify-between items-center">
                            <div className="w-[calc(100%-100px)]">
                              <Link
                                href={`/explore/vendor/detail/${data.vendor._id}`}
                              >
                                <ProfileBadge
                                  isTitleLink={true}
                                  size="large"
                                  title={
                                    data?.vendor?.vendorDetails?.companyName
                                  }
                                  subTitle={
                                    "TÜRSAB Number: " +
                                    data?.vendor?.vendorDetails?.tursabNumber
                                  }
                                  image={
                                    data?.vendor?.avatar || "/placeholderDp.png"
                                  }
                                />
                              </Link>
                            </div>
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
                            text={data.vendor.vendorDetails.contactPhoneNumber}
                            textClasses="text-black/70"
                          />
                          <IconAndTextTab2
                            icon={<MailIcon />}
                            text={data.vendor.vendorDetails.businessEmail}
                            textClasses="text-black/70"
                          />
                        </div>
                        <div className="flex flex-col justify-start items-start gap-2 mt-3">
                          <span className="text-base font-semibold">
                            Location
                          </span>
                          <IconAndTextTab2
                            icon={<LocationIcon />}
                            text={`Location: ${data.vendor.vendorDetails.address.address}`}
                            textClasses="text-black/70"
                          />
                          {data.pickupLocation && (
                            <AddressLocationSelector
                              value={data.pickupLocation as LocationData}
                              readOnly={true}
                              label="Enter Your Business Address"
                              className=" w-full h-[188px] rounded-xl "
                              placeholder="Type address or click on map"
                            />
                          )}
                          {data.status === "completed" && (
                            <>
                              {data.review ? (
                                <>
                                  <div className="w-full flex flex-col justify-start items-start gap-2">
                                    <div className="w-full flex justify-between items-center">
                                      <h3 className="text-base font-semibold">
                                        Your Feedback
                                      </h3>
                                      <div className="w-fit flex justify-start items-center gap-1">
                                        <Rating
                                          value={data.review.rating}
                                          iconsSize="18"
                                        />
                                      </div>
                                    </div>
                                    {data.review.review.map((item, index) => (
                                      <div
                                        key={index}
                                        className="w-full flex flex-col justify-start items-start"
                                      >
                                        {item.addedBy === "vendor" && (
                                          <h3 className="text-base font-semibold">
                                            Vendor Reply
                                          </h3>
                                        )}
                                        <span className="bg-[#FFF8FB] border h-fit w-full py-2 px-3 rounded-lg">
                                          {item.text}
                                        </span>
                                        {item.uploads && (
                                          <div className="w-full grid-cols-3 gap-2 mt-2">
                                            {item.uploads.map(
                                              (image, index2) => (
                                                <Image
                                                  src={image}
                                                  key={index2}
                                                  height={100}
                                                  width={100}
                                                  className="col-span-1 h-[100px] object-cover object-center"
                                                  alt=""
                                                />
                                              )
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  <ReviewModal
                                    _id={data.review._id}
                                    onSuccess={() => {
                                      setReload(reload + 1);
                                    }}
                                    textProp={data.review.review?.[0]?.text}
                                    ratingProp={data.review.rating}
                                    uploadsProp={
                                      data.review.review?.[0]?.uploads
                                    }
                                    type="edit"
                                    triggerComponent={
                                      <Button
                                        variant={"main_green_button"}
                                        className="w-full"
                                      >
                                        Edit Review
                                      </Button>
                                    }
                                  />
                                </>
                              ) : (
                                <ReviewModal
                                  activity={data.activity._id}
                                  booking={data._id}
                                  user={userId}
                                  vendor={data.vendor._id}
                                  onSuccess={() => {
                                    setReload(reload + 1);
                                  }}
                                  type="add"
                                  triggerComponent={
                                    <Button
                                      variant={"main_green_button"}
                                      className="w-full"
                                    >
                                      Leave A Review
                                    </Button>
                                  }
                                />
                              )}
                            </>
                          )}
                        </div>
                      </BoxProviderWithName>
                    </BoxProviderWithName>
                  </div>
                </div>
              </div>
            </BoxProviderWithName>
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
