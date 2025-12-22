"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uploadFile } from "@/lib/utils/upload";
import Swal from "sweetalert2";
import { readCache, writeCache, prefetchImages } from "@/lib/utils/cache";

export default function Section4(props?: { editorMode?: boolean }) {
  const editorMode = props?.editorMode || false;
  const [date, setDate] = useState();
  const [background, setBackground] = useState<string>("/landing page/image 6.png");
  const [thumbs, setThumbs] = useState<string[]>([
    "/landing page/img 7.png",
    "/landing page/img 8.png",
    "/landing page/img 9.png",
  ]);
  const [heading, setHeading] = useState<string>("Cappadocia Gallery");
  const [description, setDescription] = useState<string>(
    "Experience stunning landscapes, vibrant skies, and unforgettable\n                memories captured by our travelers and partners."
  );
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const cached = readCache<any>("promotionalImages");
    if (cached) {
      const s = cached || {};
      if (s.section4Background) setBackground(s.section4Background);
      if (s.section4Thumbs?.length) setThumbs(s.section4Thumbs);
      if (s.section4Heading) setHeading(s.section4Heading);
      if (s.section4Description) setDescription(s.section4Description);
      prefetchImages([s.section4Background, ...(s.section4Thumbs || [])].filter(Boolean) as string[]);
    }
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/promotionalImages");
        const s = (await res.data)?.data || {};
        if (s.section4Background) setBackground(s.section4Background);
        if (s.section4Thumbs?.length) setThumbs(s.section4Thumbs);
        if (s.section4Heading) setHeading(s.section4Heading);
        if (s.section4Description) setDescription(s.section4Description);
        writeCache("promotionalImages", s);
        prefetchImages([s.section4Background, ...(s.section4Thumbs || [])].filter(Boolean) as string[]);
      } catch (e) {}
    }
    fetchSettings();
  }, []);

  const uploadBg = async (file: File) => {
    try {
      setIsUploading("bg");
      const url = await uploadFile(file, "promotionalImages");
      setBackground(url);
      const resp = await axios.put("/api/promotionalImages", { section4Background: url });
      const payload = (await resp.data)?.data || {};
      writeCache("promotionalImages", payload);
      Swal.fire({ icon: "success", title: "Updated", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Upload failed", timer: 1200, showConfirmButton: false });
    } finally {
      setIsUploading(null);
    }
  };

  const uploadThumb = async (index: number, file: File) => {
    try {
      setIsUploading(`thumb-${index}`);
      const url = await uploadFile(file, "promotionalImages");
      const updated = thumbs.map((t, i) => (i === index ? url : t));
      setThumbs(updated);
      const resp = await axios.put("/api/promotionalImages", { section4Thumbs: updated });
      const payload = (await resp.data)?.data || {};
      writeCache("promotionalImages", payload);
      Swal.fire({ icon: "success", title: "Updated", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Upload failed", timer: 1200, showConfirmButton: false });
    } finally {
      setIsUploading(null);
    }
  };

  const saveText = async () => {
    try {
      const resp = await axios.put("/api/promotionalImages", { section4Heading: heading, section4Description: description });
      const payload = (await resp.data)?.data || {};
      writeCache("promotionalImages", payload);
      setEditOpen(false);
      Swal.fire({ icon: "success", title: "Saved", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Save failed", timer: 1200, showConfirmButton: false });
    }
  };

  return (
    <div className="w-full h-fit pt-12">
      <div className="w-full flex flex-col items-center justify-center h-fit relative z-0">
        <div className="w-full flex flex-col items-center h-[653px] justify-end relative z-0">
          <Image
            src={background}
            alt=""
            width={100}
            height={100}
            priority
            className="w-full h-[653px] object-cover object-center"
          />
          {editorMode && (
            <div className="absolute top-4 right-4 z-30">
              <label htmlFor="upload-sec4-bg" className="w-fit h-fit p-2 rounded-full bg-white cursor-pointer shadow-lg inline-flex">
                <Pencil size={18} color="#B32053" />
              </label>
              <input
                id="upload-sec4-bg"
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadBg(f);
                }}
                disabled={isUploading !== null}
              />
            </div>
          )}
          <div className="w-full flex flex-col lg:flex-row items-end text-start justify-between absolute translate-y-[-50%] lg:translate-y-[0%] top-1/2 lg:top-auto bottom-auto lg:bottom-10 left-0 gap-2 px-5 lg:px-15">
            <div className="w-full lg:w-fit flex flex-col items-start text-start justify-start gap-6 relative">
              <h1 className="font-bold text-3xl lg:text-[46px] w-[90%] lg:w-[500px] text-white leading-tight">
                {heading}
              </h1>
              <h2 className="font-[400] text-xl md:text-xl w-[90%] md:w-[485px] text-[rgba(255,255,255,0.70)] leading-tight whitespace-pre-line">
                {description}
              </h2>
              {editorMode && (
                <button onClick={() => setEditOpen(true)} className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow" aria-label="Edit text">
                  <Pencil size={18} color="#B32053" />
                </button>
              )}
            </div>
            <div className="w-fit flex items-end text-start justify-start gap-2">
              <Image
                src={thumbs[0]}
                alt=""
                width={223}
                height={179}
                priority
                className="w-[223px] h-[150px] md:h-[179px] object-cover object-center rounded-[15px] overflow-hidden"
              />
              {editorMode && (
                <label htmlFor="upload-sec4-thumb-0" className="bg-white rounded-full p-2 shadow cursor-pointer">
                  <Pencil size={16} color="#B32053" />
                  <input id="upload-sec4-thumb-0" type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadThumb(0, f);
                  }} disabled={isUploading !== null} />
                </label>
              )}
              <Image
                src={thumbs[1]}
                alt=""
                width={233}
                height={200}
                priority
                className="w-[233px] h-[170px] md:h-[200px] object-cover object-center rounded-[15px] overflow-hidden"
              />
              {editorMode && (
                <label htmlFor="upload-sec4-thumb-1" className="bg-white rounded-full p-2 shadow cursor-pointer">
                  <Pencil size={16} color="#B32053" />
                  <input id="upload-sec4-thumb-1" type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadThumb(1, f);
                  }} disabled={isUploading !== null} />
                </label>
              )}
              <Image
                src={thumbs[2]}
                alt=""
                width={233}
                height={237}
                priority
                className="w-[233px] h-[200px] md:h-[237px] object-cover object-center rounded-[15px] overflow-hidden"
              />
              {editorMode && (
                <label htmlFor="upload-sec4-thumb-2" className="bg-white rounded-full p-2 shadow cursor-pointer">
                  <Pencil size={16} color="#B32053" />
                  <input id="upload-sec4-thumb-2" type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadThumb(2, f);
                  }} disabled={isUploading !== null} />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section Text</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full h-[40px] px-3 py-2 rounded-[8px] border" placeholder="Heading" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full min-h-[70px] px-3 py-2 rounded-[8px] border" placeholder="Description" />
            <div className="flex justify-end gap-2">
              <button className="px-3 py-2 border rounded-[8px]" type="button" onClick={() => setEditOpen(false)}>Cancel</button>
              <button className="px-3 py-2 bg-[#4CAF50] text-white rounded-[8px]" type="button" onClick={saveText}>Save</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
