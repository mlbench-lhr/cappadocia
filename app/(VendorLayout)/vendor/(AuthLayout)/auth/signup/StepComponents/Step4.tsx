"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SelectInputComponent,
  TextInputComponent,
} from "@/components/SmallComponents/InputComponents";
import { Label } from "@/components/ui/label";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  updateProfileStepBack,
  updateProfileStepNext,
} from "@/lib/store/slices/generalSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { ChevronLeft } from "lucide-react";

export function VendorSignUpStep4({ isVendor }: { isVendor?: Boolean }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useAppDispatch();
  const handleNext = () => {
    dispatch(updateProfileStepNext());
  };
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
          Profile & Branding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-4">
          <TextInputComponent label="About US" />
          <SelectInputComponent
            label="Languages Supported"
            placeholder="Languages Supported"
            options={["English", "Turkish", "Chinese"]}
          />
          <Button variant={"main_green_button"} onClick={handleNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
