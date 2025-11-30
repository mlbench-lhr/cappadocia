"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect } from "react";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { TourAndActivityCard } from "@/components/TourAndActivityCard";
import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import { TourAndActivityCardSkeleton } from "@/components/Skeletons/TourAndActivityCardSkeleton";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";

const NoBookingsFound = () => {
  return (
    <div className="col-span-12 flex justify-center items-center">
      <NoDataComponent text="No Tours Found" />
    </div>
  );
};
export default function ExploreTours({
  type = "both",
  filters = "",
  searchQuery,
}: {
  filters?: string;
  searchQuery?: string;
  type: "both" | "Tour" | "Activity";
}) {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);
  console.log("filters", filters);

  return (
    <BoxProviderWithName
      className="!py-0"
      noBorder={true}
      name="Popular Tours"
      rightSideLink={type === "both" ? "/explore/tours" : undefined}
      rightSideLabel="View All Tours"
    >
      <ServerPaginationProvider<ToursAndActivityWithVendor>
        apiEndpoint="/api/toursAndActivity/getAll" // Your API endpoint
        queryParams={{
          category: "Tour",
          search: searchQuery,
          filters: filters.includes("all") ? [] : filters,
        }}
        LoadingComponent={TourAndActivityCardSkeleton}
        NoDataComponent={NoBookingsFound}
        itemsPerPage={type === "both" ? 4 : 7}
        fixedLimit={type === "both" ? true : false}
      >
        {(data, isLoading, refetch) => (
          <div className="w-full space-y-3 grid grid-cols-12 gap-3">
            {data?.map((item, index) => (
              <TourAndActivityCard item={item} key={index} />
            ))}
          </div>
        )}
      </ServerPaginationProvider>
    </BoxProviderWithName>
  );
}
