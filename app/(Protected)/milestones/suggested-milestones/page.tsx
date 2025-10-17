"use client";

import MilestonesCard from "@/components/MilestonesCard";
import { useAppSelector } from "@/lib/store/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import noDataIcon from "@/public/no data plant.svg";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export default function SuggestedMilestones() {
  const userId = useAppSelector((item) => item.auth.user?.id);
  // const [milestones, setMilestones] = useState<MilestonesCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const milestones = useAppSelector((s) => s.milestone.generatedMilestones);

  useEffect(() => {
    if (milestones.length < 1) {
      router.push("/milestones/generate");
    }
  }, [milestones]);

  async function addAllToPlan() {
    try {
      setLoading(true);
      await fetch("/api/milestones/generate/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestones, userId }),
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Ai plan added successfully",
        showConfirmButton: true,
        confirmButtonText: "View Your Milestones",
      }).then(() => {
        router.push("/milestones");
      });
    } catch (error) {
      console.log("error-", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-[32px] justify-start items-start w-full">
      <div className="h-fit py-[24px] px-[0px] md:px-[40px] flex flex-col gap-[32px] justify-between items-start w-full relative">
        {milestones?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 w-full">
            {milestones?.map((item, index) => (
              <MilestonesCard
                key={index}
                {...item}
                inGeneratedItemsPage
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-start mt-[16px]">
            <div className="flex justify-start items-center gap-[12px] flex-col">
              <Image src={noDataIcon} width={60} height={60} alt="" />
              No Milestones Found
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
