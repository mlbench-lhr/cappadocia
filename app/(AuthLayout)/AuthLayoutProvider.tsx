"use client";
import { SwitchRoles } from "@/components/SmallComponents/SwitchRoles";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { readCache, writeCache, prefetchImages } from "@/lib/utils/cache";

export function AuthLayoutProvider({
  children,
  showImage1 = true,
  isVendor = false,
}: {
  children: React.ReactNode;
  showImage1?: boolean;
  isVendor?: boolean;
}) {
  const [authImages, setAuthImages] = useState<string[]>(["", "", ""]);
  const isMobile = useMediaQuery({ maxWidth: 1023 });

  useEffect(() => {
    const cached = readCache<any>("promotionalImages");
    if (cached && cached.authImages?.length) {
      setAuthImages(cached.authImages);
      prefetchImages(cached.authImages);
    }
    async function fetchSettings() {
      try {
        const res = await axios.get("/api/promotionalImages");
        const s = (await res.data)?.data || {};
        if (s.authImages?.length) setAuthImages(s.authImages);
        writeCache("promotionalImages", s);
        if (s.authImages?.length) prefetchImages(s.authImages);
      } catch (e) {}
    }
    fetchSettings();
  }, []);

  const bgIndex = isVendor ? 2 : showImage1 ? 0 : 1;
  const bgImage = authImages[bgIndex] || authImages[0];
  return (
    <div className="h-full w-full flex justify-between">
      <div
        className={`${
          isVendor
            ? "auth-bg-image-3"
            : showImage1
            ? "auth-bg-image-1"
            : "auth-bg-image-2"
        } hidden lg:flex w-[50%] min-h-screen max-h-full`}
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div
        className={`bgWhiteImp w-full lg:w-1/2 ${
          isVendor
            ? "auth-bg-image-3m"
            : showImage1
            ? "auth-bg-image-1m"
            : "auth-bg-image-2m"
        } `}
        style={{ backgroundImage: isMobile ? `url(${bgImage})` : "none" }}
      >
        {showImage1 && <SwitchRoles />}
        <div
          className={`flex justify-center items-start lg:items-center w-full h-[100vh] min-h-fit max-h-full `}
        >
          <div className="flex-1 flex items-start lg:items-center justify-center py-6 lg:py-2 px-4 sm:px-6 lg:px-8 min-h-fit max-h-full">
            <div className="w-full max-w-md space-y-8 min-h-fit max-h-full">
              <main className="">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
