"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useAppSelector } from "@/lib/store/hooks";
import { getColor, getIcon } from "../Notifications/page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CalendarDesktop() {
  const events = useAppSelector((state) => state.calendar.events);
  console.log(events[0]);

  return (
    <>
      <div className="bg-white w-[20px] h-[40px] absolute left-2 top-[68px] z-[10]"></div>
      <div className="bg-white w-[20px] h-[40px] absolute right-2 top-[68px] z-[10]"></div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        validRange={{
          start: new Date(new Date().getFullYear(), 0, 1),
          end: new Date(new Date().getFullYear(), 11, 31),
        }}
        headerToolbar={{
          left: "today prev,next title",
          center: "",
          right: "",
        }}
        dayHeaderFormat={{ weekday: "narrow" }}
        eventContent={(arg) => {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={`${arg.event.extendedProps.className} cursor-pointer`}
                  style={{ color: "black", width: "100%" }}
                >
                  <div className="w-full flex items-center justify-start gap-[8px]">
                    <div
                      className="h-[10px] flex justify-center items-center rounded-full"
                      style={{ width: "10px" }}
                    >
                      {arg?.event?._def?.extendedProps?.type &&
                        getIcon[arg?.event?._def?.extendedProps?.type]}
                    </div>
                    <div
                      className="text-start truncate"
                      style={{ width: "calc(100% - 18px)" }}
                    >
                      {arg.event.title}
                    </div>
                  </div>
                </div>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="start"
                sideOffset={8}
                className="p-4 rounded-xl shadow-md border-none w-[200px]"
                style={{ zIndex: 100000000 }}
              >
                <div className="pl-3 relative w-full">
                  <div
                    className={`cursor-pointer left-0 top-0 h-full absolute w-[4px] rounded-full`}
                    style={{
                      backgroundColor:
                        getColor[arg?.event?._def?.extendedProps?.type],
                    }}
                  ></div>
                  <p className="text-[9px] font-[700] w-full truncate text-gray-800">
                    {arg.event.title}
                  </p>
                  <p className="text-[8px] font-[700] mt-1">
                    {arg.event.extendedProps.company || "Tech Innovations"}
                  </p>
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <span className="text-[7px] font-[700] underline capitalize">
                      {arg?.event?._def?.extendedProps?.type || "Internship"}
                    </span>
                    <span className="text-[7px] font-[400]">
                      Due:
                      {arg.event.start
                        ? new Date(arg.event.start).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          );
        }}
        events={events}
        height="auto"
        dayMaxEventRows={2}
      />
    </>
  );
}