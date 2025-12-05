"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { TourAndActivityCard } from "@/components/TourAndActivityCard";
import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import axios from "axios";
import { useParams } from "next/navigation";

export const AlternativeOptions = () => {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const [activity, setActivity] = useState<ToursAndActivityWithVendor[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const { id }: { id: string } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(
          `/api/toursAndActivity/getAll?limit=4&alternativeOf=${id}`
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

  if (!activity || activity.length < 1) {
    return null;
  }

  return (
    <BoxProviderWithName
      name="Alternative Options"
      noBorder={true}
      className="!p-0 mt-4"
      rightSideLink="/explore"
      rightSideLabel="See All"
    >
      <div className="w-full space-y-3 grid grid-cols-12 gap-3">
        {activity.map((item, index) => (
          <TourAndActivityCard key={index} item={item} />
        ))}
      </div>
    </BoxProviderWithName>
  );
};
