"use client";
import Testimonials from "@/components/landingPage/Testimonials";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadFile } from "@/lib/utils/upload";
import Swal from "sweetalert2";

export default function Section8(props?: { editorMode?: boolean }) {
  const editorMode = props?.editorMode || false;
  const [background, setBackground] = useState<string>(
    "/landing page/image 6.png"
  );
  const [heading, setHeading] = useState<string>("What Our Travelers Say");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState(false);
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/promotionalImages");
        const s = (await res.data)?.data || {};
        if (s.section8Background) setBackground(s.section8Background);
        if (s.section8Heading) setHeading(s.section8Heading);
      } catch (e) {}
    }
    fetchSettings();
  }, []);

  const uploadBg = async (file: File) => {
    try {
      setIsUploading(true);
      const url = await uploadFile(file, "promotionalImages");
      setBackground(url);
      await axios.put("/api/promotionalImages", { section8Background: url });
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
      setIsUploading(false);
    }
  };

  const saveHeading = async () => {
    try {
      await axios.put("/api/promotionalImages", { section8Heading: heading });
      setEditOpen(false);
      Swal.fire({
        icon: "success",
        title: "Saved",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Save failed",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };
  return (
    <div className="w-full h-fit" id="ReadReviews">
      <div className="w-full flex flex-col items-center justify-center h-fit relative z-0">
        <div className="w-full flex flex-col items-center h-[650px] md:h-[753px] justify-end relative z-0">
          <Image
            src={background}
            alt=""
            width={100}
            height={100}
            className="w-full h-[650px] md:h-[753px] object-cover object-start absolute top-0 left-0"
          />
          {editorMode && (
            <div className="absolute top-4 right-4 z-30">
              <label
                htmlFor="upload-sec8-bg"
                className="w-fit h-fit p-2 rounded-full bg-white cursor-pointer shadow-lg inline-flex"
              >
                <Pencil size={18} color="#B32053" />
              </label>
              <input
                id="upload-sec8-bg"
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadBg(f);
                }}
                disabled={isUploading}
              />
            </div>
          )}
          <div className="w-full h-[650px] md:h-[753px] flex flex-col justify-center items-center z-[1] gap-17 px-4 md:px-0">
            <div className="w-full flex justify-center items-center h-fit relative">
              <h1 className="font-semibold text-lg md:text-3xl text-white">
                {heading}
              </h1>
              {editorMode && (
                <button
                  onClick={() => setEditOpen(true)}
                  className="absolute -top-2 right-4 bg-white rounded-full p-2 shadow"
                  aria-label="Edit heading"
                >
                  <Pencil size={18} color="#B32053" />
                </button>
              )}
            </div>
            <Testimonials />
          </div>
        </div>
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Heading</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full h-[40px] px-3 py-2 rounded-[8px] border"
              placeholder="Heading"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 border rounded-[8px]"
                type="button"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 bg-[#4CAF50] text-white rounded-[8px]"
                type="button"
                onClick={saveHeading}
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
