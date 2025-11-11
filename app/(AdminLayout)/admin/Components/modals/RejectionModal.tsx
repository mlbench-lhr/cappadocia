// components/ChangePasswordModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import ModalPortal from "./ModalPortal";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => any;
  onForgotPassword?: () => void;
};

export default function RejectionModal({
  open,
  isSubmitting = false,
  onClose,
  onSubmit,
  onForgotPassword,
}: Props) {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill out all fields.");
      return;
    }
    if (newPassword?.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      const res = await onSubmit({ oldPassword, newPassword, confirmPassword });
      if (res.ok) {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(res.message || "Failed to update password.");
      }
    } catch (err: any) {
      setError(err.message || "Server error.");
    }
  }

  return (
    <ModalPortal>
      <div
        className="z-[1000] fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative bg-background shadow-theme-lg p-6 sm:p-8 rounded-[24px] ring-1 ring-primary/20 w-full max-w-[608px]">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex top-4 right-4 absolute justify-center items-center hover:bg-primary_skin rounded-full w-8 h-8 text-primary"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <h3
            id="change-password-title"
            className="mb-6 font-bold text-[20px] text-primary_black sm:text-[28px] leading-tight text-center"
          >
            Reason for Rejection
          </h3>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">
            <label htmlFor="reason" className="text-lg font-bold">
              Add Reason
            </label>
            <textarea
              id="reason"
              rows={10}
              className="w-full h-40 rounded-2xl border-2 border-gray-200 p-2 focus:outline-none focus:border-primary_skin"
              placeholder="Enter your reason for rejection here..."
            ></textarea>

            {/* CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-500 disabled:opacity-60 mt-2 rounded-lg w-full h-12 font-medium text-background"
            >
              {isSubmitting ? "Rejecting..." : "Reject"}
            </button>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}

/* --------- Small presentational helper for pill inputs with eye toggle --------- */
function Field({
  label,
  id,
  placeholder,
  value,
  onChange,
  type,
  onToggle,
  show,
}: {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type: "text" | "password";
  onToggle: () => void;
  show: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 font-semibold text-primary_black text-sm"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white_primary p-3 pr-11 border border-black_secondary/10 rounded-[12px] sm:rounded-[12px] focus:outline-none focus:ring-[#0E1A2B] focus:ring-2 w-full text-secondary_black/80 placeholder:text-secondary_black/80"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="inline-flex top-1/2 right-2.5 absolute justify-center items-center hover:bg-primary_skin rounded-full w-8 h-8 text-secondary_black/70 -translate-y-1/2"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
