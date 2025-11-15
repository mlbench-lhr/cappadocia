import { AuthLayoutProvider } from "@/app/(AuthLayout)/AuthLayoutProvider";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthLayoutProvider>
      <LoginForm isVendor={true} />
    </AuthLayoutProvider>
  );
}
