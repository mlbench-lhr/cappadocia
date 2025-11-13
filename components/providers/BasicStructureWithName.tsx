"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const BasicStructureWithName = ({
  children,
  name,
  showBackOption = false,
  rightSideComponent,
}: {
  name: string;
  children: React.ReactNode;
  showBackOption?: boolean;
  rightSideComponent?: React.ReactNode | React.ComponentType<any>;
}) => {
  const router = useRouter();
  const RightSideComponent = rightSideComponent;

  return (
    <div className="w-full flex flex-col justify-start items-start gap-3">
      <div className="flex justify-between items-start md:items-center gap-2 w-full flex-col md:flex-row">
        <div className="flex justify-start items-center gap-2">
          {showBackOption && (
            <div
              onClick={() => router.back()}
              className="pl-0 md:pl-2 cursor-pointer"
            >
              <ChevronLeft />
            </div>
          )}
          <h1 className="text-xl md:text-[22px] font-[600]">{name}</h1>
        </div>
        {RightSideComponent &&
          (typeof RightSideComponent === "function" ? (
            <RightSideComponent />
          ) : (
            RightSideComponent
          ))}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
