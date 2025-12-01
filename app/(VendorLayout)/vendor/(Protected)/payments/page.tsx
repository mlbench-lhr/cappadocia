"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { Column } from "@/app/(AdminLayout)/admin/Components/Table/page";
import Rating from "@/components/SmallComponents/RatingField";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import { ReviewModal } from "@/components/SmallComponents/ReviewModal";
import { ReviewDetailsModal } from "@/components/SmallComponents/ReviewDeatilsModal";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { DynamicTable } from "@/app/(AdminLayout)/admin/Components/Table/page";
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { Button } from "@/components/ui/button";
import { ReviewWithPopulatedData } from "@/lib/types/review";
import moment from "moment";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import { StatusText } from "@/components/SmallComponents/StatusText";
import Link from "next/link";
import { IconAndTextTab2 } from "@/components/SmallComponents/IconAndTextTab";
const BookingsLoadingSkeleton = () => (
  <div className="w-full space-y-4 animate-pulse">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-200 rounded-lg" />
    ))}
  </div>
);

// No data component
const NoBookingsFound = () => (
  <NoDataComponent
    text="You don’t have any bookings yet."
    actionComponent={
      <Button variant={"main_green_button"}>Start Exploring Now</Button>
    }
  />
);
export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshData, setRefreshData] = useState(0);
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Delete Blog",
      text: "Are you sure you want to delete this Blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B32053",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/reviews/delete/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          if (res.ok) {
            console.log(`Milestone ${id} marked as skipped`);
          } else {
            console.error("Failed to skip milestone");
          }
        } catch (err) {
          console.error("Error skipping milestone:", err);
        } finally {
          setRefreshData(refreshData + 1);
        }
      }
    });
  };

  const columns: Column[] = [
    {
      header: "Tour Title",
      accessor: "activity.title",
    },
    {
      header: "Booking ID",
      accessor: "bookingId",
    },
    {
      header: "Tour Status",
      accessor: "status",
      render: (item) => <StatusText status={item.status} />,
    },
    {
      header: "Amount",
      accessor: "amount",
    },
    {
      header: "Date",
      accessor: "date",
      render: (item) => {
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
      render: (item) => (
        <Link
          href={`/invoices/detail/${item.invoice}`}
          className="text-[#B32053] underline"
        >
          View Details
        </Link>
      ),
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
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <BoxProviderWithName name="" className="col-span-1">
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <h2 className="text-sm md:text-base font-semibold">
                  Total Sales (Gross)
                </h2>
                <span className="text-2xl md:text-[37px] font-semibold text-[#20B322]">
                  $1,450
                </span>
                <span className="text-sm md:text-base font-medium text-black/60">
                  Eligible for withdrawal
                </span>
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName name="" className="col-span-1">
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <h2 className="text-sm md:text-base font-semibold">
                  Pending Earnings
                </h2>
                <span className="text-2xl md:text-[37px] font-semibold text-[#FE9F10]">
                  $320
                </span>
                <span className="text-sm md:text-base font-medium text-black/60">
                  Available after tour completion
                </span>
              </div>
            </BoxProviderWithName>
            <BoxProviderWithName name="" className="col-span-1">
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <h2 className="text-sm md:text-base font-semibold">
                  Total Paid Out
                </h2>
                <span className="text-2xl md:text-[37px] font-semibold">
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
          <div className="bg-[#FFF5DF] w-full md:w-[550px] px-3 py-2 rounded-lg">
            <IconAndTextTab2
              alignClass=" items-center !gap-3"
              textClasses=" text-black/80 text-[14px] font-medium "
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
        </BoxProviderWithName>
        <BoxProviderWithName noBorder={true} name="Payout Details">
          {/* Server Pagination Provider wraps the table */}
          <ServerPaginationProvider<ReviewWithPopulatedData>
            apiEndpoint="/api/reviews/getAll" // Your API endpoint
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
