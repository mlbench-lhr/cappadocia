"use client";

import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import { uploadFile } from "@/lib/utils/upload";
import Image from "next/image";
import LightboxProvider from "@/components/providers/LightBoxProvider";
import { Camera, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Promotions() {
  const [promotionalImages, setPromotionalImages] = useState<string[]>([
    "/coverPicPlaceholder.png",
    "/coverPicPlaceholder.png",
    "/coverPicPlaceholder.png",
    "/coverPicPlaceholder.png",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log("promotionalImages-----", promotionalImages);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function onSubmit() {
      try {
        setLoading(true);
        const res = await axios.get("/api/promotionalImages");
        const data = await res.data;
        console.log("promotionalImages-------", data);
        setPromotionalImages(
          data?.data?.promotionalImages || [
            "/coverPicPlaceholder.png",
            "/coverPicPlaceholder.png",
            "/coverPicPlaceholder.png",
            "/coverPicPlaceholder.png",
          ]
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    onSubmit();
  }, []);

  async function onSubmit() {
    try {
      setIsSubmitting(true);
      const res = await axios.put("/api/promotionalImages", {
        promotionalImages: promotionalImages,
      });
      const data = await res.data;

      Swal.fire({
        icon: "success",
        title: "Success",
        text: data.message || "Images updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Server error. Please try again later.",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit for avatars)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.readAsDataURL(file);

    try {
      setIsSubmitting(true);
      const url = await uploadFile(file, "promotionalImages");
      setPromotionalImages([...promotionalImages, url]);
      console.log("url-----", url);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-full flex justify-between items-end flex-col">
      <div className="w-full grid grid-cols-4 gap-[20px]">
        {promotionalImages?.map((item, index) => (
          <div key={index} className="w-full h-fit relative">
            <LightboxProvider images={[item || "/coverPicPlaceholder.png"]}>
              {loading ? (
                <Skeleton className="w-full h-[140px] object-cover object-center rounded-[10px]"></Skeleton>
              ) : (
                <Image
                  src={item || "/coverPicPlaceholder.png"}
                  alt=""
                  width={100}
                  height={100}
                  className="w-full h-[140px] object-cover object-center rounded-[10px]"
                />
              )}
            </LightboxProvider>
            <label
              className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer -top-4 -right-4 shadow-lg"
              htmlFor="document-upload"
            >
              <Pencil size={20} className="" color="#B32053" />
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                handleFileSelect(e, "cover");
              }}
              disabled={isSubmitting ? true : false}
              className="hidden"
              id="document-upload"
            />
          </div>
        ))}
      </div>
      <Button
        variant={"main_green_button"}
        className="mt-5"
        type="button"
        onClick={onSubmit}
        loading={isSubmitting}
      >
        Save Changes
      </Button>
    </div>
  );
}
