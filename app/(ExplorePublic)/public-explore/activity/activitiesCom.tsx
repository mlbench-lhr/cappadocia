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
      <NoDataComponent text="No Activities Found" />
    </div>
  );
};
export default function ExploreActivities({
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

  return (
    <BoxProviderWithName
      className="!py-0 !p-0"
      noBorder={true}
      name="Popular Activities"
      rightSideLink={type === "both" ? "/explore/activity" : undefined}
      rightSideLabel="View All Activities"
    >
      <ServerPaginationProvider<ToursAndActivityWithVendor>
        apiEndpoint="/api/toursAndActivity/getWithFilters"
        queryParams={{
          category: "Activity",
          search: searchQuery,
        }}
        LoadingComponent={TourAndActivityCardSkeleton}
        NoDataComponent={NoBookingsFound}
        itemsPerPage={type === "both" ? 8 : 8}
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
