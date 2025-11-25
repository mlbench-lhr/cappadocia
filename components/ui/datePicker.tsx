"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { X } from "lucide-react";
import moment from "moment";

export default function DeadlinePicker({
  date,
  setDate,
  onRemove,
}: {
  date: Date | undefined;
  setDate: any;
  onRemove?: any;
}) {
  return (
    <div className="flex flex-col gap-[10px] w-full relative">
      <Popover>
        <div>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-between text-left font-medium text-xs flex items-center border-none shadow-none h-[37px] ps-0 px-0 hover:bg-transparent ${
                !date && "text-muted-foreground"
              }`}
            >
              {date ? moment(date).format("MMM DD, YYYY") : <span>Date</span>}
            </Button>
          </PopoverTrigger>
          {date && (
            <X
              className="cursor-pointer absolute top-1/2 translate-y-[-50%] right-3 z-40"
              onClick={() => {
                onRemove();
              }}
              size={16}
            />
          )}
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) =>
              d && setDate(moment(d).format("YYYY-MM-DDTHH:mm:ss.SSSZ"))
            }
            initialFocus
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
