import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useAppSelector } from "@/lib/store/hooks";
import { getColor, getIcon } from "../Notifications/page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EventsType {
  title: string;
  date: string;
  className: string;
}

export function CalendarMobile({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const events = useAppSelector((state) => state.calendar.events);
  const defaultClassNames = getDefaultClassNames();
  const monthTitle = moment().format("MMMM, YYYY");
  const [date, setDate] = useState<string>(
    moment().startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSSZ")
  );

  console.log("1---------", date);
  console.log("2---------", events);

  return (
    <div className="w-full flex flex-col justify-start items-start gap-[20px]">
      <span className="font-[500] text-[24px]">{monthTitle}</span>
      <DayPicker
        mode="single"
        onSelect={(e: any) => {
          setDate(moment(e).format("YYYY-MM-DD"));
        }}
        captionLayout="dropdown"
        showOutsideDays={showOutsideDays}
        className={cn(
          "group/calendar p-0 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
          String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
          String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
          className
        )}
        formatters={{
          formatMonthDropdown: (date) =>
            date.toLocaleString("default", { month: "short" }),
          ...formatters,
        }}
        classNames={{
          root: cn("w-fit", defaultClassNames.root),
          months: cn(
            "flex gap-4 flex-col md:flex-row relative",
            defaultClassNames.months
          ),
          month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
          nav: cn(
            "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
            defaultClassNames.nav
          ),
          button_previous: cn(
            buttonVariants({ variant: buttonVariant }),
            "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
            defaultClassNames.button_previous
          ),
          button_next: cn(
            buttonVariants({ variant: buttonVariant }),
            "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
            defaultClassNames.button_next
          ),
          month_caption: cn(
            "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
            defaultClassNames.month_caption
          ),
          dropdowns: cn(
            "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
            defaultClassNames.dropdowns
          ),
          dropdown_root: cn(
            "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
            defaultClassNames.dropdown_root
          ),
          dropdown: cn(
            "absolute bg-popover inset-0 opacity-0",
            defaultClassNames.dropdown
          ),
          caption_label: cn(
            "select-none font-medium",
            captionLayout === "label"
              ? "text-sm"
              : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
            defaultClassNames.caption_label
          ),
          table: "w-full border-collapse",
          weekdays: cn("flex", defaultClassNames.weekdays),
          weekday: cn(
            " text-[#3D4A43] rounded-md flex-1 font-[500] text-[16px] select-none uppercase",
            defaultClassNames.weekday
          ),
          week: cn("flex w-full mt-2", defaultClassNames.week),
          week_number_header: cn(
            "select-none w-(--cell-size)",
            defaultClassNames.week_number_header
          ),
          week_number: cn(
            "text-[0.8rem] select-none text-muted-foreground",
            defaultClassNames.week_number
          ),
          day: cn(
            "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
            defaultClassNames.day
          ),
          range_start: cn(
            "rounded-l-md bg-accent",
            defaultClassNames.range_start
          ),
          range_middle: cn("rounded-none", defaultClassNames.range_middle),
          range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
          today: cn(
            "bg-[#B32053] text-accent-foreground rounded-md data-[selected=true]:rounded-none",
            defaultClassNames.today
          ),
          outside: cn(
            "text-muted-foreground aria-selected:text-[#B32053]",
            defaultClassNames.outside
          ),
          disabled: cn(
            "text-muted-foreground opacity-50",
            defaultClassNames.disabled
          ),
          hidden: cn("invisible", defaultClassNames.hidden),
          ...classNames,
        }}
        components={{
          Root: ({ className, rootRef, ...props }) => {
            return (
              <div
                data-slot="calendar"
                ref={rootRef}
                className={cn(className)}
                {...props}
              />
            );
          },
          Chevron: ({ className, orientation, ...props }) => {
            if (orientation === "left") {
              return (
                <ChevronLeftIcon
                  className={cn("size-4", className)}
                  {...props}
                />
              );
            }

            if (orientation === "right") {
              return (
                <ChevronRightIcon
                  className={cn("size-4", className)}
                  {...props}
                />
              );
            }

            return (
              <ChevronDownIcon className={cn("size-4", className)} {...props} />
            );
          },
          DayButton: CalendarDayButton,
          WeekNumber: ({ children, ...props }) => {
            return (
              <td {...props}>
                <div className="flex size-(--cell-size) items-center justify-center text-center">
                  {children}
                </div>
              </td>
            );
          },
          ...components,
        }}
        {...props}
      />
      <div className="w-full flex flex-wrap justify-start items-center gap-[16px] border-t-2 pt-4">
        {events
          .filter((ev) => moment(ev.date).isSame(date, "day"))
          .map((e) => (
            <Popover>
              <PopoverTrigger asChild className="w-full">
                <div
                  key={e.id}
                  className={`${e.className} cursor-pointer text-wrap`}
                  style={{
                    color: "black",
                    width: "100%",
                  }}
                >
                  <div
                    className="flex items-center justify-start gap-[8px]"
                    style={{
                      width: "100%",
                    }}
                  >
                    {e?.type && getIcon[e?.type]}
                    <div
                      className="text-start truncate"
                      style={{
                        width: "fit-content",
                      }}
                    >
                      {e.title}
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
                      backgroundColor: getColor[e?.type],
                    }}
                  ></div>
                  <p className="text-[9px] font-[700] w-full truncate text-gray-800">
                    {e?.title}
                  </p>
                  <p className="text-[8px] font-[700] mt-1">
                    {e?.company || "Tech Innovations"}
                  </p>
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <span className="text-[7px] font-[700] underline capitalize">
                      {e?.type || "Internship"}
                    </span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ))}
      </div>
    </div>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-transparent data-[selected-single=true]:text-black data-[selected-single=true]:border-2 border-[#B32053] data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-[#B32053] group-data-[focused=true]/day:ring-[#B32053] dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[1px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}
