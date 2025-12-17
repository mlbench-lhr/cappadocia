"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
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
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import { PayoutDetailsModal } from "@/components/SmallComponents/PayoutDetailsModal";
import { percentage } from "@/lib/helper/smallHelpers";

const BookingsLoadingSkeleton = () => (
  <div className="w-full space-y-4 animate-pulse">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="h-10 md:h-16 bg-gray-200 rounded-lg" />
    ))}
  </div>
);

// No data component
const NoBookingsFound = () => (
  <NoDataComponent text="No Payouts Requested Yet" />
);
export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshData, setRefreshData] = useState(0);
  const [stats, setStats] = useState<{
    totalRevenue: {
      amount: number;
      percentageChange: number;
      incremented: boolean;
    } | null;
    platformCommission: {
      amount: number;
      percentageChange: number;
      incremented: boolean;
    } | null;
    vendorNet: {
      amount: number;
      percentageChange: number;
      incremented: boolean;
    } | null;
  }>({ totalRevenue: null, platformCommission: null, vendorNet: null });
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/payments/stats");
        const json = await res.json();
        if (res.ok && json?.success) {
          setStats(json.data);
        }
      } catch {}
    })();
  }, []);

  const columns: Column[] = [
    {
      header: "Vendor Name",
      accessor: "vendor?.fullName",
      render: (item) => {
        return <span>{item?.vendor?.fullName}</span>;
      },
    },
    {
      header: "Tour Name",
      accessor: "activity.title",
    },
    {
      header: "Tour Date",
      accessor: "date",
      render: (item) => {
        return (
          <span>
            {moment(item?.booking?.selectDate).format("MMM DD, YYYY | hh:mm A")}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: "paymentStatus",
      render: (item) => <StatusBadge status={item?.paymentStatus} />,
    },
    {
      header: "Requested Date",
      accessor: "date",
      render: (item) => {
        return (
          <span>
            {moment(item?.createdAt).format("MMM DD, YYYY | hh:mm A")}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessor: "role",
      render: (item: ReviewWithPopulatedData) => {
        console.log("item------", item);

        return (
          <PayoutDetailsModal
            stripeAccountId={item?.vendor?.vendorDetails?.stripeAccountId}
            data={{
              _id: item?._id,
              activity: {
                title: item?.activity?.title,
              },
              booking: {
                paymentDetails: {
                  totalAmount: item?.booking?.paymentDetails?.amount,
                  vendorPayable: percentage(
                    85,
                    item?.booking?.paymentDetails?.amount
                  ),
                  commission: 15,
                },
              },
            }}
            onSuccess={() => {
              setRefreshData(refreshData + 1);
            }}
          />
        );
      },
    },
  ];

  // Prepare query params for the API
  const queryParams = {
    search: searchQuery,
    filters: ["completed"],
  };
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  return (
    <BasicStructureWithName name="">
      <div className="flex flex-col justify-start items-start w-full gap-0 h-fit">
        <BoxProviderWithName noBorder={true} name="Payments">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            <BoxProviderWithName name="" className="col-span-1 !py-1 md:!py-3">
              <div className="flex flex-col justify-start items-start gap-0 md:gap-2 w-full">
                <h2 className="text-sm md:text-base font-semibold">
                  Total Revenue
                </h2>
                <span className="text-lg md:text-[37px] font-semibold">
                  €{(stats.totalRevenue?.amount ?? 0).toLocaleString()}
                </span>
                <span
                  className={`text-xs md:text-base font-medium ${
                    stats.totalRevenue?.incremented
                      ? "text-[#51C058]"
                      : "text-red-500"
                  }`}
                >
                  {stats.totalRevenue?.incremented ? "↑" : "↓"} 
                  {(stats.totalRevenue?.percentageChange ?? 0).toFixed(0)}% from
                  last month
                </span>
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName name="" className="col-span-1 !py-1 md:!py-3">
              <div className="flex flex-col justify-start items-start gap-0 md:gap-2 w-full">
                <h2 className="text-sm md:text-base font-semibold">
                  Platform Commission
                </h2>
                <span className="text-lg md:text-[37px] font-semibold">
                  €{(stats.platformCommission?.amount ?? 0).toLocaleString()}
                </span>
                <span
                  className={`text-xs md:text-base font-medium ${
                    stats.platformCommission?.incremented
                      ? "text-[#51C058]"
                      : "text-red-500"
                  }`}
                >
                  {stats.platformCommission?.incremented ? "↑" : "↓"} 
                  {(stats.platformCommission?.percentageChange ?? 0).toFixed(0)}
                  % from last month
                </span>
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName name="" className="col-span-1 !py-1 md:!py-3">
              <div className="flex flex-col justify-start items-start gap-0 md:gap-2 w-full">
                <h2 className="text-sm md:text-base font-semibold">
                  Vendor Net Earnings
                </h2>
                <span className="text-lg md:text-[37px] font-semibold">
                  €{(stats.vendorNet?.amount ?? 0).toLocaleString()}
                </span>
                <span
                  className={`text-xs md:text-base font-medium ${
                    stats.vendorNet?.incremented
                      ? "text-[#51C058]"
                      : "text-red-500"
                  }`}
                >
                  {stats.vendorNet?.incremented ? "↑" : "↓"} 
                  {(stats.vendorNet?.percentageChange ?? 0).toFixed(0)}% from
                  last month
                </span>
              </div>
            </BoxProviderWithName>
          </div>
        </BoxProviderWithName>
        <BoxProviderWithName noBorder={true} name="Payout Requests">
          {/* Server Pagination Provider wraps the table */}
          <ServerPaginationProvider<ReviewWithPopulatedData>
            apiEndpoint="/api/payments/getAdminPayments" // Your API endpoint
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
      </div>
    </BasicStructureWithName>
  );
}
