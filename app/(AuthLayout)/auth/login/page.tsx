import { LoginForm } from "@/components/auth/login-form";
import { AuthProvider } from "../../AuthProvider";

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
