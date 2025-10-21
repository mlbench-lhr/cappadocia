"use client";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store/hooks";
import Image from "next/image";
import Link from "next/link";
import pencil from "@/public/pencil.svg";
import aiIcon from "@/public/aiIcon.svg";
import sparkles from "@/public/sparkles green.svg";
import trophyGreen from "@/public/trophy green.svg";
import school from "@/public/school.svg";
import calendarIcon2 from "@/public/calendar-days (1).svg";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const userData = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [tilesLoading, setTilesLoading] = useState(true);
  const user = useAppSelector((item) => item.auth.user);
  const currentSeason = getSeason();
  const [tilesData, setTilesData] = useState<{
    applicationsStarted: number;
    daysUntilNextDeadline: number;
    blogsCompleted: number;
    opportunitiesSaved: number;
    nextAction: string;
    progressPercent: number;
    totalBlogs: number;
  } | null>(null);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      setTilesLoading(true);
      try {
        const res = await axios.get(
          `/api/dashboard/${userData?.id}?grade=${
            user?.academicInfo?.gradeLevel || "9"
          }&season=${currentSeason || "Fall"}&tier=${user?.blogTier}`
        );
        setTilesData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setTilesLoading(false);
      } finally {
        setTilesLoading(false);
      }
    };
    if (userData?.id) {
      fetchDashboard();
    }
  }, [
    userData?.id,
    user?.academicInfo?.gradeLevel,
    user?.blogTier,
    currentSeason,
  ]);
  console.log("tilesData", tilesData, userData?.id);
  const [rerunLoading, setRerunLoading] = useState(false);
  const router = useRouter();

  async function reRunAiPlan() {
    try {
      setRerunLoading(true);
      const userInfoPayload = {
        tier: userData?.blogTier,
        gpa: userData?.academicInfo?.gpa,
        gradeLevel: userData?.academicInfo?.gradeLevel,
        majors: userData?.dreamsAndGoals?.majors,
        dreamSchool: userData?.dreamsAndGoals?.dreamSchool,
        extracurricularActivity:
          userData?.extracurricularsAndAwards?.extracurricularActivity,
      };
      const res = await fetch("/api/dashboard/reRunAiPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfoPayload),
      });
      const result = await res.json();
      console.log("userInfoPayload-------", result);
      setRerunLoading(false);
      dispatch(setGeneratedBlogs(result.data));
      router.push("/blogs/generated-plan");
    } catch (error) {
      console.log("error--------", error);
    }
  }

  return (
    <div className="flex flex-col gap-[32px] justify-start items-start w-full">
      <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-11 w-full">
        <div className="w-full h-fit xl:h-[222px] xl:col-span-7 bg-[#F5FBF5] box-border box-radius p-[24px]">
          <div className="w-full flex flex-col justify-start items-start gap-[16px]">
            {tilesLoading ? (
              <Skeleton
                className="heading-text-style-4 w-full rounded-md"
                style={{ color: "transparent" }}
              >
                Hi, {userData?.firstName}! Here's your Progress toward your
                goals.
              </Skeleton>
            ) : (
              <h1
                className="heading-text-style-4"
                style={{ textAlign: "start" }}
              >
                Hi, {userData?.firstName}! Here's your Progress toward your
                goals.
              </h1>
            )}

            {tilesLoading ? (
              <Skeleton className="w-full lg:w-[500px] rounded-md h-[20px]" />
            ) : tilesData?.totalBlogs ? (
              <div className="w-full lg:w-fit h-[20px] flex justify-start gap-[16px] items-center">
                <div className="w-full lg:w-[500px] h-[10px] flex justify-start items-center bg-[#D8E6DD] rounded-[100px]">
                  <div
                    className={`h-[10px] flex justify-start gap-[8px] items-center bg-[#B32053] rounded-[100px]`}
                    style={{ width: `${tilesData?.progressPercent}%` }}
                  ></div>
                </div>
                <div className="label-style">
                  {tilesData?.progressPercent?.toFixed(2)}%
                </div>
              </div>
            ) : (
              <>Add blog to see your progress.</>
            )}

            {tilesLoading ? (
              <Skeleton className="font-[14px] leading-[20px] w-[200px] rounded-md text-transparent">
                Next step
              </Skeleton>
            ) : (
              <p className="plan-text-style-3" style={{ textAlign: "start" }}>
                {tilesData?.nextAction}
              </p>
            )}

            {tilesLoading ? (
              <Skeleton className="w-[200px] h-10 rounded-md mt-[8px]" />
            ) : (
              <Button
                variant={"main_green_button"}
                asChild
                size="lg"
                className="primary-button mt-[8px]"
              >
                <Link href="/blogs">View Blogs</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="h-fit md:h-[222px] xl:col-span-4 bg-[#F5FBF5] box-border box-radius p-[24px]">
          <div className="w-full flex flex-col justify-start items-start gap-[16px]">
            <h1 className="heading-text-style-4 mb-[8px]">Quick Actions </h1>
            <Button
              variant={"main_green_button"}
              asChild
              size="lg"
              className="primary-button w-full"
            >
              <Link
                href="/update-profile"
                className="flex justify-center items-center gap-[8px]"
              >
                <Image src={pencil.src} alt="" width={12} height={12} />
                Update Profile
              </Link>
            </Button>
            <Button
              variant={"main_green_button"}
              asChild
              size="lg"
              className="primary-button w-full"
            >
              <Button
                onClick={reRunAiPlan}
                className="flex justify-center items-center gap-[8px]"
                disabled={rerunLoading}
              >
                <Image src={aiIcon.src} alt="" width={12} height={12} />
                {rerunLoading ? "AI is thinking...." : "Re-run AI Plan"}
              </Button>
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
        {tilesLoading ? (
          <>
            <TilesSkeleton />
            <TilesSkeleton />
            <TilesSkeleton />
            <TilesSkeleton />
          </>
        ) : (
          <>
            <div className="h-[136px] md:h-[148px] bg-white box-border box-radius p-6 flex flex-col gap-4 justify-start items-start">
              <div
                className="w-full flex justify-between items-center heading-text-style-1"
                style={{ fontSize: "40px" }}
              >
                {tilesData?.opportunitiesSaved || 0}
                <Image src={sparkles.src} alt="" width={32} height={32} />
              </div>
              <p className="heading-text-style-5">Opportunities Saved</p>
            </div>
            <div className="h-[136px] md:h-[148px] bg-white box-border box-radius p-6 flex flex-col gap-4 justify-start items-start">
              <div
                className="w-full flex justify-between items-center heading-text-style-1"
                style={{ fontSize: "40px" }}
              >
                {tilesData?.applicationsStarted || 0}
                <Image src={trophyGreen.src} alt="" width={32} height={32} />
              </div>
              <p className="heading-text-style-5">Applications Started</p>
            </div>
            <div className="h-[136px] md:h-[148px] bg-white box-border box-radius p-6 flex flex-col gap-4 justify-start items-start">
              <div
                className="w-full flex justify-between items-center heading-text-style-1"
                style={{ fontSize: "40px" }}
              >
                {tilesData?.blogsCompleted || 0}
                <Image src={school.src} alt="" width={32} height={32} />
              </div>
              <p className="heading-text-style-5">Blogs Completed</p>
            </div>
            <div className="h-[136px] md:h-[148px] bg-white box-border box-radius p-6 flex flex-col gap-4 justify-start items-start">
              <div
                className="w-full flex justify-between items-center heading-text-style-1"
                style={{ fontSize: "40px" }}
              >
                {tilesData?.daysUntilNextDeadline || 0}
                <Image src={calendarIcon2.src} alt="" width={32} height={32} />
              </div>
              <p className="heading-text-style-5">Days until Next Deadline</p>
            </div>
          </>
        )}
      </div>
      <UpcomingEvents />
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import UpcomingEvents from "./UpcomingEvents";
import { setGeneratedBlogs } from "@/lib/store/slices/blogSlice";
import { getSeason } from "@/lib/helper/timeFunctions";

function TilesSkeleton() {
  return (
    <div className="h-[136px] md:h-[148px] bg-white box-border box-radius p-6 flex flex-col gap-4 justify-between items-start">
      <div className="w-full flex justify-between items-center">
        <Skeleton className="h-10 w-12 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-5 w-40 rounded-md" />
    </div>
  );
}
