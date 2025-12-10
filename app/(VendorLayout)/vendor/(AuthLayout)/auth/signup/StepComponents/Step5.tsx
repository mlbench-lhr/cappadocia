"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setPaymentInfo, setVendorField } from "@/lib/store/slices/vendorSlice";
import { useEffect, useState } from "react";
import {
  SelectInputComponent,
  TextInputComponent,
} from "@/components/SmallComponents/InputComponents";

const step5Schema = z.object({
  ibanNumber: z.string().min(15, "IBAN must be at least 15 characters"),
  bankName: z.string().min(2, "Bank name is required"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  currency: z.string().min(1, "Currency selection is required"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

type Step5FormData = z.infer<typeof step5Schema>;

const currencyOptions = ["Euro (EUR)", "US Dollar (USD)", "Turkish Lira (TRY)"];
const labelToSymbol = (v: string) =>
  v.includes("USD") ? "$" : v.includes("EUR") ? "€" : v.includes("TRY") ? "₺" : v;
const symbolToLabel = (s: string) =>
  s === "$" ? "US Dollar (USD)" : s === "€" ? "Euro (EUR)" : s === "₺" ? "Turkish Lira (TRY)" : "";

interface VendorSignupStep5Props {
  onNext?: () => void;
  onBack?: () => void;
  loading?: boolean;
}

export default function VendorSignupStep5({
  onNext,
  onBack,
  loading = false,
}: VendorSignupStep5Props) {
  const dispatch = useAppDispatch();
  const vendorState = useAppSelector((s) => s.vendor.vendorDetails);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Step5FormData>({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      ibanNumber: vendorState.paymentInfo.ibanNumber || "",
      bankName: vendorState.paymentInfo.bankName || "",
      accountHolderName: vendorState.paymentInfo.accountHolderName || "",
      currency: symbolToLabel(vendorState.paymentInfo.currency || ""),
      agreedToTerms: vendorState.agreedToTerms || false,
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.ibanNumber) {
        dispatch(
          setPaymentInfo({
            ibanNumber: value.ibanNumber,
          })
        );
      }
      if (value.bankName) {
        dispatch(
          setPaymentInfo({
            bankName: value.bankName,
          })
        );
      }
      if (value.accountHolderName) {
        dispatch(
          setPaymentInfo({
            accountHolderName: value.accountHolderName,
          })
        );
      }
      if (value.currency) {
        dispatch(
          setPaymentInfo({
            currency: labelToSymbol(value.currency),
          })
        );
      }
      if (value.agreedToTerms !== undefined) {
        dispatch(
          setVendorField({
            field: "agreedToTerms",
            value: value.agreedToTerms,
          })
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  const onSubmit = (data: Step5FormData) => {
    dispatch(
      setPaymentInfo({
        ibanNumber: data.ibanNumber,
        bankName: data.bankName,
        accountHolderName: data.accountHolderName,
        currency: labelToSymbol(data.currency),
      })
    );
    dispatch(
      setVendorField({
        field: "agreedToTerms",
        value: data.agreedToTerms,
      })
    );
    onNext?.();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground flex items-start justify-start mb-2"
        >
          <ChevronLeft className="mr-2 h-[24px] w-[24px]" color="#B32053" />
          <span className="text-base font-semibold">Go Back</span>
        </button>
        <CardTitle className="text-2xl font-bold">
          Bank & Payment Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Controller
            name="ibanNumber"
            control={control}
            render={({ field }) => (
              <TextInputComponent
                label="IBAN Number"
                placeholder="Enter IBAN number"
                value={field.value}
                onChange={field.onChange}
                error={errors.ibanNumber?.message}
                required
              />
            )}
          />

          <Controller
            name="bankName"
            control={control}
            render={({ field }) => (
              <TextInputComponent
                label="Bank Name"
                placeholder="Enter bank name"
                value={field.value}
                onChange={field.onChange}
                error={errors.bankName?.message}
                required
              />
            )}
          />

          <Controller
            name="accountHolderName"
            control={control}
            render={({ field }) => (
              <TextInputComponent
                label="Account Holder Name"
                placeholder="Enter account holder name"
                value={field.value}
                onChange={field.onChange}
                error={errors.accountHolderName?.message}
                required
              />
            )}
          />

          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <SelectInputComponent
                label="Currency"
                placeholder="Select currency"
                value={field.value}
                onChange={field.onChange}
                options={currencyOptions}
                error={errors.currency?.message}
                required
              />
            )}
          />

          <Controller
            name="agreedToTerms"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreedToTerms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="agreedToTerms" className="text-sm font-medium">
                  I have read and agree to the Legal Partner Agreement
                </Label>
              </div>
            )}
          />
          {errors.agreedToTerms && (
            <p className="text-sm text-red-500">
              {errors.agreedToTerms.message}
            </p>
          )}

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="w-full"
            loading={loading}
            loadingText="Completing Your Registration...."
          >
            Complete Registration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
