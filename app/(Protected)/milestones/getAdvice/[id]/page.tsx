"use client";
import { MilestoneAdviceRequest } from "@/app/api/milestones/getAdvice/route";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/store/hooks";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
interface MilestoneAdvice {
  title: string;
  description: string;
  actionSteps: string[];
}

interface AdviceResponse {
  success: boolean;
  milestone: {
    title: string;
    daysLeft: number;
    deadline: string;
  };
  advice: MilestoneAdvice[];
}

interface MilestonesCardType {
  _id?: string;
  image: string;
  category: string;
  title: string;
  organization: string;
  description: string;
  majors?: string[];
  type: string | "Opportunity" | "Awards";
  deadLine: Date;
  dependencies: string[];
  linkedOpportunities: string[];
  status?: "not_started" | "skipped" | "done" | "in_progress";
  gradeLevel?: string;
  tier?: string;
}

interface UserProfile {
  gpa?: string;
  dreamColleges?: string[];
  intendedMajor?: string;
  currentActivities?: string[];
  city?: string;
  state?: string;
}

interface MilestoneAdviceModalProps {
  milestone: MilestonesCardType;
  userProfile?: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export default function OpportunitiesCard() {
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userData = useAppSelector((s) => s.auth.user);

  const { id } = useParams();
  const [item, setItem] = useState<MilestonesCardType | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/milestones/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
      }
    };

    if (id) fetchOpportunity();
  }, [id]);

  // Fetch advice from API
  const fetchAdvice = async () => {
    try {
      const payload: MilestoneAdviceRequest = {
        userProfile: {
          gpa: userData?.academicInfo?.gpa,
          city: userData?.personalInfo?.city,
          dreamColleges: userData?.dreamsAndGoals?.dreamSchool,
          state: userData?.personalInfo?.city,
        },
        milestone: {
          title: item?.title,
          description: item?.description,
          category: item?.category,
          organization: item?.organization,
          type: item?.type,
          gradeLevel: item?.gradeLevel,
          tier: item?.tier,
          dependencies: item?.dependencies,
          deadLine: item?.deadLine,
          status: item?.status,
        },
      };
      setLoading(true);
      setError(null);

      const response = await fetch("/api/milestones/getAdvice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch advice: ${response.status}`);
      }

      const data: AdviceResponse = await response.json();

      if (!data.success) {
        throw new Error("Failed to generate advice");
      }

      setAdvice(data);
    } catch (err) {
      console.error("Error fetching advice:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch advice when modal opens
  useEffect(() => {
    if (userData?.academicInfo && item?.title) {
      fetchAdvice();
    }
  }, [userData?.academicInfo?.gpa, item?.title]);

  return (
    <div className="flex flex-col gap-[32px] justify-start items-start w-full">
      <div className="box-shadows-2 py-[24px] px-[24px] md:px-[40px] flex flex-col gap-[32px] justify-start items-start w-full relative">
        {loading ? (
          <Skeleton className="font-[500] text-[20px] w-[200px] rounded-md text-transparent">
            Loading...
          </Skeleton>
        ) : (
          <div className="flex justify-start gap-[24px] items-center">
            <Link href={"/milestones"} className="pl-2">
              <ChevronLeft />
            </Link>

            <h4
              className="font-[500] text-[20px]"
              style={{ textAlign: "start" }}
            >
              Advice For {advice?.milestone.title}
            </h4>
          </div>
        )}

        {loading ? (
          <div className="space-y-2 w-full">
            <Skeleton className="font-[500] text-[20px] w-full rounded-md text-transparent">
              Loading...
            </Skeleton>
            <Skeleton className="font-[500] text-[20px] w-full rounded-md text-transparent">
              Loading...
            </Skeleton>
            <Skeleton className="font-[500] text-[20px] w-full rounded-md text-transparent">
              Loading...
            </Skeleton>
          </div>
        ) : (
          advice?.advice.map((item) => (
            <li className="mx-[24px] md:mx-[40px]">
              <ul>{item.description}</ul>
            </li>
          ))
        )}
      </div>
    </div>
  );
}
