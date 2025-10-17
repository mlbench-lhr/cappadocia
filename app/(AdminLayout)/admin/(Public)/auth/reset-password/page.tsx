import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Navigation } from "@/components/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-card py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                EduPlatform
              </span>
            </Link>
          </div>
          <ResetPasswordForm />
        </div>
      </main>
    </div>
  );
}
