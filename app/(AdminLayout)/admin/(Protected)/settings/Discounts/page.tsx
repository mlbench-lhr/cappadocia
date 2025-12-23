"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import Swal from "sweetalert2";
import { uploadFile } from "@/lib/utils/upload";
import Image from "next/image";
import LightboxProvider from "@/components/providers/LightBoxProvider";
import { Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Discounts() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number | "">("");
  const [text, setText] = useState<string>("");
  const [range, setRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [image, setImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchDiscount() {
      try {
        setLoading(true);
        const res = await axios.get("/api/discount");
        const data = res.data?.data;
        if (data) {
          setPercentage(
            typeof data.percentage === "number" ? data.percentage : ""
          );
          setText(data.text || "");
          setRange({
            from: data.startDate ? new Date(data.startDate) : null,
            to: data.endDate ? new Date(data.endDate) : null,
          });
          setImage(data.image || "");
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchDiscount();
  }, []);

  async function onSubmit() {
    try {
      if (percentage === "" || typeof percentage !== "number") return;
      if (!text.trim()) return;
      if (!range.from || !range.to) return;
      setIsSubmitting(true);
      const res = await axios.put("/api/discount", {
        percentage,
        text,
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
        image: image || undefined,
      });
      await res.data;
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Discount updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || "Server error. Please try again later.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) return;
    try {
      setIsUploading(true);
      const url = await uploadFile(file, "discountImages");
      setImage(url);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-300px)] flex justify-between overflow-y-auto items-end flex-col gap-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Discount Percentage</Label>
          <Input
            type="number"
            placeholder="e.g., 10"
            min={0}
            max={100}
            value={percentage === "" ? "" : String(percentage)}
            onChange={(e) => {
              const v = Number(e.target.value);
              setPercentage(Number.isFinite(v) ? v : "");
            }}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Short Phrase</Label>
          <Input
            type="text"
            placeholder="e.g., Get 10% off Cappadocia Hot Air Balloon Rides this weekend!"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2 col-span-1 md:col-span-2">
          <Label className="text-sm font-semibold">Discount Duration</Label>
          <DateRangePicker value={range} onChange={(val) => setRange(val)} />
        </div>

        <div className="space-y-2 col-span-1 md:col-span-2">
          <Label className="text-sm font-semibold">Background Image</Label>
          <div className="w-full h-fit relative">
            <LightboxProvider images={[image || "/userDashboard/img.png"]}>
              {isUploading ? (
                <Skeleton className="w-full h-[160px] object-cover object-center rounded-[10px]" />
              ) : (
                <Image
                  src={image || "/userDashboard/img.png"}
                  alt=""
                  width={100}
                  height={100}
                  className="w-full h-[160px] object-cover object-center rounded-[10px]"
                />
              )}
            </LightboxProvider>
            <label
              className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer -top-4 -right-4 shadow-lg"
              htmlFor={`upload-discount-image`}
            >
              <Pencil size={20} color="#B32053" />
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleUpload}
              disabled={isSubmitting}
              className="hidden"
              id={`upload-discount-image`}
            />
          </div>
        </div>
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
