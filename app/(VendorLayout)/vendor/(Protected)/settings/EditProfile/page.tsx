"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setVendorField,
  setVendorAddress,
  setPaymentInfo,
} from "@/lib/store/slices/vendorSlice";
import { useEffect } from "react";
import {
  TextInputComponent,
  SelectInputComponent,
} from "@/components/SmallComponents/InputComponents";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import AddressLocationSelector from "@/components/map";
import Link from "next/link";
import { updateUser } from "@/lib/store/slices/authSlice";
import Swal from "sweetalert2";

const LatLng = z.object({
  lat: z.number(),
  lng: z.number(),
});

const turkishBanks = [
  "Ziraat Bankası",
  "VakıfBank",
  "Halkbank",
  "Akbank",
  "Garanti BBVA",
  "Yapı Kredi",
  "İşbank",
  "DenizBank",
  "QNB Finansbank",
  "TEB",
];
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const turkishBanksNorm = turkishBanks.map(normalize);
const isTurkishIBAN = (v: string) => /^TR\d{24}$/.test(v.toUpperCase());

const completeFormSchema = z.object({
  // Basic Information
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactPersonName: z
    .string()
    .min(2, "Contact person name must be at least 2 characters"),
  businessEmail: z.string().email("Invalid email address"),
  contactPhoneNumber: z.string().min(10, "Valid phone number is required"),
  tursabNumber: z.string().min(2, "TÜRSAB number is required"),

  // Address & Location
  address: z.object({
    address: z.string().min(1, "Registered business address is required"),
    coordinates: LatLng.nullable().refine((v) => v !== null, {
      message: "Please select location from map",
    }),
  }),

  // Payment Information
  ibanNumber: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .refine((v) => isTurkishIBAN(v), {
      message: "Invalid Turkish IBAN. Must start with TR and be 26 characters",
    }),
  bankName: z.string().refine((v) => turkishBanksNorm.includes(normalize(v)), {
    message: "Bank must be a recognized Turkish bank",
  }),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  currency: z.string().refine((v) => v === "Turkish Lira (TRY)", {
    message: "Currency must be Turkish Lira (TRY)",
  }),
});

type CompleteFormData = z.infer<typeof completeFormSchema>;

const currencyOptions = ["Euro (EUR)", "US Dollar (USD)", "Turkish Lira (TRY)"];
const labelToSymbol = (v: string) =>
  v.includes("USD")
    ? "$"
    : v.includes("EUR")
    ? "€"
    : v.includes("TRY")
    ? "₺"
    : v;
const symbolToLabel = (s: string) =>
  s === "$"
    ? "US Dollar (USD)"
    : s === "€"
    ? "Euro (EUR)"
    : s === "₺"
    ? "Turkish Lira (TRY)"
    : "";

interface VendorCompleteFormProps {
  onSubmit?: () => void;
  loading?: boolean;
}

export function EditProfile({
  onSubmit: onSubmitCallback,
  loading = false,
}: VendorCompleteFormProps) {
  const dispatch = useAppDispatch();
  const vendorState = useAppSelector((s) => s.vendor.vendorDetails);
  const userData = useAppSelector((state) => state.auth.user);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CompleteFormData>({
    resolver: zodResolver(completeFormSchema),
    defaultValues: {
      companyName: vendorState.companyName || "",
      contactPersonName: vendorState.contactPersonName || "",
      businessEmail: vendorState.businessEmail || "",
      contactPhoneNumber: vendorState.contactPhoneNumber || "",
      tursabNumber: vendorState.tursabNumber || "",
      address: {
        address: vendorState.address.address || "",
        coordinates: vendorState.address.coordinates || undefined,
      },
      ibanNumber: vendorState.paymentInfo.ibanNumber || "",
      bankName: vendorState.paymentInfo.bankName || "",
      accountHolderName: vendorState.paymentInfo.accountHolderName || "",
      currency: symbolToLabel(vendorState.paymentInfo.currency || ""),
    },
  });

  useEffect(() => {
    if (userData?.vendorDetails) {
      reset({
        companyName: userData.vendorDetails.companyName || "",
        contactPersonName: userData.vendorDetails.contactPersonName || "",
        businessEmail: userData.vendorDetails.businessEmail || "",
        contactPhoneNumber: userData.vendorDetails.contactPhoneNumber || "",
        tursabNumber: userData.vendorDetails.tursabNumber || "",
        address: {
          address: userData.vendorDetails.address?.address || "",
          coordinates: userData.vendorDetails.address?.coordinates || undefined,
        },
        ibanNumber: userData.vendorDetails.paymentInfo?.ibanNumber || "",
        bankName: userData.vendorDetails.paymentInfo?.bankName || "",
        accountHolderName:
          userData.vendorDetails.paymentInfo?.accountHolderName || "",
        currency: symbolToLabel(
          userData.vendorDetails.paymentInfo?.currency || ""
        ),
      });
    }
  }, [
    userData?.vendorDetails?.companyName,
    userData?.vendorDetails?.contactPersonName,
    userData?.vendorDetails?.businessEmail,
    userData?.vendorDetails?.contactPhoneNumber,
    userData?.vendorDetails?.tursabNumber,
    userData?.vendorDetails?.address,
    userData?.vendorDetails?.paymentInfo,
    reset,
  ]);
  console.log(
    "userData?.vendorDetails?.contactPhoneNumber-------",
    userData?.vendorDetails?.contactPhoneNumber
  );

  useEffect(() => {
    const subscription = watch((value) => {
      // Update basic fields
      if (value.companyName) {
        dispatch(
          setVendorField({ field: "companyName", value: value.companyName })
        );
      }
      if (value.contactPersonName) {
        dispatch(
          setVendorField({
            field: "contactPersonName",
            value: value.contactPersonName,
          })
        );
      }
      if (value.businessEmail) {
        dispatch(
          setVendorField({ field: "businessEmail", value: value.businessEmail })
        );
      }
      if (value.contactPhoneNumber) {
        dispatch(
          setVendorField({
            field: "contactPhoneNumber",
            value: value.contactPhoneNumber,
          })
        );
      }
      if (value.tursabNumber) {
        dispatch(
          setVendorField({ field: "tursabNumber", value: value.tursabNumber })
        );
      }

      // Update address
      if (value.address) {
        dispatch(
          setVendorAddress({
            address: vendorState.address.address || "",
            coordinates: vendorState.address.coordinates || null,
          })
        );
      }

      // Update payment info
      if (value.ibanNumber) {
        dispatch(setPaymentInfo({ ibanNumber: value.ibanNumber }));
      }
      if (value.bankName) {
        dispatch(setPaymentInfo({ bankName: value.bankName }));
      }
      if (value.accountHolderName) {
        dispatch(
          setPaymentInfo({ accountHolderName: value.accountHolderName })
        );
      }
      if (value.currency) {
        dispatch(setPaymentInfo({ currency: labelToSymbol(value.currency) }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  const onSubmit = async (data: CompleteFormData) => {
    // Dispatch all data to Redux
    dispatch(setVendorField({ field: "companyName", value: data.companyName }));
    dispatch(
      setVendorField({
        field: "contactPersonName",
        value: data.contactPersonName,
      })
    );
    dispatch(
      setVendorField({ field: "businessEmail", value: data.businessEmail })
    );
    dispatch(
      setVendorField({
        field: "contactPhoneNumber",
        value: data.contactPhoneNumber,
      })
    );
    dispatch(
      setVendorField({ field: "tursabNumber", value: data.tursabNumber })
    );
    dispatch(setVendorAddress(data.address));
    dispatch(
      setPaymentInfo({
        ibanNumber: data.ibanNumber,
        bankName: data.bankName,
        accountHolderName: data.accountHolderName,
        currency: labelToSymbol(data.currency),
      })
    );

    // Prepare payload matching IUser VendorDetails interface
    const payload = {
      vendorDetails: {
        companyName: data.companyName,
        contactPersonName: data.contactPersonName,
        businessEmail: data.businessEmail,
        contactPhoneNumber: data.contactPhoneNumber,
        tursabNumber: data.tursabNumber,
        address: {
          address: data.address.address,
          coordinates: data.address.coordinates,
        },
        paymentInfo: {
          ibanNumber: data.ibanNumber,
          bankName: data.bankName,
          accountHolderName: data.accountHolderName,
          currency: labelToSymbol(data.currency),
        },
        // Include existing vendor details that aren't in this form
        documents: userData?.vendorDetails?.documents || [],
        aboutUs: userData?.vendorDetails?.aboutUs || "",
        languages: userData?.vendorDetails.languages || [],
        cover: userData?.vendorDetails?.cover || "",
      },
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            responseData.error ||
            responseData.message ||
            "Failed to update profile",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      dispatch(updateUser(responseData?.user));
      onSubmitCallback?.();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: responseData.message || "Profile updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Failed to update profile",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold pb-2">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <TextInputComponent
                label="Company / Operator Name"
                placeholder="Enter company name"
                value={field.value}
                onChange={field.onChange}
                error={errors.companyName?.message}
                required
              />
            )}
          />

          <Controller
            name="contactPersonName"
            control={control}
            render={({ field }) => (
              <TextInputComponent
                label="Contact Person Name"
                placeholder="Enter contact person name"
                value={field.value}
                onChange={field.onChange}
                error={errors.contactPersonName?.message}
                required
              />
            )}
          />

          <Controller
            name="businessEmail"
            control={control}
            render={({ field }) => (
              <TextInputComponent
                label="Business Email"
                type="email"
                placeholder="Enter business email"
                value={field.value}
                onChange={field.onChange}
                error={errors.businessEmail?.message}
                required
              />
            )}
          />

          <Controller
            name="contactPhoneNumber"
            control={control}
            render={({ field }) => (
              <div className="space-y-1">
                <Label className="text-[14px] font-semibold">
                  Contact Phone Number
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <PhoneNumberInput
                  phoneNumber={field.value}
                  setPhoneNumber={field.onChange}
                />
                {errors.contactPhoneNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.contactPhoneNumber.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="tursabNumber"
            control={control}
            render={({ field }) => (
              <TextInputComponent
                label="TÜRSAB Number"
                placeholder="Enter TÜRSAB number"
                value={field.value}
                onChange={field.onChange}
                error={errors.tursabNumber?.message}
                required
              />
            )}
          />
        </div>
      </div>

      {/* Address & Location Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold pb-2">Address & Location</h3>

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <AddressLocationSelector
              value={field.value || { address: "", coordinates: null }}
              onChange={(data) => field.onChange(data)}
              readOnly={false}
              label="Registered Business Address"
              className="w-full h-[250px] rounded-xl"
              placeholder="Enter your business address"
            />
          )}
        />
        {errors.address?.coordinates?.message && (
          <p className="text-sm text-red-500">
            {errors.address.coordinates.message}
          </p>
        )}
      </div>

      {/* Payment Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold pb-2">
          Bank & Payment Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>

      {/* Submit Button */}
      <div className="space-y-4 pt-4">
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="w-full"
          loading={loading}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
