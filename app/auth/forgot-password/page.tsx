import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Navigation } from "@/components/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="flex justify-center items-start lg:items-center w-full h-[100vh] bg-[#FBFDF9]">
      <main className="flex-1 flex items-start lg:items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FBFDF9]">
        <div className="w-full max-w-md space-y-8">
          <ForgotPasswordForm />
        </div>
      </main>
    </div>
  );
}
