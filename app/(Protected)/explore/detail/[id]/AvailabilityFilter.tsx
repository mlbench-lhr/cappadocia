import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import ParticipantsSelector from "@/components/SmallComponents/ParticipantsSelector";
import { Button } from "@/components/ui/button";
import DeadlinePicker from "@/components/ui/datePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";

export const AvailabilityFilter = () => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>();
  const [participants, setParticipants] = useState<{
    adult: number;
    child: number;
  }>({
    adult: 0,
    child: 0,
  });
  const checkAvailability = () => {
    console.log("filters----", {
      selectedDate: selectedDate,
      selectedLanguage: selectedLanguage,
      participants: participants.adult + participants.child,
    });
  };

  return (
    <BoxProviderWithName
      name="Select your travel date and number of guests to see if this tour is available."
      className="mt-4"
    >
      <div
        id="checkAvailabilityToggle"
        className="w-full grid grid-cols-3 md:grid-cols-9 gap-3"
      >
        <div className="space-y-1 col-span-3">
          <Label className="text-[14px] font-semibold">Select Date</Label>
          <div className="overflow-hidden flex justify-start items-center h-[36px] file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#F3F3F3] md:text-xs">
            <DeadlinePicker date={selectedDate} setDate={setSelectedDate} />
            {/* <Input type="date" /> */}
          </div>
        </div>
        <div className="space-y-1 col-span-3">
          <Label className="text-[14px] font-semibold">Language</Label>
          <Select
            onValueChange={(e) => {
              setSelectedLanguage(e);
            }}
          >
            <SelectTrigger className="w-full">English</SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Turkish">Turkish</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 col-span-3">
          <ParticipantsSelector
            participants={participants}
            setParticipants={setParticipants}
          />
        </div>
      </div>

      <div className="flex justify-start items-start md:items-center flex-col md:flex-row gap-2 md:gap-5 mt-4">
        {selectedSlot ? (
          <>
            <span className="text-primary text-[18px] font-semibold">
              Available — €120 per person
            </span>
            <Button variant={"main_green_button"} size={"sm"}>
              <Link href={`/bookings/book`}> Book now</Link>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={"main_green_button"}
              size={"sm"}
              onClick={checkAvailability}
            >
              Check Availability
            </Button>
          </>
        )}
      </div>
    </BoxProviderWithName>
  );
};
