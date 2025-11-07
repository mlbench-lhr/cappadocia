import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthProvider } from "../../AuthProvider";

export default function ForgotPasswordPage() {
  return (
    <AuthProvider showImage1={false}>
      <ForgotPasswordForm />
    </AuthProvider>
  );
}
