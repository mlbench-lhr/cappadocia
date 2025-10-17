import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-start lg:items-center w-full h-[100vh] bg-[#FBFDF9] min-h-fit max-h-full">
      <main className="flex-1 flex items-start lg:items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-fit max-h-full">
        <div className="w-full max-w-md space-y-8 min-h-fit max-h-full">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
