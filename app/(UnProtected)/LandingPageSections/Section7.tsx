"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
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
import { readCache, writeCache, prefetchImages } from "@/lib/utils/cache";

export default function Section7(props?: { editorMode?: boolean }) {
  const editorMode = props?.editorMode || false;
  const [image, setImage] = useState<string>("/landing page/img 11.png");
  const [heading, setHeading] = useState<string>("About Us ");
  const [text, setText] = useState<string>(
    "Welcome to Cappadocia Activities & Tours, your trusted online\n              marketplace for discovering and booking unforgettable experiences\n              across Cappadocia.\n              \n              Our platform connects travelers from around the world with\n              verified local tour operators, offering a seamless way to explore\n              the region’s breathtaking landscapes, cultural heritage, and\n              adventure activities — all in one place.\n              \n              We believe every traveler deserves a personalized and safe\n              experience. That’s hy we’ve designed our system to ensure\n              transparency, reliability, and convenience — whether you’re\n              booking a hot air balloon ride, an ATV adventure, or a cultural\n              day tour.\n              \n              Cappadocia Platform is a modern online marketplace for tours and\n              activities in Cappadocia, created by young entrepreneurs to\n              support local travel agencies and enhance sustainable tourism.\n              \n              We connect travelers with trusted, certified service providers and\n              offer secure booking, transparent pricing, and unforgettable\n              travel experiences. Proudly aligned with the United Nations\n              Sustainable Development Goals, we aim to strengthen our region’s\n              tourism ecosystem and promote responsible, authentic, and\n              high-quality travel. Discover. Book. Experience Cappadocia."
  );
  const [editOpen, setEditOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  useEffect(() => {
    const cached = readCache<any>("promotionalImages");
    if (cached) {
      const s = cached || {};
      if (s.section7Image) setImage(s.section7Image);
      if (s.section7Text) setText(s.section7Text);
      prefetchImages([s.section7Image].filter(Boolean) as string[]);
    }
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/promotionalImages");
        const s = (await res.data)?.data || {};
        if (s.section7Image) setImage(s.section7Image);
        if (s.section7Text) setText(s.section7Text);
        writeCache("promotionalImages", s);
        prefetchImages([s.section7Image].filter(Boolean) as string[]);
      } catch (e) {}
    }
    fetchSettings();
  }, []);

  const uploadImg = async (file: File) => {
    try {
      setIsUploading(true);
      const url = await uploadFile(file, "promotionalImages");
      setImage(url);
      const resp = await axios.put("/api/promotionalImages", { section7Image: url });
      const payload = (await resp.data)?.data || {};
      writeCache("promotionalImages", payload);
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

  const saveText = async () => {
    try {
      const resp = await axios.put("/api/promotionalImages", { section7Text: text });
      const payload = (await resp.data)?.data || {};
      writeCache("promotionalImages", payload);
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
    <div className="w-full h-fit pt-10" id="About">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] lg:px-[80px] 2xl:px-[90px] pt-[20px] lg:pt-[35px] pb-12 lg:pb-12 gap-14">
        <div className="w-full flex justify-start items-center gap-y-10 gap-x-15 flex-wrap">
          <div className="relative flex justify-center items-center w-full lg:w-fit h-fit z-[0]">
            <Image
              src={image}
              alt=""
              width={530}
              height={680}
              priority
              className="w-full lg:w-[400px] 2xl:w-[530px] h-[400px] lg:h-[580px] 2xl:h-[680px] object-cover object-center rounded-[12px] z-[1]"
            />
            {editorMode && (
              <div className="absolute top-4 right-4 z-30">
                <label
                  htmlFor="upload-sec7-img"
                  className="w-fit h-fit p-2 rounded-full bg-white cursor-pointer shadow-lg inline-flex"
                >
                  <Pencil size={18} color="#B32053" />
                </label>
                <input
                  id="upload-sec7-img"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImg(f);
                  }}
                  disabled={isUploading}
                />
              </div>
            )}
          </div>
          <div className="w-full lg:w-[calc(100%-460px)] 2xl:w-[calc(100%-590px)] flex flex-col justify-start items-start gap-4 md:gap-12">
            <h1 className="font-semibold text-2xl md:text-[37px]">{heading}</h1>
            {/* <p className="w-full 2xl:w-[550px] text-sm md:text-base leading-tight">
              Welcome to Cappadocia Activities & Tours, your trusted online
              marketplace for discovering and booking unforgettable experiences
              across Cappadocia.
              <br /> Our platform connects travelers from around the world with
              verified local tour operators, offering a seamless way to explore
              the region’s breathtaking landscapes, cultural heritage, and
              adventure activities — all in one place.
              <br />
              <br /> We believe every traveler deserves a personalized and safe
              experience. That’s hy we’ve designed our system to ensure
              transparency, reliability, and convenience — whether you’re
              booking a hot air balloon ride, an ATV adventure, or a cultural
              day tour.
            </p> */}
            <p className="w-full 2xl:w-[550px] text-sm md:text-base leading-tight">
              {text}
              {editorMode && (
                <button
                  onClick={() => setEditOpen(true)}
                  className="absolute -top-6 right-0 bg-white rounded-full p-2 shadow"
                  aria-label="Edit text"
                >
                  <Pencil size={18} color="#B32053" />
                </button>
              )}
            </p>
            <Button variant={"main_green_button"} asChild>
              <Link href={"/about"}>Read more</Link>
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit About Text</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[140px] px-3 py-2 rounded-[8px] border"
              placeholder="About text"
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
                onClick={saveText}
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
