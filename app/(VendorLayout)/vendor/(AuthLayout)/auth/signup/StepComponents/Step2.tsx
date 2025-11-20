"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setVendorAddress } from "@/lib/store/slices/vendorSlice";
import AddressLocationSelector from "@/components/map";
import { useEffect } from "react";

const LatLng = z.object({
  lat: z.number(),
  lng: z.number(),
});

const step2Schema = z.object({
  address: z.object({
    address: z.string().min(1, "Address is required"),
    coordinates: LatLng.nullable().refine((v) => v !== null, {
      message: "Select any location from map",
    }),
  }),
});

type Step2FormData = z.infer<typeof step2Schema>;

interface VendorSignupStep2Props {
  onNext?: () => void;
  onBack?: () => void;
}

export default function VendorSignupStep2({
  onNext,
  onBack,
}: VendorSignupStep2Props) {
  const dispatch = useAppDispatch();
  const vendorState = useAppSelector((s) => s.vendor.vendorDetails);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      address: {
        address: vendorState.address.address || "",
        coordinates: vendorState.address.coordinates,
      },
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.address) {
        dispatch(setVendorAddress(value.address));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  const onSubmit = (data: Step2FormData) => {
    dispatch(setVendorAddress(data.address));
    onNext?.();
  };

  return (
    <Card className="w-full max-w-md auth-box-shadows min-h-fit max-h-full">
      <CardHeader className="space-y-1">
        <button
          onClick={onBack}
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <AddressLocationSelector
                value={
                  field.value || {
                    address: "",
                    coordinates: null,
                  }
                }
                onChange={(data) => {
                  field.onChange(data);
                }}
                readOnly={false}
                label="Address & Location"
                className="w-full h-[188px] rounded-xl"
                placeholder="Enter Address & Location"
              />
            )}
          />
          {errors.address?.coordinates?.message && (
            <p className="text-sm text-red-500">
              {errors.address?.coordinates?.message}
            </p>
          )}
          <Button
            variant={"main_green_button"}
            type="submit"
            className="w-full"
          >
            Next
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
