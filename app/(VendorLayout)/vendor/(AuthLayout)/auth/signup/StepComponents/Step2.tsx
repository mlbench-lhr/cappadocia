"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  updateProfileStepBack,
  updateProfileStepNext,
} from "@/lib/store/slices/generalSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { ChevronLeft } from "lucide-react";
import AddressLocationSelector, { LocationData } from "@/components/map";

export function VendorSignUpStep2() {
  const dispatch = useAppDispatch();
  const handleNext = () => {
    dispatch(updateProfileStepNext());
  };
  const [location1, setLocation1] = useState<LocationData>({
    address: "1600 Amphitheatre Parkway, Mountain View, CA",
    coordinates: { lat: 37.4224764, lng: -122.0842499 },
  });
  return (
    <Card className="w-full max-w-md auth-box-shadows min-h-fit max-h-full">
      <CardHeader className="space-y-1">
        <button
          onClick={() => dispatch(updateProfileStepBack())}
          className="text-sm text-muted-foreground hover:text-foreground flex items-start justify-start mb-2"
        >
          <ChevronLeft className="mr-2 h-[24px] w-[24px]" color="#B32053" />
          <span className="text-base font-semibold">Go Back</span>
        </button>
        <CardTitle className="heading-text-style-4">
          Address & Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-4">
          <AddressLocationSelector
            value={location1}
            onChange={(data) => {
              setLocation1(data);
            }}
            readOnly={false}
            label="Address & Location"
            className=" w-full h-[188px] rounded-xl "
            placeholder="Enter Address & Location"
          />
          <Button variant={"main_green_button"} onClick={handleNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
