"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useMemo, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { InvoiceTextBoxes } from "@/components/InvoiceTextBoxes";

import { InvoicePopulated } from "@/lib/types/invoices";
import { useParams } from "next/navigation";
import axios from "axios";
import { multiply } from "@/lib/helper/smallHelpers";
import { InvoiceDetailSkeleton } from "@/components/Skeletons/InvoiceDetailSkeleton";
export type InvoiceData = {
  invoice: {
    invoiceNumber: string;
    invoiceDate: Date | null; // ISO date string (YYYY-MM-DD)
    bookingId: string;
  };
  tourDetails: {
    title: string;
    dateTime: string; // ISO date-time string
    participants: {
      adults: number;
      children: number;
    };
    durationHours: number;
    meetingPoint: string;
  };
  travelerInformation: {
    fullName: string;
    passportNumber: string;
    nationality: string;
    contact: string;
    email: string;
  };
  paymentDetails: {
    method: string;
    transactionId: string;
    currency: string;
    amountPaid: number;
    status: string;
  };
  priceBreakdown: {
    basePrice: {
      adults: number;
      currency: string;
      perAdult: number;
      total: number;
    };
    childPrice: {
      children: number;
      currency: string;
      perChild: number;
      total: number;
    };
    participants?: {
      adults: number;
      children?: number;
    };
    serviceFee?: number;
    totalPaid: number;
  };
  vendorInformation: {
    operator: string;
    tursabNumber: string;
    contact: string;
    email: string;
  };
};

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const [data, setData] = useState<InvoicePopulated | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { id }: { id: string } = useParams();
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`/api/invoices/detail/${id}`);
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

  const invoiceData: InvoiceData = useMemo(() => {
    return {
      invoice: {
        invoiceNumber: data?.invoicesId || "",
        invoiceDate: data?.createdAt || null,
        bookingId: data?.booking.bookingId || "",
      },
      tourDetails: {
        title: data?.activity.title || "",
        dateTime: data?.booking.selectDate || "",
        participants: {
          adults: data?.booking.adultsCount || 0,
          children: data?.booking.childrenCount || 0,
        },
        durationHours: data?.activity.duration || 0,
        meetingPoint: data?.booking.pickupLocation?.address || "",
      },
      travelerInformation: {
        fullName: data?.booking.travelers[0].fullName || "",
        passportNumber: data?.booking.travelers[0].passport || "",
        nationality: data?.booking.travelers[0].nationality || "",
        contact: data?.user?.phoneNumber || "",
        email: data?.user.email || "",
      },
      paymentDetails: {
        method: "MasterCard **** 4421",
        transactionId: data?.booking.paymentDetails.paymentIntentId || "",
        currency: data?.booking.paymentDetails.currency || "",
        amountPaid: data?.booking.paymentDetails.amount || 0,
        status: data?.booking.paymentStatus || "",
      },
      priceBreakdown: {
        basePrice: {
          adults: data?.booking.adultsCount || 0,
          currency: data?.booking.paymentDetails.currency || "",
          perAdult: data?.activity.slots[0].adultPrice || 0,
          total: multiply(
            data?.booking.adultsCount || 0,
            data?.activity.slots[0].adultPrice || 0
          ),
        },
        childPrice: {
          children: data?.booking.childrenCount || 0,
          currency: data?.booking.paymentDetails.currency || "",
          perChild: data?.activity.slots[0].childPrice || 0,
          total: multiply(
            data?.booking.childrenCount || 0,
            data?.activity.slots[0].childPrice || 0
          ),
        },
        // serviceFee: 20,
        totalPaid: data?.booking.paymentDetails.amount || 0,
      },
      vendorInformation: {
        operator: data?.vendor?.vendorDetails?.contactPersonName || "",
        tursabNumber: data?.vendor?.vendorDetails?.tursabNumber || "",
        contact: data?.vendor?.vendorDetails?.contactPhoneNumber || "",
        email: data?.vendor?.vendorDetails?.businessEmail || "",
      },
    };
  }, [data?.invoicesId]);

  return (
    <BasicStructureWithName name="Invoice Details" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        <BoxProviderWithName noBorder={true}>
          <div className="w-full flex flex-col justify-start items-start gap-4 md:gap-6">
            <div className="w-full flex flex-col justify-start items-start gap-y-7 md:gap-y-7 h-fit md:h-[550px] flex-nowrap md:flex-wrap">
              {loading ? (
                <InvoiceDetailSkeleton />
              ) : (
                Object.entries(invoiceData).map(([heading, textList]) => (
                  <InvoiceTextBoxes
                    key={heading}
                    heading={heading}
                    textList={textList}
                  />
                ))
              )}
            </div>
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
