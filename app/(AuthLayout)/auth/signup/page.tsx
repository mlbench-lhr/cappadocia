import { SignupForm } from "@/components/auth/signup-form";
import { AuthProvider } from "../../AuthProvider";

export default function SignupPage() {
  return (
    <AuthProvider>
      <SignupForm />
    </AuthProvider>
  );
}
