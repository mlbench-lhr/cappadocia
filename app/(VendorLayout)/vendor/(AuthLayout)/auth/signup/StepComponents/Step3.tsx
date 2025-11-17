"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileInputComponent,
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

export function VendorSignUpStep3({ isVendor }: { isVendor?: Boolean }) {
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
        <CardTitle className="heading-text-style-4">Documents Upload</CardTitle>
        <span className="text-base text-black/70 font-medium">
          (Please upload clear PDF/JPG copies. Multiple files allowed)
        </span>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-4">
          <FileInputComponent label="(Tax Certificate, TÜRSAB Certificate, Business License)" />
          <Button variant={"main_green_button"} onClick={handleNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
