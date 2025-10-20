"use client";

import logo from "@/public/logo.svg";
import coloredGoogleIcon from "@/public/flat-color-icons_google.svg";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, signInWithGoogle } from "@/lib/auth/auth-helpers";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/store/hooks";
import { setReduxUser } from "@/lib/store/slices/authSlice";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm({ isAdmin }: { isAdmin?: Boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const handleEmailLogin = async (data: LoginFormValues) => {
    setLoading(true);
    setError("");

    try {
      const { error } = await signIn(data.email, data.password);
      const userData = (await signIn(data.email, data.password)).data;

      // dispatch(setReduxUser(userData.user));
      if (error) {
        setError(error.message);
      } else if (userData?.user.role === "admin") {
        router.push("/admin/dashboard");
        router.refresh();
      } else if (
        userData?.user?.extracurricularsAndAwards?.awards?.length < 1
      ) {
        router.push("/update-profile");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
      // Google OAuth will redirect automatically
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "Please try again.",
        confirmButtonColor: "#22c55e", // match shadcn green if you want
      });
    }
  }, [error]);

  return (
    <Card className="w-full max-w-md auth-box-shadows">
      <CardHeader className="space-y-1">
        <Link href={"/"}>
          <Image
            width={88}
            height={48}
            alt=""
            src={logo.src || "/placeholder.svg"}
            className="mx-auto mb-[20px]"
          />
        </Link>
        <CardTitle className="heading-text-style-4 text-center">
          {isAdmin ? "Login" : "Sign In"}
        </CardTitle>
        <CardDescription className="text-center plan-text-style-3">
          Welcome back! Please log in to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label className="label-style" htmlFor="email">
              Email
            </Label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Enter a valid email",
                },
              }}
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="input-style"
                  {...field}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label className="label-style" htmlFor="password">
              Password
            </Label>
            <div className="relative">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password should be 6 character long",
                  },
                }}
                render={({ field }) => (
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="input-style"
                    {...field}
                  />
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex items-center justify-between plan-text-style-3">
            <Link
              href={
                isAdmin
                  ? "/admin/auth/forgot-password"
                  : "/auth/forgot-password"
              }
              className="text-[#B32053] hover:underline w-full text-end"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full mt-[8px]"
            disabled={loading}
            variant={"main_green_button"}
            loading={loading}
          >
            Login
          </Button>
        </form>
        {!isAdmin && (
          <>
            {/* Divider */}
            <div className="relative">
              <div className="relative flex justify-center uppercase">
                <span className="plan-text-style-2 bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="border-[1px] border-[#B8C8D8] w-full bg-transparent h-[46px] cursor-pointer"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <Image
                width={20}
                height={20}
                alt=""
                src={coloredGoogleIcon.src || "/placeholder.svg"}
              />
              Continue with Google
            </Button>

            <div className="plan-text-style-3">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-[#B32053] font-[500] hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
