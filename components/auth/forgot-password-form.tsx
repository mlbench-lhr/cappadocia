"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import { OTPInput } from "@/components/ui/otp-input";
import { forgotPassword } from "@/lib/auth/auth-helpers";
import { ChevronLeft, Check, EyeOff, Eye } from "lucide-react";
import Swal from "sweetalert2";

export function ForgotPasswordForm({ isAdmin }: { isAdmin?: Boolean }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "password" | "success">(
    "email"
  );
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
        confirmButtonColor: "#B32053",
      });
    }
  }, [error]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await forgotPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setStep("otp");
        setResendTimer(60);
        Swal.fire({
          icon: "success",
          title: "OTP Sent",
          text: "OTP sent to your email!",
          confirmButtonColor: "#B32053",
        });
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setResendLoading(true);
    setError("");

    try {
      const { error } = await forgotPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setResendTimer(60);
        Swal.fire({
          icon: "success",
          title: "OTP Resent",
          text: "OTP resent to your email!",
          confirmButtonColor: "#B32053",
        });
      }
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp?.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep("password");
        Swal.fire({
          icon: "success",
          title: "OTP Verified",
          text: "OTP verified successfully!",
          confirmButtonColor: "#B32053",
        });
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword?.length < 6) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setStep("success");
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: "Your password has been reset successfully!",
          confirmButtonColor: "#B32053",
        });
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <Card className="w-full md:w-[480px] h-full md:h-[390px]">
        <CardHeader className="flex flex-col justify-center items-center">
          <div className="h-[80px] w-[80px] flex justify-center items-center rounded-full bg-primary mt-[60px]">
            <Check className="text-primary h-[40px] w-[40px]" color="white" />
          </div>
          <CardTitle className="heading-text-style-4 text-center mt-[28px]">
            Password Updated
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-[38px]">
          <Button asChild className="w-full" variant="main_green_button">
            <Link href={isAdmin ? "/admin/auth/login" : "/auth/login"}>
              Back to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === "password") {
    return (
      <Card className="w-full max-w-md auth-box-shadows">
        <CardHeader className="space-y-1">
          <button
            onClick={() => setStep("otp")}
            className="text-sm text-muted-foreground hover:text-foreground flex items-start justify-start mb-[28px]"
          >
            <ChevronLeft className="mr-2 h-[24px] w-[24px]" color="#B32053" />
            <span className="text-base font-semibold">Go Back</span>
          </button>
          <CardTitle className="heading-text-style-4">Reset Password</CardTitle>
          <CardDescription className="plan-text-style-3">
            Enter your new password & confirm password to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2 relative">
              <Label className="label-style" htmlFor="newPassword">
                New Password
              </Label>
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="input-style"
                min={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-3 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="space-y-2 relative">
              <Label className="label-style" htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword2 ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-style"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-3 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full mt-[8px]"
              disabled={loading}
              variant="main_green_button"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (step === "otp") {
    return (
      <Card className="w-full max-w-md auth-box-shadows">
        <CardHeader className="space-y-1">
          <button
            onClick={() => setStep("email")}
            className="text-sm text-muted-foreground hover:text-foreground flex items-start justify-start mb-[28px]"
          >
            <ChevronLeft className="mr-2 h-[24px] w-[24px]" color="#B32053" />
            <span className="text-base font-semibold">Go Back</span>
          </button>
          <CardTitle className="heading-text-style-4 text-center">
            Enter OTP
          </CardTitle>
          <CardDescription className="text-center plan-text-style-3">
            Check your email and enter the OTP to verify.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleVerifyOtp} className="space-y-2">
            <OTPInput
              value={otp}
              onChange={setOtp}
              length={6}
              className="justify-center"
            />
            <Button
              type="submit"
              className="w-full mt-[8px]"
              disabled={otp?.length !== 6 || loading}
              variant="main_green_button"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
          <div className="text-center">
            <p className="plan-text-style-3">
              Didn’t receive the email?{" "}
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || resendLoading}
                className="text-[#B32053] font-[500] hover:underline"
              >
                {resendLoading
                  ? "Sending..."
                  : resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : "Resend OTP"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md auth-box-shadows">
      <CardHeader className="space-y-1">
        <Link
          href={isAdmin ? "/admin/auth/login" : "/auth/login"}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-start mb-[28px]"
        >
          <ChevronLeft className="mr-2 h-[24px] w-[24px]" color="#B32053" />
          <span className="text-base font-semibold">Go Back</span>
        </Link>
        <CardTitle className="heading-text-style-4">Forgot Password?</CardTitle>
        <CardDescription className="plan-text-style-3">
          Enter the email address linked to your account, and we’ll send you a
          link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <Label className="label-style" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-style"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-[8px]"
            disabled={loading}
            variant="main_green_button"
          >
            {loading ? "Sending..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
