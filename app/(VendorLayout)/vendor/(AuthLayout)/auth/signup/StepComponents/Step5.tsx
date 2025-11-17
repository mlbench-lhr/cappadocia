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
import { Checkbox } from "@/components/ui/checkbox";

export function VendorSignUpStep5({ isVendor }: { isVendor?: Boolean }) {
  const [check, setCheck] = useState(false);
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
          Bank & Payment Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-4">
          <TextInputComponent label="IBAN Number" />
          <TextInputComponent label="Bank Name" />
          <TextInputComponent label="Account Holder Name" />
          <SelectInputComponent
            label="Currency"
            placeholder="Currency"
            options={["Euro (EUR)", "US Dollar (USD)", "Turkish Lira (TRY)"]}
          />
          <div className="flex items-center justify-start space-x-2">
            <Checkbox
              id="agreedToTerms"
              checked={check}
              onCheckedChange={(e) => {
                setCheck(!check);
              }}
            />
            <Label htmlFor="agreedToTerms">
              <span className="text-sm font-medium leading-5">
                I have read and agree to the Legal Partner Agreement
              </span>
            </Label>
          </div>
          <Button variant={"main_green_button"} onClick={handleNext}>
            Next
          </Button>
        </div>
        <div className="plan-text-style-3 text-center">
          Already have an account?
          <Link
            href={isVendor ? "/vendor/auth/login" : "/auth/login"}
            className="text-[#B32053] font-[500] hover:underline"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
