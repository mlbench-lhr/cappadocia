"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextInputComponent } from "@/components/SmallComponents/InputComponents";
import { Label } from "@/components/ui/label";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateProfileStepNext } from "@/lib/store/slices/generalSlice";
import { useAppDispatch } from "@/lib/store/hooks";

export function VendorSignUpStep1({ isVendor }: { isVendor?: Boolean }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useAppDispatch();
  const handleNext = () => {
    dispatch(updateProfileStepNext());
  };

  return (
    <Card className="w-full max-w-md auth-box-shadows min-h-fit max-h-full">
      <CardHeader className="space-y-1">
        <CardTitle className="heading-text-style-4">
          Vendor Application Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-4">
          <TextInputComponent label="Company / Operator Name" />
          <TextInputComponent label="Contact Person Name" />
          <TextInputComponent label="Business Email" />
          <div className="space-y-1 col-span-1">
            <Label className="text-[14px] font-semibold">Phone Number</Label>
            <PhoneNumberInput
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
            />
          </div>
          <TextInputComponent label="TÜRSAB Number" />
          <Button variant={"main_green_button"} onClick={handleNext}>
            Next
          </Button>
        </div>
        <div className="plan-text-style-3 text-center">
          Already have an account?{" "}
          <Link
            href={"/vendor/auth/login"}
            className="text-[#B32053] font-[500] hover:underline"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
