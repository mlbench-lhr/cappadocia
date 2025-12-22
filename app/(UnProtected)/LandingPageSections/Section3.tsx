"use client";
import Tabs, { TabsProps } from "@/components/landingPage/tabs";
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

export default function Section3(props?: { editorMode?: boolean }) {
  const editorMode = props?.editorMode || false;
  const [mainImages, setMainImages] = useState<string[]>([
    "/landing page/image (4).png",
    "/landing page/image (5).png",
  ]);
  const [heading, setHeading] = useState<string>("Why Choose Us");
  const [description, setDescription] = useState<string>(
    "Discover what makes us the most trusted platform for Cappadocia tours and balloon experiences."
  );
  const [tabData, setTabData] = useState<
    {
      image: string;
      title: string;
      description: string;
    }[]
  >([
    {
      image: "/landing page/tab icon.png",
      title: "Verified Experiences",
      description:
        "All tours and activities are checked and rated by real travelers.",
    },
    {
      image: "/landing page/tab icon 2.png",
      title: "Secure Payments",
      description:
        "All tours and activities are checked and rated by real travelers.",
    },
    {
      image: "/landing page/tab icon 3.png",
      title: "Trusted Vendors",
      description:
        "We partner only with licensed and reviewed local operators.",
    },
    {
      image: "/landing page/tab icon 4.png",
      title: "24/7 Support",
      description:
        "Our local support team is always ready to help you on your journey.",
    },
  ]);
  const [isUploadingIcon, setIsUploadingIcon] = useState<string | null>(null);
  const [editCardOpen, setEditCardOpen] = useState<{
    open: boolean;
    index: number | null;
  }>({ open: false, index: null });
  const [editHeadingOpen, setEditHeadingOpen] = useState(false);
  const [editCardTitle, setEditCardTitle] = useState("");
  const [editCardDescription, setEditCardDescription] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/promotionalImages");
        const s = (await res.data)?.data || {};
        if (s.section3MainImages?.length) setMainImages(s.section3MainImages);
        if (s.section3TabData?.length) setTabData(s.section3TabData);
        else if (s.section3TabIcons?.length) {
          setTabData((prev) =>
            prev.map((p, i) => ({
              ...p,
              image: s.section3TabIcons[i] || p.image,
            }))
          );
        }
        if (s.section3Heading) setHeading(s.section3Heading);
        if (s.section3Description) setDescription(s.section3Description);
      } catch (e) {}
    }
    fetchSettings();
  }, []);

  const tourCardData: TabsProps[] = tabData;

  const saveHeading = async () => {
    try {
      await axios.put("/api/promotionalImages", {
        section3Heading: heading,
        section3Description: description,
      });
      setEditHeadingOpen(false);
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

  const openEditCard = (index: number) => {
    setEditCardTitle(tabData[index]?.title || "");
    setEditCardDescription(tabData[index]?.description || "");
    setEditCardOpen({ open: true, index });
  };

  const saveCard = async () => {
    try {
      const i = editCardOpen.index ?? 0;
      const updated = tabData.map((t, idx) =>
        idx === i
          ? { ...t, title: editCardTitle, description: editCardDescription }
          : t
      );
      setTabData(updated);
      await axios.put("/api/promotionalImages", { section3TabData: updated });
      setEditCardOpen({ open: false, index: null });
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

  const uploadIcon = async (index: number, file: File) => {
    try {
      setIsUploadingIcon(`icon-${index}`);
      const url = await uploadFile(file, "promotionalImages");
      const updated = tabData.map((t, i) =>
        i === index ? { ...t, image: url } : t
      );
      setTabData(updated);
      await axios.put("/api/promotionalImages", { section3TabData: updated });
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
      setIsUploadingIcon(null);
    }
  };

  return (
    <div className="w-full h-fit pt-12" id="WhyChoose">
      <div className="w-full flex flex-col items-center justify-center h-fit px-[20px] lg:px-[80px] 2xl:px-[90px] gap-12">
        <div className="w-full flex flex-col md:flex-row justify-between items-start h-fit gap-0 md:gap-0">
          <div className="w-full md:w-fit h-fit flex flex-col-reverse sm:flex-row md:flex-col justify-between md:justify-start gap-3 sm:gap-6 items-center md:items-start relative">
            <h1 className="font-semibold text-lg md:text-3xl">{heading}</h1>
            <Button variant={"main_green_button"} asChild>
              <Link href={"/#ReadReviews"}>Read Our Reviews</Link>
            </Button>
            {editorMode && (
              <button
                onClick={() => setEditHeadingOpen(true)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow"
                aria-label="Edit heading"
              >
                <Pencil size={18} color="#B32053" />
              </button>
            )}
          </div>
          <div className="w-full md:w-[415px] h-fit text-center md:text-start relative">
            <span className="font-normal text-sm md:text-[16px] text-[rgba(9,9,9,0.50)] text-center md:text-start leading-tight">
              {description}
            </span>
            {editorMode && (
              <button
                onClick={() => setEditHeadingOpen(true)}
                className="absolute -top-2 right-0 bg-white rounded-full p-2 shadow"
                aria-label="Edit description"
              >
                <Pencil size={18} color="#B32053" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full grid grid-cols-4 xl:grid-cols-16 gap-6 xl:gap-4 h-fit relative">
          <div className="w-full relative h-[600px] md:h-[350px] xl:h-[516px] col-span-4 xl:col-span-10 [@media(min-width:1350px)]:col-span-9 flex flex-col md:flex-row justify-start items-center gap-3.5">
            <Image
              src={mainImages[0]}
              alt="appadocia cave dwellings"
              className="w-full xl:w-[323px] h-[300px] md:h-[350px] xl:h-[516px] object-cover object-center rounded-[10px]"
              width={323}
              height={516}
            />
            <Image
              src={mainImages[1]}
              alt="Cappadocia cave dwellings"
              className="w-full xl:w-[319px] h-[300px] md:h-[350px] xl:h-[414px] object-cover object-center rounded-[10px]"
              width={319}
              height={414}
            />
          </div>
          <div className="w-full xl:w-[40%] [@media(min-width:1370px)]:w-[45%] relative xl:absolute top-1/2 right-0 -translate-y-1/2 h-fit col-span-4 xl:col-span-6 [@media(min-width:1350px)]:col-span-7 flex flex-col justify-start items-center gap-4 xl:gap-8 w-[calc(100%-80px)]:gap-10">
            {tourCardData.map((item, index) => (
              <div key={index} className="w-full relative">
                <Tabs {...item} />
                {editorMode && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => openEditCard(index)}
                      className="bg-white rounded-full p-2 shadow"
                      aria-label="Edit card"
                    >
                      <Pencil size={16} color="#B32053" />
                    </button>
                    <label
                      htmlFor={`upload-tab-icon-${index}`}
                      className="bg-white rounded-full p-2 shadow cursor-pointer"
                    >
                      <Pencil size={16} color="#B32053" />
                    </label>
                    <input
                      id={`upload-tab-icon-${index}`}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadIcon(index, f);
                      }}
                      disabled={isUploadingIcon !== null}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={editHeadingOpen} onOpenChange={setEditHeadingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section Text</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full h-[40px] px-3 py-2 rounded-[8px] border"
              placeholder="Heading"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[70px] px-3 py-2 rounded-[8px] border"
              placeholder="Description"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant={"outline"}
                type="button"
                onClick={() => setEditHeadingOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant={"main_green_button"}
                type="button"
                onClick={saveHeading}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editCardOpen.open}
        onOpenChange={(o) =>
          setEditCardOpen({ open: o, index: editCardOpen.index })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              type="text"
              value={editCardTitle}
              onChange={(e) => setEditCardTitle(e.target.value)}
              className="w-full h-[40px] px-3 py-2 rounded-[8px] border"
              placeholder="Title"
            />
            <textarea
              value={editCardDescription}
              onChange={(e) => setEditCardDescription(e.target.value)}
              className="w-full min-h-[70px] px-3 py-2 rounded-[8px] border"
              placeholder="Description"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant={"outline"}
                type="button"
                onClick={() => setEditCardOpen({ open: false, index: null })}
              >
                Cancel
              </Button>
              <Button
                variant={"main_green_button"}
                type="button"
                onClick={saveCard}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
