import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import ParticipantsSelector from "@/components/SmallComponents/ParticipantsSelector";
import { Button } from "@/components/ui/button";
import DeadlinePicker from "@/components/ui/datePicker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useAppSelector } from "@/lib/store/hooks";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export const AvailabilityFilter = () => {
  const { id }: { id: string } = useParams();
  const vendorDetails = useAppSelector((s) => s.vendor.vendorDetails);
  const [selectedSlot, setSelectedSlot] = useState<
    | [
        {
          startDate: Date;
          endDate: Date;
          adultPrice: number;
          childPrice: number;
          seatsAvailable: number;
        }
      ]
    | null
    | undefined
  >(undefined);
  console.log("selectedSlot---", selectedSlot);

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>();
  const [participants, setParticipants] = useState<{
    adult: number;
    child: number;
  }>({
    adult: 0,
    child: 0,
  });
  const checkAvailability = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/toursAndActivity/check-availability",
        {
          tourId: id,
          selectedDate: selectedDate,
          selectedLanguage: selectedLanguage,
          participants: participants.adult + participants.child,
        }
      );
      console.log(
        "response.data?.matchingSlots?---",
        response.data?.matchingSlots
      );

      setSelectedSlot(
        response.data?.matchingSlots?.length > 0
          ? response.data?.matchingSlots
          : null
      );
      setLoading(false);
    } catch (error) {
      console.log("error----", error);
    }
  };

  return (
    <BoxProviderWithName
      name="Select your travel date and number of guests to see if this tour is available."
      className="mt-4"
    >
      <div className="w-full grid grid-cols-3 md:grid-cols-11 gap-3">
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
        <div className="col-span-2 flex items-end">
          <Button
            variant={"main_green_button"}
            onClick={checkAvailability}
            loading={loading}
            loadingText="Checking..."
            disabled={!selectedDate || !selectedLanguage || loading}
            className="h-[37px]"
          >
            Check Availability
          </Button>
        </div>
      </div>

      <div className="flex justify-start items-start md:items-center flex-col md:flex-row gap-2 md:gap-5 mt-4">
        {selectedSlot === undefined ? null : selectedSlot === null ? (
          <>
            <span className="text-primary text-[18px] font-semibold">
              Sorry, this date is not available. Please select another date.
            </span>
            <Button variant={"green_secondary_button"} size={"sm"} asChild>
              <Link
                href={`/explore`}
                className="flex justify-start items-center gap-2"
              >
                See See Alternative Tours
                <ArrowRight />
              </Link>
            </Button>
          </>
        ) : (
          <>
            <span className="text-primary text-[18px] font-semibold">
              Available — {vendorDetails?.paymentInfo?.currency || "€"}
              {selectedSlot?.[0]?.adultPrice} per person
            </span>
            <Button variant={"main_green_button"} size={"sm"} asChild>
              <Link href={`/bookings/book/${id}`}> Book now</Link>
            </Button>
          </>
        )}
      </div>
    </BoxProviderWithName>
  );
};
