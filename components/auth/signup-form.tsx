"use client";

import logo from "@/public/logo.svg";
import coloredGoogleIcon from "@/public/flat-color-icons_google.svg";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { signUp, signInWithGoogle } from "@/lib/auth/auth-helpers";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";

type SignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const handleEmailSignup = async (data: SignupFormValues) => {
    setLoading(true);
    setError("");

    try {
      const { data: res, error } = await signUp(data);
      if (error) {
        setError(error.message);
      } else {
        if (res?.requiresVerification) {
          setSuccess(true);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
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

  if (success) {
    router.push(
      `/auth/verify-email?email=${encodeURIComponent(
        control._formValues.email || ""
      )}`
    );
  }

  return (
    <Card className="w-full max-w-md auth-box-shadows min-h-fit max-h-full">
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
          Create your account
        </CardTitle>
        <CardDescription className="text-center plan-text-style-3">
          Join OpportuniTree and start growing your opportunities{" "}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={handleSubmit(handleEmailSignup)}
          className="space-y-[16px]"
        >
          <div className="flex gap-[16px] flex-wrap md:flex-nowrap w-full">
            <div className="space-y-2 w-full md:w-[50%]">
              <Label className="label-style" htmlFor="firstName">
                First Name
              </Label>
              <Controller
                name="firstName"
                control={control}
                rules={{
                  required: "First name is required",
                  pattern: {
                    value: /^\S+$/,
                    message: "First name cannot contain spaces",
                  },
                }}
                render={({ field }) => (
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    className="input-style"
                    {...field}
                  />
                )}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2 w-full md:w-[50%]">
              <Label className="label-style" htmlFor="lastName">
                Last Name
              </Label>
              <Controller
                name="lastName"
                control={control}
                rules={{
                  required: "Last name is required",
                  pattern: {
                    value: /^\S+$/,
                    message: "Last name cannot contain spaces",
                  },
                }}
                render={({ field }) => (
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    className="input-style"
                    {...field}
                  />
                )}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
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
                    placeholder="Create a password"
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
          <Button
            type="submit"
            className="w-full mt-[8px]"
            disabled={loading}
            variant={"main_green_button"}
          >
            Sign Up{" "}
          </Button>
        </form>
        <div className="relative">
          <div className="relative flex justify-center uppercase">
            <span className="plan-text-style-2 bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-[1px] border-[#B8C8D8] w-full bg-transparent h-[46px] cursor-pointer"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          <Image
            width={20}
            height={20}
            alt=""
            src={coloredGoogleIcon.src || "/placeholder.svg"}
          />
          Signup with Google
        </Button>
        <div className="plan-text-style-3">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[#006C4F] font-[500] hover:underline"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
