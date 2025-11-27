import { AuthLayoutProvider } from "@/app/(AuthLayout)/AuthLayoutProvider";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayoutProvider showImage1={false} isVendor={true}>
      <ForgotPasswordForm isVendor />
    </AuthLayoutProvider>
  );
}
