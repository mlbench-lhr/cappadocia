"use client";
import { Textarea } from "@/components/ui/textarea";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddDialog({ setRefreshData }: any) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"main_green_button"}>Add Blog</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[600px]">
        <SimplifiedFormComponent setRefreshData={setRefreshData} />
      </DialogContent>
    </Dialog>
  );
}

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  text: z.string().min(10, "Text must be at least 10 characters"),
  coverImage: z.string().min(1, "Cover image is required"),
});

type FormData = z.infer<typeof schema>;

interface SimplifiedFormProps {
  setRefreshData: any;
  onSubmit?: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
}

export function SimplifiedFormComponent({
  setRefreshData,
  onSubmit: onSubmitProp,
  initialData,
}: SimplifiedFormProps) {
  const [coverImage, setCoverImage] = useState<string>(
    initialData?.coverImage || ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      text: initialData?.text || "",
      coverImage: initialData?.coverImage || "",
    },
    mode: "onSubmit",
  });

  const handleCoverImageUpload = (url: string) => {
    setCoverImage(url);
    setValue("coverImage", url);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (onSubmitProp) {
        await onSubmitProp(data);
      } else {
        // Default submission behavior
        const res = await fetch("/api/admin/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to submit");
        const responseData = await res.json();
        console.log("API response:", responseData);
      }
      setRefreshData((s: any) => s + 1);
    } catch (err) {
      console.error("submit error", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[24px] w-full bg-white"
    >
      <h4 className="text-[35px] font-[600] text-center">Add Blog</h4>
      <div className="w-full h-[150px] box-shadows-2 flex justify-start items-end relative">
        <div className="w-full h-fit flex justify-start items-start flex-col pt-4">
          <AvatarUpload
            currentAvatar={coverImage}
            onAvatarUpload={handleCoverImageUpload}
            size={70}
            className="mx-auto"
          />
          <span className="plan-text-style-4">Cover Image</span>
          <span className="plan-text-style-3 pt-1">
            This image will be displayed as the cover of your blog
          </span>
        </div>
      </div>
      {errors.coverImage && (
        <p className="text-red-500 text-sm">{errors.coverImage.message}</p>
      )}

      {/* Fields */}
      <div className="w-full">
        <div className="grid grid-cols-1 gap-6">
          {/* Title */}
          <div className="flex flex-col gap-[10px]">
            <Label htmlFor="title" className="text-[25px] font-[700]">
              Title <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="title"
              className="input-style"
              placeholder="Enter Title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-[10px]">
            <Label htmlFor="text" className="text-[25px] font-[700]">
              Add Blog <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="text"
              className="input-style min-h-[150px]"
              placeholder="Enter Text"
              {...register("text")}
            />
            {errors.text && (
              <p className="text-red-500 text-sm">{errors.text.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex justify-center gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="main_green_button"
          size="lg"
          className="w-full"
          loading={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Add"}
        </Button>
      </div>
    </form>
  );
}
