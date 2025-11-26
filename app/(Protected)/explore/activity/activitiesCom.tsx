"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { TourAndActivityCard } from "@/components/TourAndActivityCard";
import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import axios from "axios";
import { TourAndActivityCardSkeleton } from "@/components/Skeletons/TourAndActivityCardSkeleton";

export default function ExploreActivities({
  type = "both",
}: {
  type: "both" | "Tour" | "Activity";
}) {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const [activity, setActivity] = useState<ToursAndActivityWithVendor[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(
          `/api/toursAndActivity/getAll?category=Activity`
        );
        console.log("response----", response);

        if (response.data?.data) {
          setActivity(response.data?.data);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, []);

  return (
    <BoxProviderWithName
      className="!py-0"
      noBorder={true}
      name="Popular Activities"
      rightSideLink={type === "both" ? "/explore/activity" : undefined}
      rightSideLabel="View All Activities"
    >
      <div className="w-full space-y-3 grid grid-cols-12 gap-3">
        {loading
          ? [0, 1, 2, 3]?.map((item) => (
              <TourAndActivityCardSkeleton key={item} />
            ))
          : activity?.map((item, index) => (
              <TourAndActivityCard item={item} key={index} />
            ))}
      </div>
    </BoxProviderWithName>
  );
}
