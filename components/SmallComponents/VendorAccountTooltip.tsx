import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

export function VendorAccountTooltip() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="!text-xs md:!text-sm"
        >
          <Info />
          Pending
          <span className="hidden md:flex">Approval</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="text-xs md:text-sm">
        Your vendor account has not been approved yet. All your tours will not
        become public till then.
      </PopoverContent>
    </Popover>
  );
}
