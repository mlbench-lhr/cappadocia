"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Swal from "sweetalert2";

type FormData = {
  name: string;
  email: string;
  message: string;
};

const EmailForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Email sent successfully",
          confirmButtonColor: "#22c55e", // match shadcn green if you want
        });
      } else {
        const { error } = await res.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error || "Something went wrong",
          confirmButtonColor: "#22c55e", // match shadcn green if you want
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong",
        confirmButtonColor: "#22c55e", // match shadcn green if you want
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-start items-start gap-[24px] w-full lg:w-[50%] h-fit"
    >
      {/* Name */}
      <div className="w-full flex flex-col gap-[10px]">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Jenny Wilson"
          className="input-style h-[46px]"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      {/* Email */}
      <div className="w-full flex flex-col gap-[10px]">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="JennyWilson@gmail.com"
          className="input-style h-[46px]"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>

      {/* Message */}
      <div className="w-full flex flex-col gap-[10px]">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          placeholder="Write your message..."
          className="input-style h-[100px]"
          rows={5}
          {...register("message", { required: "Message is required" })}
        />
        {errors.message && (
          <span className="text-red-500 text-sm">
            {errors.message.message}
          </span>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="main_green_button"
        size="lg"
        className="w-full primary-button"
        disabled={loading}
      >
        {loading ? "Sending..." : "Submit"}
      </Button>
    </form>
  );
};

export default EmailForm;
