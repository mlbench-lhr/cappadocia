"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";
import {
  Column,
  DynamicTable,
} from "@/app/(AdminLayout)/admin/Components/Table/page";
import moment from "moment";
import Link from "next/link";
import { StatusBadge } from "@/components/SmallComponents/StatusBadge";
import { StatusText } from "@/components/SmallComponents/StatusText";
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/mongodb/models/booking";
import Rating from "@/components/SmallComponents/RatingField";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import { ReviewModal } from "@/components/SmallComponents/ReviewModal";
import { ReviewDetailsModal } from "@/components/SmallComponents/ReviewDeatilsModal";

// Loading skeleton component
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

export default function SubmittedReviews({
  searchQuery = "",
}: {
  searchQuery: string;
}) {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
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
      header: "Rating",
      accessor: "status",
      render: (item) => <Rating value={item.rating} iconsSize="18" />,
    },
    {
      header: "Details",
      accessor: "role",
      render: (item) => (
        <ReviewDetailsModal
          data={item}
          onSuccess={() => {
            setRefreshData(refreshData + 1);
          }}
          triggerComponent={
            <div className="w-fit text-primary underline hover:no-underline text-xs font-normal cursor-pointer">
              View Details
            </div>
          }
        />
      ),
    },
    {
      header: "Action",
      accessor: "role",
      render: (item) => {
        console.log("item==============", item);

        return (
          <div className="flex justify-start items-center gap-2">
            <div
              className="flex justify-center items-center p-2 bg-secondary rounded-lg cursor-pointer"
              onClick={() => {
                handleDelete(item._id);
              }}
            >
              <Trash color="#B32053" size={14} />
            </div>
            <ReviewModal
              _id={item._id}
              onSuccess={() => {
                setRefreshData(refreshData + 1);
              }}
              textProp={item.review?.[0]?.text}
              ratingProp={item.rating}
              uploadsProp={item.review?.[0]?.uploads}
              type="edit"
              triggerComponent={
                <div className="w-fit flex justify-center items-center p-2 bg-secondary rounded-lg cursor-pointer">
                  <Pencil color="#B32053" size={14} />
                </div>
              }
            />
          </div>
        );
      },
    },
  ];

  // Prepare query params for the API
  const queryParams = {
    search: searchQuery,
    filters: ["completed"],
  };
  return (
    <BasicStructureWithName name="">
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        <BoxProviderWithName noBorder={true}>
          {/* Server Pagination Provider wraps the table */}
          <ServerPaginationProvider<Booking>
            apiEndpoint="/api/reviews/getAll" // Your API endpoint
            queryParams={queryParams}
            LoadingComponent={BookingsLoadingSkeleton}
            NoDataComponent={NoBookingsFound}
            itemsPerPage={7}
            refreshData={refreshData}
          >
            {(data, isLoading, refetch) => {
              return (
                <div className="w-full space-y-0">
                  <DynamicTable
                    data={data}
                    columns={columns}
                    itemsPerPage={7}
                    onRowClick={(item) => console.log("Clicked:", item)}
                    isLoading={isLoading}
                  />
                </div>
              );
            }}
          </ServerPaginationProvider>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
