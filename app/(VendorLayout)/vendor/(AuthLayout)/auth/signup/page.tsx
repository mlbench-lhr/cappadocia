import { AuthLayoutProvider } from "@/app/(AuthLayout)/AuthLayoutProvider";
import VendorSignUp from "./StepComponents/page";

export default function SignupPage() {
  return (
    <AuthLayoutProvider>
      <VendorSignUp />
    </AuthLayoutProvider>
  );
}
