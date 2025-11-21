"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { TourAndActivityCard } from "@/components/TourAndActivityCard";
import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import axios from "axios";

export default function ExploreTours() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const [tours, setTours] = useState<ToursAndActivityWithVendor[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await axios.get(
          `/api/toursAndActivity/getAll?category=Tour`
        );
        console.log("response----", response);

        if (response.data?.data) {
          setTours(response.data?.data);
        }
        setLoading(false);
      } catch (error) {
        console.log("err---", error);
      }
    };
    getData();
  }, []);

  if (!tours) {
    return null;
  }

  return (
    <BoxProviderWithName
      className="!py-0"
      noBorder={true}
      name="Popular Tours"
      rightSideLink={"/explore/tours"}
      rightSideLabel="View All Tours"
    >
      <div className="w-full space-y-3 grid grid-cols-12 gap-3">
        {tours.map((item, index) => (
          <TourAndActivityCard item={item} key={index} />
        ))}
      </div>
    </BoxProviderWithName>
  );
}
