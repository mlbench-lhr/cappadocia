"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProfileBadge } from "@/components/SmallComponents/ProfileBadge";
import { ClockIcon, StarIcon } from "@/public/allIcons/page";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BookingWithPopulatedData } from "@/lib/types/booking";
import axios from "axios";
import moment from "moment";
import BookingPaymentPageSkeleton from "@/components/Skeletons/BookingPaymentPageSkeleton";

export type DashboardCardProps = {
  image: string;
  title: string;
  description: string;
};

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [payNow, setPayNow] = useState(true);
  console.log("payNow----", payNow);
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);
  const router = useRouter();
  const [data, setData] = useState<BookingWithPopulatedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  const startStripeCheckout = async () => {
    try {
      // DUMMY TEST DATA
      const dummyPayload = {
        items: [
          {
            id: data?._id,
            name: data?.activity.title,
            quantity: 1,
            price: data?.paymentDetails?.amount,
          },
        ],
        bookingId: data?.bookingId,
        customerEmail: data?.user?.email,
        currency: data?.paymentDetails?.currency,
        total: data?.paymentDetails?.amount,
      };
      console.log("dummyPayload--------", dummyPayload);

      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dummyPayload),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response?.error || "Failed to start checkout");
      }

      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error("Stripe checkout URL not available");
      }
    } catch (err: any) {
      console.log("err-------", err);
    }
  };

  if (!data || loading) {
    return <BookingPaymentPageSkeleton />;
  }

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
            <div>
              <RadioGroup
                value={
                  payNow
                    ? "Book Now (Pay Immediately)"
                    : "Reserve Now, Pay Later"
                }
                onValueChange={(e) => {
                  setPayNow(e === "Book Now (Pay Immediately)");
                }}
                className="flex gap-4 flex-col justify-start items-start mt-4 flex-wrap"
              >
                <div className="px-3 py-2 flex items-center justify-start gap-4 border rounded-2xl">
                  <RadioGroupItem
                    value={"Book Now (Pay Immediately)"}
                    id={"Book Now (Pay Immediately)"}
                  />
                  <div className="flex flex-col justify-center gap-1 items-start">
                    <Label
                      className="font-semibold"
                      htmlFor={"Book Now (Pay Immediately)"}
                    >
                      {"Book Now (Pay Immediately)"}
                    </Label>
                    <span className="text-sm font-normal">
                      Secure your booking instantly with online payment.
                    </span>
                    <Link
                      href={"/Cancellation-Policy"}
                      className="text-sm -mt-1 font-normal underline hover:no-underline text-primary"
                    >
                      Cancellation Policy
                    </Link>
                  </div>
                </div>
                <div className="px-3 py-2 flex items-center justify-start gap-4 border rounded-2xl">
                  <RadioGroupItem
                    value={"Reserve Now, Pay Later"}
                    id={"Reserve Now, Pay Later"}
                  />
                  <div className="flex flex-col justify-center gap-1 items-start">
                    <Label
                      className="font-semibold"
                      htmlFor={"Reserve Now, Pay Later"}
                    >
                      {"Reserve Now, Pay Later"}
                    </Label>
                    <span className="text-sm font-normal">
                      Lock your spot today without immediate payment.
                    </span>
                    <Link
                      href={"/Learn-More"}
                      className="text-sm -mt-1 font-normal underline hover:no-underline text-primary"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </RadioGroup>
            </div>
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
                  <Link href={`/explore/vendor/detail/${data.vendor._id}`}>
                    <ProfileBadge
                      isTitleLink={true}
                      size="large"
                      title={data?.vendor?.vendorDetails?.companyName}
                      subTitle={
                        "TÜRSAB Number: " +
                        data?.vendor?.vendorDetails?.tursabNumber
                      }
                      image={data?.vendor?.avatar || "/placeholderDp.png"}
                    />
                  </Link>
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
                      {data.activity.title}
                    </h2>
                    <h3 className="text-sm font-normal">
                      Duration: Full Day ({data.activity.duration} hours)
                    </h3>
                    <h4 className="text-sm font-normal">
                      {`From : ${data.paymentDetails.currency} ${data.activity.slots?.[0]?.adultPrice}/Adult,  ${data.paymentDetails.currency} ${data.activity.slots?.[0]?.adultPrice}/Child`}
                    </h4>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center mt-4">
                  <span className="text-xs font-normal">Date</span>
                  <span className="text-sm font-medium">
                    {moment(data.selectDate).format("MMM DD, YYYY | hh:mm A")}{" "}
                  </span>
                </div>
                <div className="w-full flex justify-between items-center">
                  <span className="text-xs font-normal">Guests</span>
                  <span className="text-sm font-medium">
                    {data.adultsCount} Adults, {data.childrenCount} Children{" "}
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
                <span className="text-lg font-semibold">
                  ${data.paymentDetails.amount}
                </span>
              </div>
            </BoxProviderWithName>
          </BoxProviderWithName>
        </div>
        <div className="w-full md:w-[300px] mt-4">
          {payNow ? (
            <Button
              variant={"main_green_button"}
              className="w-full"
              onClick={startStripeCheckout}
              disabled={loading}
            >
              Pay Now & Confirm Booking
            </Button>
          ) : (
            <Button
              variant={"main_green_button"}
              className="w-full"
              onClick={() => {
                router.push("/bookings/bookingConfirmation/" + id);
              }}
            >
              Reserve Booking
            </Button>
          )}
        </div>
      </div>
    </BasicStructureWithName>
  );
}
