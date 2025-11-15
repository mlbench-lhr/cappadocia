import { AuthLayoutProvider } from "@/app/(AuthLayout)/AuthLayoutProvider";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthLayoutProvider>
      <SignupForm isVendor={true} />
    </AuthLayoutProvider>
  );
}
