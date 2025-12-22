"use client";
import ContactUsForm from "@/components/landingPage/ContactUsForm";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uploadFile } from "@/lib/utils/upload";
import Swal from "sweetalert2";
import { readCache, writeCache, prefetchImages } from "@/lib/utils/cache";

export default function Section6(props?: { editorMode?: boolean }) {
  const editorMode = props?.editorMode || false;
  const [image, setImage] = useState<string>("/landing page/img 10.png");
  const [heading, setHeading] = useState<string>("Get in Touch With Us");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState(false);
  useEffect(() => {
    const cached = readCache<any>("promotionalImages");
    if (cached) {
      const s = cached || {};
      if (s.section6Image) setImage(s.section6Image);
      if (s.section6Heading) setHeading(s.section6Heading);
      prefetchImages([s.section6Image].filter(Boolean) as string[]);
    }
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/promotionalImages");
        const s = (await res.data)?.data || {};
        if (s.section6Image) setImage(s.section6Image);
        if (s.section6Heading) setHeading(s.section6Heading);
        writeCache("promotionalImages", s);
        prefetchImages([s.section6Image].filter(Boolean) as string[]);
      } catch (e) {}
    }
    fetchSettings();
  }, []);

  const uploadImg = async (file: File) => {
    try {
      setIsUploading(true);
      const url = await uploadFile(file, "promotionalImages");
      setImage(url);
      const resp = await axios.put("/api/promotionalImages", { section6Image: url });
      const payload = (await resp.data)?.data || {};
      writeCache("promotionalImages", payload);
      Swal.fire({ icon: "success", title: "Updated", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Upload failed", timer: 1200, showConfirmButton: false });
    } finally {
      setIsUploading(false);
    }
  };

  const saveHeading = async () => {
    try {
      const resp = await axios.put("/api/promotionalImages", { section6Heading: heading });
      const payload = (await resp.data)?.data || {};
      writeCache("promotionalImages", payload);
      setEditOpen(false);
      Swal.fire({ icon: "success", title: "Saved", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Save failed", timer: 1200, showConfirmButton: false });
    }
  };
  return (
    <div className="w-full h-fit pt-12" id="Contact">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] lg:px-[80px] 2xl:px-[90px] pt-[20px] lg:pt-[35px] pb-[40px] lg:pb-[90px] bg-[#FFEAF4] overflow-hidden gap-14">
        <div className="w-full flex justify-center items-center h-fit relative">
          <h1 className="font-semibold text-lg md:text-3xl">{heading}</h1>
          {editorMode && (
            <button onClick={() => setEditOpen(true)} className="absolute -top-2 right-4 bg-white rounded-full p-2 shadow" aria-label="Edit heading">
              <Pencil size={18} color="#B32053" />
            </button>
          )}
        </div>
        <div className="w-full flex justify-between items-center flex-wrap-reverse lg:flex-nowrap gap-y-16">
          <ContactUsForm />
          <div className="relative flex justify-center items-center w-full lg:w-fit h-fit z-[0]">
            <div className="w-full lg:w-[410px] h-[400px] md:h-[500px] object-cover object-center rounded-[12px] bg-primary absolute top-0 left-0 rotate-[170deg] z-[0]"></div>
            <Image
              src={image}
              alt=""
              width={100}
              height={100}
              priority
              className="w-full lg:w-[410px] h-[400px] md:h-[500px] object-cover object-center rounded-[12px] z-[1]"
            />
            {editorMode && (
              <div className="absolute top-4 right-4 z-30">
                <label htmlFor="upload-sec6-img" className="w-fit h-fit p-2 rounded-full bg-white cursor-pointer shadow-lg inline-flex">
                  <Pencil size={18} color="#B32053" />
                </label>
                <input id="upload-sec6-img" type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImg(f);
                }} disabled={isUploading} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Heading</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full h-[40px] px-3 py-2 rounded-[8px] border" placeholder="Heading" />
            <div className="flex justify-end gap-2">
              <button className="px-3 py-2 border rounded-[8px]" type="button" onClick={() => setEditOpen(false)}>Cancel</button>
              <button className="px-3 py-2 bg-[#4CAF50] text-white rounded-[8px]" type="button" onClick={saveHeading}>Save</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
