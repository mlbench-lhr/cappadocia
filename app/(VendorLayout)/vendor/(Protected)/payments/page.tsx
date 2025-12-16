"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useMemo, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { Column } from "@/app/(AdminLayout)/admin/Components/Table/page";
import Swal from "sweetalert2";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { DynamicTable } from "@/app/(AdminLayout)/admin/Components/Table/page";
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { Button } from "@/components/ui/button";
import { ReviewWithPopulatedData } from "@/lib/types/review";
import moment from "moment";
import { StatusText } from "@/components/SmallComponents/StatusText";
import Link from "next/link";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
import axios from "axios";
import { percentage } from "@/lib/helper/smallHelpers";
import { createOnboardingLink } from "@/lib/utils/stripeConnnect";
import { useRouter } from "next/navigation";

const BookingsLoadingSkeleton = () => (
  <div className="w-full space-y-4 animate-pulse">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="h-10 md:h-16 bg-gray-200 rounded-lg" />
    ))}
  </div>
);

// No data component
const NoBookingsFound = () => <NoDataComponent text="No Data Found" />;
export interface VendorInvoice {
  _id: string;
  booking: { _id: string };
  activity: { _id: string };
  user: string;
  invoiceId: string;
  tourTitle: string;
  bookingId: string;
  amount: number;
  currency: string;
  date: string | null;
  payoutStatus: "Eligible" | "Not Eligible" | "Not Eligible";
}
type StripeStatus = {
  connected: boolean;
  charges_enabled?: boolean;
  payouts_enabled?: boolean;
  details_submitted?: boolean;
  transfers_active?: boolean;
};

export default function PaymentsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshData, setRefreshData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [status, setStatus] = useState<StripeStatus | null>(null);
  const router = useRouter();
  const userData = useAppSelector((s) => s.auth.user);
  console.log("status--", status);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const addPayment = async (paymentData: any) => {
    try {
      setLoading(true);
      await axios.post("/api/payments/addPayment", paymentData);
      setRefreshData(refreshData + 1);
    } catch (error) {
      console.log("error----", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column[] = [
    {
      header: "Tour Title",
      accessor: "tourTitle",
    },
    {
      header: "Booking ID",
      accessor: "bookingId",
    },
    {
      header: "Tour Status",
      accessor: "payoutStatus",
      render: (item) => <StatusText status={item.payoutStatus} />,
    },
    {
      header: "Amount",
      accessor: "amount",
    },
    {
      header: "Date",
      accessor: "date",
      render: (item) => {
        console.log("item-----------", item);

        return (
          <span>
            {moment(item?.selectDate).format("MMM DD, YYYY | hh:mm A")}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessor: "role",
      render: (item: VendorInvoice) =>
        item.payoutStatus === "Eligible" ? (
          <div
            className="w-fit text-primary underline hover:no-underline text-xs font-normal cursor-pointer"
            onClick={() => {
              addPayment({
                booking: item.booking._id,
                activity: item.activity._id,
                vendor: userData?.id,
                user: item.user,
                total: item.amount,
                vendorPayment: percentage(15, item.amount),
                commission: 15,
              });
            }}
          >
            {!loading ? "Request Payout" : "Requesting.."}
          </div>
        ) : (
          <Link
            href={`/invoices/detail/${item._id}`}
            className="text-[#B32053] underline"
          >
            View Invoice
          </Link>
        ),
    },
  ];

  // Prepare query params for the API
  const queryParams = {
    search: searchQuery,
  };

  const getOnboardingLink = async () => {
    try {
      setLoadingBtn(true);
      let resp = await axios.post("/api/payments/create-connect-link", {
        stripeAccountId: userData?.vendorDetails?.stripeAccountId,
      });
      console.log("resp-------", resp);
      setLoadingBtn(false);
      router.push(resp.data.onboardingLink);
    } catch (error) {
      console.log("error=======", error);
    }
  };

  useEffect(() => {
    const getStatus = async () => {
      try {
        setLoading(true);
        let resp = await axios.post<StripeStatus>(
          "/api/payments/account-status",
          {
            stripeAccountId: userData?.vendorDetails?.stripeAccountId,
          }
        );
        setStatus(resp.data);
        console.log("resp-------", resp.data);
        setLoading(false);
      } catch (error) {
        console.log("error=======", error);
      }
    };
    userData?.vendorDetails?.stripeAccountId && getStatus();
  }, [userData?.vendorDetails?.stripeAccountId]);
  const needsAction = useMemo(
    () =>
      Boolean(
        status?.connected &&
          (!status?.payouts_enabled ||
            !status?.details_submitted ||
            !status?.transfers_active)
      ),
    [status?.connected]
  );

  return (
    <BasicStructureWithName name="">
      <div className="flex flex-col justify-start items-start w-full gap-0 h-fit">
        <BoxProviderWithName noBorder={true} name="Payments">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4">
            <BoxProviderWithName name="" className="col-span-1 !py-1 md:!py-3">
              <div className="flex flex-col justify-start items-start gap-0 md:gap-2 w-full">
                <h2 className="text-sm md:text-base font-semibold">
                  Total Sales (Gross)
                </h2>
                <span className="text-lg md:text-[32px] font-semibold text-[#20B322]">
                  $1,450
                </span>
                <span className="text-sm md:text-base font-medium text-black/60">
                  Eligible for withdrawal
                </span>
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName name="" className="col-span-1 !py-1 md:!py-3">
              <div className="flex flex-col justify-start items-start gap-0 md:gap-2 w-full">
                <h2 className="text-sm md:text-base font-semibold">
                  Pending Earnings
                </h2>
                <span className="text-lg md:text-[32px] font-semibold text-[#FE9F10]">
                  $320
                </span>
                <span className="text-sm md:text-base font-medium text-black/60">
                  Available after tour completion
                </span>
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName name="" className="col-span-1 !py-1 md:!py-3">
              <div className="flex flex-col justify-start items-start gap-0 md:gap-2 w-full">
                <h2 className="text-sm md:text-base font-semibold">
                  Total Paid Out
                </h2>
                <span className="text-lg md:text-[32px] font-semibold">
                  $2,592
                </span>
                <span className="text-sm md:text-base font-medium text-black/60">
                  Last 3 months
                </span>
              </div>
            </BoxProviderWithName>
          </div>
        </BoxProviderWithName>
        <BoxProviderWithName
          noBorder={true}
          textClasses=" text-[18px] font-semibold "
        >
          <div className="w-full flex flex-wrap gapy-2 justify-between items-center">
            <div className="bg-[#FFF5DF] w-full md:w-[550px] flex px-3 py-2 rounded-lg justify-between items-center">
              <IconAndTextTab2
                alignClass=" items-center !gap-3"
                textClasses=" text-black/80 text-xs md:text-[14px] font-medium "
                text="You can request payout 1 day after the activity has been completed."
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.905 6.52 11.0007 6.28267 11 6C10.9993 5.71733 10.9033 5.48 10.712 5.288C10.5207 5.096 10.2833 5 10 5C9.71667 5 9.47933 5.096 9.288 5.288C9.09667 5.48 9.00067 5.71733 9 6C8.99933 6.28267 9.09533 6.52033 9.288 6.713C9.48067 6.90567 9.718 7.00133 10 7ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88334 18.6867 3.825 17.9743 2.925 17.075C2.025 16.1757 1.31267 15.1173 0.788001 13.9C0.263335 12.6827 0.000667933 11.3827 1.26582e-06 10C-0.000665401 8.61733 0.262001 7.31733 0.788001 6.1C1.314 4.88267 2.02633 3.82433 2.925 2.925C3.82367 2.02567 4.882 1.31333 6.1 0.788C7.318 0.262667 8.618 0 10 0C11.382 0 12.682 0.262667 13.9 0.788C15.118 1.31333 16.1763 2.02567 17.075 2.925C17.9737 3.82433 18.6863 4.88267 19.213 6.1C19.7397 7.31733 20.002 8.61733 20 10C19.998 11.3827 19.7353 12.6827 19.212 13.9C18.6887 15.1173 17.9763 16.1757 17.075 17.075C16.1737 17.9743 15.1153 18.687 13.9 19.213C12.6847 19.739 11.3847 20.0013 10 20Z"
                      fill="#D59E29"
                    />
                  </svg>
                }
              />
            </div>
            <div className="flex items-center gap-3">
              {status === null ? null : !status?.connected ? (
                <Button
                  variant={"main_green_button"}
                  onClick={getOnboardingLink}
                  loading={loadingBtn}
                >
                  Connect Bank Account
                </Button>
              ) : (
                <div className="flex justify-start items-center gap-2 mt-3 md:mt-0 flex-wrap">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs md:text-sm">
                    Connected
                  </span>
                  <span
                    className={`px-3 py-1 rounded-md text-xs md:text-sm ${
                      status?.payouts_enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {status?.payouts_enabled
                      ? "Payouts Enabled"
                      : "Payouts Pending"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-md text-xs md:text-sm ${
                      status?.details_submitted
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Details{" "}
                    {status?.details_submitted ? "Submitted" : "Missing"}
                  </span>

                  {needsAction && (
                    <button
                      onClick={getOnboardingLink}
                      className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
                    >
                      Details Missing
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </BoxProviderWithName>
        <BoxProviderWithName noBorder={true} name="Payout Details">
          {/* Server Pagination Provider wraps the table */}
          <ServerPaginationProvider<VendorInvoice>
            apiEndpoint="/api/payments/getVendorPayments" // Your API endpoint
            queryParams={queryParams}
            LoadingComponent={BookingsLoadingSkeleton}
            NoDataComponent={NoBookingsFound}
            itemsPerPage={7}
            refreshData={refreshData}
          >
            {(data, isLoading, refetch) => (
              <BoxProviderWithName name="">
                <DynamicTable
                  data={data}
                  columns={columns}
                  itemsPerPage={7}
                  onRowClick={(item) => console.log("Clicked:", item)}
                  isLoading={isLoading}
                />
              </BoxProviderWithName>
            )}
          </ServerPaginationProvider>
        </BoxProviderWithName>
        <BoxProviderWithName noBorder={true} name="Commission Breakdown">
          <BoxProviderWithName name="">
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="flex justify-between items-start w-full">
                <h2 className="text-xs md:text-sm font-semibold">
                  Total Sales (Gross)
                </h2>
                <span className="text-xs md:text-sm font-semibold">
                  €10,050.00
                </span>
              </div>
              <div className="flex justify-between items-start w-full">
                <h2 className="text-xs md:text-sm font-semibold">
                  Platform Fee (10%)
                </h2>
                <span className="text-xs md:text-sm font-semibold text-[#FF1313]">
                  -$145.00
                </span>
              </div>
              <div className="flex justify-between items-start w-full pt-2 border-t">
                <h2 className="text-sm md:text-base font-semibold">
                  Net Revenue (After Commission):
                </h2>
                <span className="text-sm md:text-base font-semibold text-[#4A9E35]">
                  €8,300.00
                </span>
              </div>
            </div>
          </BoxProviderWithName>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
