"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import moment from "moment";

export default function DeadlinePicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: any;
}) {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      <label className="label-style">Due Date</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal input-style ${
              !date && "text-muted-foreground"
            }`}
          >
            {date ? (
              moment(date).format("MMM DD, YYYY")
            ) : (
              <span>Select Due Date</span>
            )}
          </Button>
        </PopoverTrigger>
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
