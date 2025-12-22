"use client";

import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { uploadFile } from "@/lib/utils/upload";
import Swal from "sweetalert2";

export default function AuthImagesEditor() {
  const [authImages, setAuthImages] = useState<string[]>([
    "/loginPageImage.png",
    "/authPageImage2.png",
    "/vendorAuthPageImage.png",
  ]);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/promotionalImages");
        const s = (await res.data)?.data || {};
        if (s.authImages?.length) setAuthImages(s.authImages);
      } catch {}
    }
    fetchSettings();
  }, []);

  const uploadAt = async (index: number, file: File) => {
    try {
      setIsUploading(`auth-${index}`);
      const url = await uploadFile(file, "promotionalImages");
      const updated = authImages.map((a, i) => (i === index ? url : a));
      setAuthImages(updated);
      await axios.put("/api/promotionalImages", { authImages: updated });
      Swal.fire({
        icon: "success",
        title: "Updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        timer: 1200,
        showConfirmButton: false,
      });
    } finally {
      setIsUploading(null);
    }
  };

  return (
    <BasicStructureWithName
      name="Authentication Images"
      subHeading="Upload images for Login, Signup, Vendor Auth"
      showBackOption
    >
      <BoxProviderWithName noBorder={true} className="!p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["User Login / Verify", "User Signup / Forgot", "Vendor Auth"].map(
            (label, index) => (
              <div
                key={index}
                className="relative rounded-[12px] border overflow-hidden"
              >
                <Image
                  src={authImages[index]}
                  alt={label}
                  width={800}
                  height={600}
                  className="w-full h-[280px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <div className="text-sm">{label}</div>
                    <div className="text-xs opacity-80">
                      Recommended 1600x1200 JPG/PNG
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <label
                    htmlFor={`upload-auth-${index}`}
                    className="w-fit h-fit p-2 rounded-full bg-white cursor-pointer shadow-lg inline-flex"
                  >
                    <Pencil size={18} color="#B32053" />
                  </label>
                  <input
                    id={`upload-auth-${index}`}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadAt(index, f);
                    }}
                    disabled={isUploading !== null}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </BoxProviderWithName>
    </BasicStructureWithName>
  );
}
