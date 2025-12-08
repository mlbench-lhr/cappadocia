"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import { TextInputComponent } from "@/components/SmallComponents/InputComponents";
import { setVendorField } from "@/lib/store/slices/vendorSlice";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Swal from "sweetalert2";
import Image from "next/image";

const step1Schema = z
  .object({
    companyName: z
      .string()
      .min(2, "Company name must be at least 2 characters"),
    contactPersonName: z
      .string()
      .min(2, "Contact person name must be at least 2 characters"),
    businessEmail: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
    contactPhoneNumber: z.string().min(10, "Valid phone number is required"),
    tursabNumber: z.string().min(2, "TÜRSAB number is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type Step1FormData = z.infer<typeof step1Schema>;

interface VendorSignupStep1Props {
  onNext?: () => void;
}

export default function VendorSignupStep1({ onNext }: VendorSignupStep1Props) {
  const dispatch = useAppDispatch();
  const vendorState = useAppSelector((s) => s.vendor.vendorDetails);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      companyName: vendorState.companyName || "",
      contactPersonName: vendorState.contactPersonName || "",
      businessEmail: vendorState.businessEmail || "",
      password: vendorState.password || "",
      confirmPassword: vendorState.confirmPassword || "",
      contactPhoneNumber: vendorState.contactPhoneNumber || "",
      tursabNumber: vendorState.tursabNumber || "",
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      Object.keys(value).forEach((key) => {
        dispatch(
          setVendorField({
            field: key as any,
            value: value[key as keyof typeof value],
          })
        );
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  const onSubmit: any = async (data: Step1FormData) => {
    try {
      setLoading(true);
      const emailExists = await axios.get(
        "/api/auth/email-exist/" + data.businessEmail
      );
      console.log("emailExists---", emailExists);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Failed to add blog",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }
    } finally {
      setLoading(false);
    }

    Object.keys(data).forEach((key) => {
      dispatch(
        setVendorField({
          field: key as any,
          value: data[key as keyof typeof data],
        })
      );
    });
    onNext?.();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <Link href={"/"}>
          <Image src={"/logo.png"} width={100} height={20} alt="" />
        </Link>
        <CardTitle className="text-2xl font-bold">
          Vendor Application Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
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
              name="password"
              control={control}
              render={({ field }) => (
                <TextInputComponent
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.password?.message}
                  required
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextInputComponent
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.confirmPassword?.message}
                  required
                />
              )}
            />

            <Controller
              name="contactPhoneNumber"
              control={control}
              render={({ field }) => (
                <div className="space-y-1 col-span-1">
                  <Label className="text-[14px] font-semibold">
                    Phone Number
                    {<span className="text-red-500 ml-1">*</span>}
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

            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="w-full mt-2"
              loading={loading}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="text-center text-sm">
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
