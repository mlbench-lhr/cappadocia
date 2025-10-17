"use client";
import image1 from "@/public/Ellipse 11.png";
import MilestonesCard from "@/components/MilestonesCard";
import { MilestonesCardType } from "@/lib/types/milestones";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MilestoneCard() {
  const { id } = useParams();
  const [item, setItem] = useState<MilestonesCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(0);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/milestones/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOpportunity();
  }, [id, refreshData]);

  if (loading && !item) {
    return (
      <div className="py-[24px] flex flex-col gap-[32px] justify-start items-start w-full">
        <div className="box-shadows-2 py-[24px] flex flex-col gap-[32px] justify-start items-start w-full relative">
          <div className="flex justify-start items-center gap-[12px] flex-col">
            Loading...
          </div>
        </div>
      </div>
    );
  }
  if (item) {
    return (
      <MilestonesCard {...item} inDetailPage setRefreshData={setRefreshData} />
    );
  } else {
    return null;
  }
}
