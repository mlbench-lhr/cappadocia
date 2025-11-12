"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const BasicStructureWithName = ({
  children,
  name,
  showBackOption = false,
}: {
  name: string;
  children: React.ReactNode;
  showBackOption?: boolean;
}) => {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col justify-start items-start gap-3">
      <div className="flex justify-start items-center gap-2 w-full">
        {showBackOption && (
          <div
            onClick={() => {
              router.back();
            }}
            className="pl-2 cursor-pointer"
          >
            <ChevronLeft />
          </div>
        )}

        <h1 className="text-[22px] font-[600]">{name}</h1>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
