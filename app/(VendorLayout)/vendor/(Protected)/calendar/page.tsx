"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import CalendarGrid from "@/components/Calendar/page";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";

type Slot = {
  startDate: Date;
  endDate: Date;
  adultPrice: number;
  childPrice: number;
  seatsAvailable: number;
};

export default function CalendarPage() {
  const [tours, setTours] = useState<any[]>([]);

  const fetchTours = async () => {
    const res = await axios.get("/api/toursAndActivity/getAll", {
      params: { page: 1, limit: 500 },
    });
    const items = res.data?.data || [];
    setTours(items);
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <BasicStructureWithName name="Vendor Calendar" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-5 h-fit p-4">
        {tours.map((t, idx) => {
          const slots: Slot[] = Array.isArray(t.slots)
            ? t.slots.map((s: any) => ({
                startDate: new Date(s.startDate),
                endDate: new Date(s.endDate),
                adultPrice: Number(s.adultPrice) || 0,
                childPrice: Number(s.childPrice) || 0,
                seatsAvailable: Number(s.seatsAvailable) || 0,
              }))
            : [];
          const stops: Date[] = Array.isArray(t.stopBookingDates)
            ? t.stopBookingDates.map((d: any) => new Date(d))
            : [];
          return (
            <BoxProviderWithName key={t._id || idx} name={t.title || "Tour"}>
              <CalendarGrid
                title={t.title}
                defaultSlots={slots}
                defaultStopBookingDates={stops}
                readOnly={true}
              />
            </BoxProviderWithName>
          );
        })}
      </div>
    </BasicStructureWithName>
  );
}
