"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { CalendarMobile } from "./CalendarMobile";
import { CalendarDesktop } from "./CalendarDesktop";
import { setEvents } from "@/lib/store/slices/calendarSlice";

export default function CalendarPage() {
  const events = useAppSelector((state) => state.calendar.events);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/calendar-events");
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await res.json();
        let withClassNames = data.map((item: any) => {
          let className = "event-container event-4DB6AC";
          switch (item?.type) {
            case "Internships":
              className = "event-container event-4DB6AC";
              break;
            case "Competitions":
              className = "event-container event-FF6F61";
              break;
            case "Community Service":
              className = "event-container event-B39DDB";
              break;
            case "Summer Program":
              className = "event-container event-FF8C66";
              break;
            case "Clubs":
              className = "event-container event-FFF176";
              break;
            default:
              break;
          }
          return {
            ...item,
            className: className,
          };
        });
        console.log("withClassNames------", withClassNames);

        dispatch(setEvents(withClassNames));
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);
  console.log("events------", events);

  return (
    <div className="flex flex-col gap-[32px] justify-start items-start w-full">
      <div className="md:p-4 bg-white md:rounded-[24px] w-full relative">
        {loading ? (
          "Loading..."
        ) : isMobile ? (
          <CalendarMobile captionLayout="dropdown" className="w-full" />
        ) : (
          <CalendarDesktop />
        )}
      </div>
    </div>
  );
}
