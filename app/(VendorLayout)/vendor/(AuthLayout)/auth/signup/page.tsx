"use client";
import { AuthLayoutProvider } from "@/app/(AuthLayout)/AuthLayoutProvider";
import VendorSignUp from "./StepComponents/page";
import { useAppSelector } from "@/lib/store/hooks";

export default function SignupPage() {
  const vendorDetails = useAppSelector((s) => s.vendor);
  console.log("vendorDetails----", vendorDetails);

  return (
    <AuthLayoutProvider isVendor={true}>
      <VendorSignUp />
    </AuthLayoutProvider>
  );
}
