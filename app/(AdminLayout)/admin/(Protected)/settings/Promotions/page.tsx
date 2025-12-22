"use client";

import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import { uploadFile } from "@/lib/utils/upload";
import Image from "next/image";
import LightboxProvider from "@/components/providers/LightBoxProvider";
import { Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { writeCache, prefetchImages } from "@/lib/utils/cache";

export function Promotions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const [section1Slides, setSection1Slides] = useState<string[]>([
    "/landing page/pic1.png",
    "/landing page/pic2.jpg",
    "/landing page/pic3.jpg",
  ]);
  const [section1SlidesData, setSection1SlidesData] = useState<
    { image: string; title: string; subtitle: string }[]
  >([
    {
      image: "/landing page/pic1.png",
      title: "Discover the Best Tours & Activities in Cappadocia",
      subtitle:
        "Book local experiences, guided tours, and adventures — all in one place.",
    },
    {
      image: "/landing page/pic2.jpg",
      title: "Explore Unique Adventures Across Stunning Cappadocia",
      subtitle:
        "Find top-rated journeys, expert-led tours, and activities — all in one spot.",
    },
    {
      image: "/landing page/pic3.jpg",
      title: "Experience the Top Attractions & Hidden Gems of Cappadocia",
      subtitle:
        "Enjoy curated excursions, cultural tours, and fun activities — all together here.",
    },
  ]);
  const [section3MainImages, setSection3MainImages] = useState<string[]>([
    "/landing page/image (4).png",
    "/landing page/image (5).png",
  ]);
  const [section3TabIcons, setSection3TabIcons] = useState<string[]>([
    "/landing page/tab icon.png",
    "/landing page/tab icon 2.png",
    "/landing page/tab icon 3.png",
    "/landing page/tab icon 4.png",
  ]);
  const [section4Background, setSection4Background] = useState<string>(
    "/landing page/image 6.png"
  );
  const [section4Thumbs, setSection4Thumbs] = useState<string[]>([
    "/landing page/img 7.png",
    "/landing page/img 8.png",
    "/landing page/img 9.png",
  ]);
  const [section6Image, setSection6Image] = useState<string>(
    "/landing page/img 10.png"
  );
  const [section7Image, setSection7Image] = useState<string>(
    "/landing page/img 11.png"
  );
  const [section8Background, setSection8Background] = useState<string>(
    "/landing page/image 6.png"
  );

  const [authImages, setAuthImages] = useState<string[]>([
    "/loginPageImage.png",
    "/authPageImage2.png",
    "/vendorAuthPageImage.png",
  ]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await axios.get("/api/promotionalImages");
        const data = await res.data;
        const s = data?.data || {};
        if (s.section1SlidesData?.length) {
          setSection1SlidesData(s.section1SlidesData);
          setSection1Slides(s.section1SlidesData.map((d: any) => d.image));
        } else if (s.section1Slides?.length) {
          setSection1Slides(s.section1Slides);
          setSection1SlidesData((prev) =>
            prev.map((p, i) => ({ ...p, image: s.section1Slides[i] || p.image }))
          );
        }
        if (s.section3MainImages?.length)
          setSection3MainImages(s.section3MainImages);
        if (s.section3TabIcons?.length) setSection3TabIcons(s.section3TabIcons);
        if (s.section4Background) setSection4Background(s.section4Background);
        if (s.section4Thumbs?.length) setSection4Thumbs(s.section4Thumbs);
        if (s.section6Image) setSection6Image(s.section6Image);
        if (s.section7Image) setSection7Image(s.section7Image);
        if (s.section8Background) setSection8Background(s.section8Background);
        if (s.authImages?.length) setAuthImages(s.authImages);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  async function onSubmit() {
    try {
      setIsSubmitting(true);
      const res = await axios.put("/api/promotionalImages", {
        section1Slides,
        section1SlidesData,
        section3MainImages,
        section3TabIcons,
        section4Background,
        section4Thumbs,
        section6Image,
        section7Image,
        section8Background,
        authImages,
      });
      const updated = (await res.data)?.data || {};
      writeCache("promotionalImages", updated);
      prefetchImages([
        ...section1Slides,
        ...section3MainImages,
        ...section3TabIcons,
        section4Background,
        ...section4Thumbs,
        section6Image,
        section7Image,
        section8Background,
        ...authImages,
      ].filter(Boolean));

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Images updated successfully",
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

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    try {
      setIsUploading(`${key}-${index ?? 0}`);
      const url = await uploadFile(file, "promotionalImages");
      if (key === "section1Slides") {
        const arr = [...section1Slides];
        arr[index!] = url;
        setSection1Slides(arr);
        setSection1SlidesData((prev) =>
          prev.map((p, i) => (i === index ? { ...p, image: url } : p))
        );
      } else if (key === "section3MainImages") {
        const arr = [...section3MainImages];
        arr[index!] = url;
        setSection3MainImages(arr);
      } else if (key === "section3TabIcons") {
        const arr = [...section3TabIcons];
        arr[index!] = url;
        setSection3TabIcons(arr);
      } else if (key === "section4Background") {
        setSection4Background(url);
      } else if (key === "section4Thumbs") {
        const arr = [...section4Thumbs];
        arr[index!] = url;
        setSection4Thumbs(arr);
      } else if (key === "section6Image") {
        setSection6Image(url);
      } else if (key === "section7Image") {
        setSection7Image(url);
      } else if (key === "section8Background") {
        setSection8Background(url);
      } else if (key === "authImages") {
        const arr = [...authImages];
        arr[index!] = url;
        setAuthImages(arr);
      }
    } finally {
      setIsUploading(null);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-300px)] flex justify-between overflow-y-auto items-end flex-col gap-6">
      <div className="w-full flex justify-end gap-2">
        <Button asChild variant={"outline"}>
          <a href="/admin/settings/LandingEditor">Open Landing Editor</a>
        </Button>
        <Button asChild variant={"outline"}>
          <a href="/admin/settings/AuthImages">Open Auth Images Editor</a>
        </Button>
      </div>
      <div className="w-full space-y-6">
        <div className="w-full">
          <h2 className="text-base font-semibold mb-3">
            Hero Section – Slider Content
          </h2>
          <div className="grid grid-cols-2 [@media(min-width:480px)]:grid-cols-3 gap-[20px]">
            {section1Slides.map((item, index) => (
              <div key={index} className="w-full h-fit relative">
                <LightboxProvider images={[item]}>
                  {isUploading === `section1Slides-${index}` ? (
                    <Skeleton className="w-full h-[140px] object-cover object-center rounded-[10px]"></Skeleton>
                  ) : (
                    <Image
                      src={item}
                      alt=""
                      width={100}
                      height={100}
                      className="w-full h-[140px] object-cover object-center rounded-[10px]"
                    />
                  )}
                </LightboxProvider>
                <label
                  className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer -top-4 -right-4 shadow-lg"
                  htmlFor={`upload-section1-${index}`}
                >
                  <Pencil size={20} color="#B32053" />
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleUpload(e, "section1Slides", index)}
                  disabled={isSubmitting}
                  className="hidden"
                  id={`upload-section1-${index}`}
                />
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={section1SlidesData[index]?.title || ""}
                    onChange={(e) =>
                      setSection1SlidesData((prev) =>
                        prev.map((p, i) =>
                          i === index ? { ...p, title: e.target.value } : p
                        )
                      )
                    }
                    className="w-full h-[36px] px-3 py-2 rounded-[8px] border"
                    placeholder="Slide title"
                  />
                  <textarea
                    value={section1SlidesData[index]?.subtitle || ""}
                    onChange={(e) =>
                      setSection1SlidesData((prev) =>
                        prev.map((p, i) =>
                          i === index ? { ...p, subtitle: e.target.value } : p
                        )
                      )
                    }
                    className="w-full min-h-[60px] px-3 py-2 rounded-[8px] border"
                    placeholder="Slide subtitle"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-base font-semibold mb-3">
            Why Choose Us Section
          </h2>
          <div className="grid grid-cols-2 gap-[20px]">
            {section3MainImages.map((item, index) => (
              <div key={index} className="w-full h-fit relative">
                <LightboxProvider images={[item]}>
                  {isUploading === `section3MainImages-${index}` ? (
                    <Skeleton className="w-full h-[200px] object-cover object-center rounded-[10px]"></Skeleton>
                  ) : (
                    <Image
                      src={item}
                      alt=""
                      width={100}
                      height={100}
                      className="w-full h-[200px] object-cover object-center rounded-[10px]"
                    />
                  )}
                </LightboxProvider>
                <label
                  className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer -top-4 -right-4 shadow-lg"
                  htmlFor={`upload-section3-main-${index}`}
                >
                  <Pencil size={20} color="#B32053" />
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleUpload(e, "section3MainImages", index)}
                  disabled={isSubmitting}
                  className="hidden"
                  id={`upload-section3-main-${index}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-base font-semibold mb-3">Cappadocia Gallery</h2>
          <div className="grid grid-cols-1 gap-[20px]">
            <div className="w-full h-fit relative">
              <LightboxProvider images={[section4Background]}>
                {isUploading === `section4Background-0` ? (
                  <Skeleton className="w-full h-[160px] object-cover object-center rounded-[10px]"></Skeleton>
                ) : (
                  <Image
                    src={section4Background}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-[160px] object-cover object-center rounded-[10px]"
                  />
                )}
              </LightboxProvider>
              <label
                className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer -top-4 -right-4 shadow-lg"
                htmlFor={`upload-section4-bg`}
              >
                <Pencil size={20} color="#B32053" />
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleUpload(e, "section4Background", 0)}
                disabled={isSubmitting}
                className="hidden"
                id={`upload-section4-bg`}
              />
            </div>
            <div className="grid grid-cols-3 gap-[20px]">
              {section4Thumbs.map((item, index) => (
                <div key={index} className="w-full h-fit relative">
                  <LightboxProvider images={[item]}>
                    {isUploading === `section4Thumbs-${index}` ? (
                      <Skeleton className="w-full h-[140px] object-cover object-center rounded-[10px]"></Skeleton>
                    ) : (
                      <Image
                        src={item}
                        alt=""
                        width={100}
                        height={100}
                        className="w-full h-[140px] object-cover object-center rounded-[10px]"
                      />
                    )}
                  </LightboxProvider>
                  <label
                    className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer -top-4 -right-4 shadow-lg"
                    htmlFor={`upload-section4-thumb-${index}`}
                  >
                    <Pencil size={20} color="#B32053" />
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleUpload(e, "section4Thumbs", index)}
                    disabled={isSubmitting}
                    className="hidden"
                    id={`upload-section4-thumb-${index}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-base font-semibold mb-3">Get in Touch With Us</h2>
          <div className="grid grid-cols-1 gap-[20px]">
            <div className="w-full h-fit relative">
              <LightboxProvider images={[section6Image]}>
                {isUploading === `section6Image-0` ? (
                  <Skeleton className="w-full h-[200px] object-cover object-center rounded-[10px]"></Skeleton>
                ) : (
                  <Image
                    src={section6Image}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-[200px] object-cover object-center rounded-[10px]"
                  />
                )}
              </LightboxProvider>
              <label
                className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer -top-4 -right-4 shadow-lg"
                htmlFor={`upload-section6-image`}
              >
                <Pencil size={20} color="#B32053" />
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleUpload(e, "section6Image", 0)}
                disabled={isSubmitting}
                className="hidden"
                id={`upload-section6-image`}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-base font-semibold mb-3">
            What Our Travelers Say
          </h2>
          <div className="grid grid-cols-1 gap-[20px]">
            <div className="w-full h-fit relative">
              <LightboxProvider images={[section8Background]}>
                {isUploading === `section8Background-0` ? (
                  <Skeleton className="w-full h-[160px] object-cover object-center rounded-[10px]"></Skeleton>
                ) : (
                  <Image
                    src={section8Background}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-[160px] object-cover object-center rounded-[10px]"
                  />
                )}
              </LightboxProvider>
              <label
                className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer -top-4 -right-4 shadow-lg"
                htmlFor={`upload-section8-bg`}
              >
                <Pencil size={20} color="#B32053" />
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleUpload(e, "section8Background", 0)}
                disabled={isSubmitting}
                className="hidden"
                id={`upload-section8-bg`}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-base font-semibold mb-3">About Us</h2>
          <div className="grid grid-cols-1 gap-[20px]">
            <div className="w-full h-fit relative">
              <LightboxProvider images={[section7Image]}>
                {isUploading === `section7Image-0` ? (
                  <Skeleton className="w-full h-[200px] object-cover object-center rounded-[10px]"></Skeleton>
                ) : (
                  <Image
                    src={section7Image}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-[200px] object-cover object-center rounded-[10px]"
                  />
                )}
              </LightboxProvider>
              <label
                className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer -top-4 -right-4 shadow-lg"
                htmlFor={`upload-section7-image`}
              >
                <Pencil size={20} color="#B32053" />
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleUpload(e, "section7Image", 0)}
                disabled={isSubmitting}
                className="hidden"
                id={`upload-section7-image`}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-base font-semibold mb-3">Authentication Pages</h2>
          <div className="grid grid-cols-2 [@media(min-width:480px)]:grid-cols-3 gap-[20px]">
            {authImages.map((item, index) => (
              <div key={index} className="w-full h-fit relative">
                <LightboxProvider images={[item]}>
                  {isUploading === `authImages-${index}` ? (
                    <Skeleton className="w-full h-[160px] object-cover object-center rounded-[10px]"></Skeleton>
                  ) : (
                    <Image
                      src={item}
                      alt=""
                      width={100}
                      height={100}
                      className="w-full h-[160px] object-cover object-center rounded-[10px]"
                    />
                  )}
                </LightboxProvider>
                <label
                  className="w-fit h-fit p-2 rounded-full bg-white absolute cursor-pointer -top-4 -right-4 shadow-lg"
                  htmlFor={`upload-auth-${index}`}
                >
                  <Pencil size={20} color="#B32053" />
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleUpload(e, "authImages", index)}
                  disabled={isSubmitting}
                  className="hidden"
                  id={`upload-auth-${index}`}
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      <Button
        variant={"main_green_button"}
        className="mt-5"
        type="button"
        onClick={onSubmit}
        loading={isSubmitting}
        disabled={isUploading !== null}
      >
        Save Changes
      </Button>
    </div>
  );
}
