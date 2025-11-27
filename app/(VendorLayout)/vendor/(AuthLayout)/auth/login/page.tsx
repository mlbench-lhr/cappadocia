import { AuthLayoutProvider } from "@/app/(AuthLayout)/AuthLayoutProvider";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthLayoutProvider isVendor={true}>
      <LoginForm isVendor={true} />
    </AuthLayoutProvider>
  );
}
