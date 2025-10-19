import moment from "moment";
import done from "@/public/check-circle-2.svg";
import not_started from "@/public/circle-off.svg";
import skipped from "@/public/x-circle.svg";
import in_progress from "@/public/circle-ellipsis.svg";
import Image from "next/image";
import Link from "next/link";
import { MilestonesCardType } from "@/lib/types/milestones";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import MileStoneDateDialog from "./MileStoneDateDialog";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getSeason } from "@/lib/helper/timeFunctions";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  removeGeneratedMilestone,
  setGeneratedMilestones,
} from "@/lib/store/slices/milestoneSlice";
import { useRouter } from "next/navigation";
import {
  setOpportunities,
  setQueryValue,
} from "@/lib/store/slices/opportunitySlice";
const statusIcons: Record<string, any> = {
  done,
  not_started,
  skipped,
  in_progress,
};
type MilestonesCardProps = MilestonesCardType & {
  inDetailPage?: boolean;
  inGeneratedItemsPage?: boolean;
  inPlanPage?: boolean;
  index?: number;
  setRefreshData?: any;
};

export default function MilestonesCard(item: MilestonesCardProps) {
  const [skipped, setSkipped] = useState(item.skipped);
  const [started, setStarted] = useState(item.started);
  const [done, setDone] = useState(item.completed);
  const user = useAppSelector((s) => s.auth.user);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [rerunLoading, setRerunLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setSkipped(item.skipped);
  }, [item.skipped]);
  useEffect(() => {
    setStarted(item.started);
  }, [item.started]);
  useEffect(() => {
    setDone(item.completed);
  }, [item.completed]);

  async function skipReplacement() {
    try {
      setRerunLoading(true);
      const userInfoPayload = item;
      const res = await fetch("/api/milestones/skipReplacement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfoPayload),
      });
      const result = await res.json();
      dispatch(setGeneratedMilestones(result.data));
      setRerunLoading(false);
      router.push("/milestones/suggested-milestones");
    } catch (error) {
      console.log("error--------", error);
    }
  }

  const handleSkip = async () => {
    try {
      if (isFirstLoad) {
        setLoading(true);
      }
      if (!item.skipped) {
        await skipReplacement();
      }
      const res = await fetch(`/api/milestones/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skipped: !item.skipped,
          status: !item.skipped ? "skipped" : "not_started",
        }),
      });

      if (res.ok) {
        // setSkipped(true);
        console.log(`Milestone ${item._id} marked as skipped`);
      } else {
        console.error("Failed to skip milestone");
      }
      if (item?.setRefreshData) {
        item?.setRefreshData((prev: number) => prev + 1);
      }
    } catch (err) {
      console.error("Error skipping milestone:", err);
    } finally {
      if (isFirstLoad) {
        setLoading(false);
        setIsFirstLoad(false);
      }
    }
  };

  const handleStart = async () => {
    try {
      const res = await fetch(`/api/milestones/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ started: true, status: "in_progress" }),
      });

      if (res.ok) {
        setStarted(true);
        console.log(`Milestone ${item._id} marked as skipped`);
      } else {
        console.error("Failed to skip milestone");
      }
      if (item?.setRefreshData) {
        item?.setRefreshData((prev: number) => prev + 1);
      }
    } catch (err) {
      console.error("Error skipping milestone:", err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: {
            title: item.title,
            category: item.category,
          },
          milestone: item,
        }),
      });

      const data = await res.json();
      dispatch(setOpportunities(data.opportunities));
      dispatch(setQueryValue(true));
      router.push("/opportunities");
    } catch (error) {
      console.error("AI search error:", error);
    }
  };

  const handleDone = async () => {
    try {
      const res = await fetch(`/api/milestones/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: !item.completed,
          status: item.completed ? "in_progress" : "done",
          completedAt: new Date(),
        }),
      });

      if (res.ok) {
        setStarted(true);
        console.log(`Milestone ${item._id} marked as skipped`);
      } else {
        console.error("Failed to skip milestone");
      }
      if (item?.setRefreshData) {
        item?.setRefreshData((prev: number) => prev + 1);
      }
    } catch (err) {
      console.error("Error skipping milestone:", err);
    }
  };

  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteMilestone = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B32053",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeleteLoading(true);
          const res = await fetch(`/api/milestones/${item._id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              completed: !item.completed,
              status: item.completed ? "in_progress" : "done",
              completedAt: new Date(),
            }),
          });

          if (res.ok) {
            setStarted(true);
            console.log(`Milestone ${item._id} marked as skipped`);
          } else {
            console.error("Failed to skip milestone");
          }
          if (item?.setRefreshData) {
            item?.setRefreshData((prev: number) => prev + 1);
          }
          router.push("/milestones");
          if (item?.setRefreshData) {
            item?.setRefreshData((prev: number) => prev + 1);
          }
        } catch (err) {
          console.error("Error skipping milestone:", err);
        } finally {
          setDeleteLoading(false);
        }
      }
    });
  };
  const dispatch = useAppDispatch();
  async function addToMilestone() {
    console.log();
    setLoading(true);
    try {
      const payload = {
        image: item?.image,
        title: item?.title,
        organization: item?.organization,
        type: "Opportunity",
        category: item?.category,
        gradeLevel: user?.academicInfo?.gradeLevel,
        deadLine: item?.deadLine,
        majors: item?.majors || [],
        description: item?.description,
        dependencies: [],
        linkedOpportunities: [],
        createdBy: user?.id,
        season: getSeason(),
        opportunityId: item?._id,
        aiGenerated: true,
        tier: user?.milestoneTier || "Tier 1",
      };

      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Something went wrong",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Milestone added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      if (item?.index !== undefined) {
        dispatch(removeGeneratedMilestone(item?.index));
      }
    } catch (error) {
      console.error("Error adding milestone:", error);
    } finally {
      setLoading(false);
    }
  }

  const [imgSrc, setImgSrc] = useState(
    item.image ||
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
  );
  useEffect(() => {
    setImgSrc(
      item.image ||
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
    );
  }, [item.image]);

  return (
    <div
      className={`${
        item?.inGeneratedItemsPage || item?.inPlanPage
          ? "box-shadows-2"
          : "section-box-2"
      } py-[24px] px-[16px] flex flex-col gap-[16px] justify-start items-start w-full relative z-[1] overflow-hidden`}
      style={{
        backgroundColor:
          !item?.inDetailPage &&
          !item?.inGeneratedItemsPage &&
          !item?.inPlanPage
            ? "#EFF5F0"
            : "white",
      }}
    >
      {!item.inDetailPage && !item.inGeneratedItemsPage && !item.inPlanPage && (
        <Link
          href={`/milestones/detail/${item?._id}`}
          className="absolute w-full h-full top-0 left-0 z-[0]"
        ></Link>
      )}
      <div
        className={`${
          item.index === 0 && item?.inGeneratedItemsPage ? "flex" : "hidden"
        } justify-start gap-[10px] md:gap-[24px] items-center mb-[16px]`}
      >
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <h4
          className="font-[500] text-[16px] md:text-[24px]"
          style={{ textAlign: "start" }}
        >
          Generated Milestones{" "}
        </h4>
      </div>

      {item?.inDetailPage && (
        <div className="w-full flex justify-start gap-[12px] items-center mb-[16px]">
          <Link href={"/milestones"} className="pl-2">
            <ChevronLeft />
          </Link>
          <h4
            className="w-full font-[500] text-[20px] truncate"
            style={{ textAlign: "start" }}
          >
            {item.title}
          </h4>
        </div>
      )}

      <div className="flex justify-between items-center w-full z-[2]">
        <div className="flex justify-start gap-[16px] items-center lg:w-[60%]">
          <div className="flex justify-start gap-[16px] items-start max-w-[90px]">
            {!item?.inDetailPage && item.status && (
              <Image
                src={statusIcons?.[item.status]}
                width={16}
                height={16}
                alt={""}
                className="mt-1"
              />
            )}
            <div className="rounded-full overflow-hidden w-[56px] h-[56px] object-cover">
              <Image
                src={imgSrc}
                width={56}
                height={56}
                alt={""}
                className="w-[56px] h-[56px] object-cover"
                onError={() =>
                  setImgSrc(
                    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                  )
                }
              />
            </div>
          </div>
          <div className="flex justify-start gap-[8px] flex-col items-start w-[calc(100%-100px)]">
            <Link
              href={`/milestones/detail/${item?._id}`}
              className={`heading-text-style-2 max-w-[100%] line-clamp-2 hover:underline ${
                item.status === "skipped" && "line-through"
              }`}
            >
              {item.title}
            </Link>
            {!item.inGeneratedItemsPage && (
              <h5
                className="heading-text-style-5"
                style={{ textAlign: "start" }}
              >
                {item.organization}
              </h5>
            )}
          </div>
        </div>

        {item.inGeneratedItemsPage || item.inPlanPage ? (
          <div className="hidden lg:flex justify-end items-center gap-[16px] w-fit flex-wrap">
            <Button
              variant={"secondary_button"}
              size={"sm"}
              className="w-[104px] h-[38px] py-0 text-[14px] font-[500]"
              onClick={() => {
                if (item?.index !== undefined) {
                  dispatch(removeGeneratedMilestone(item?.index));
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant={"main_green_button"}
              size={"sm"}
              className="w-fit h-[38px] py-0 text-[14px] font-[500]"
              onClick={addToMilestone}
            >
              {loading ? "Adding..." : "Add to Milestone"}
            </Button>
          </div>
        ) : (
          <div className="hidden lg:flex justify-end items-center gap-[16px] w-fit">
            <Button
              variant={"secondary_button"}
              size={"sm"}
              className="w-[104px] h-[38px] py-0 text-[14px] font-[500]"
              onClick={() => {
                deleteMilestone();
              }}
              disabled={deleteLoading}
            >
              Delete
            </Button>
            {!done && (
              <Button
                variant={"green_secondary_button"}
                size={"sm"}
                className="w-[104px] h-[38px] py-0 text-[14px] font-[500]"
                asChild
              >
                <Link href={`/milestones/getAdvice/${item._id}`}>
                  Get Advice
                </Link>
              </Button>
            )}

            {!started && (
              <Button
                variant={"green_secondary_button"}
                size={"sm"}
                className="min-w-[104px] h-[38px] py-0 text-[14px] font-[500]"
                onClick={handleSkip}
                disabled={rerunLoading || loading}
                loading={rerunLoading || loading}
                loadingText="Making Replacements...."
              >
                {skipped ? "UnSkip" : "Skip"}
              </Button>
            )}
            {started ? (
              <Button
                variant={done ? "green_secondary_button" : "main_green_button"}
                size={"sm"}
                className="w-[145px] h-[38px] py-0 text-[14px] font-[500]"
                onClick={handleDone}
              >
                {done ? "UnMark as Done" : "Mark as Done"}
              </Button>
            ) : !skipped && !item.aiGenerated ? (
              <Button
                variant={"main_green_button"}
                size={"sm"}
                className="w-[104px] h-[38px] py-0 text-[14px] font-[500]"
                onClick={handleStart}
              >
                Start
              </Button>
            ) : null}
            {item.aiGenerated && !skipped && (
              <Button
                variant={"main_green_button"}
                size={"sm"}
                className="w-fit h-[38px] py-0 text-[14px] font-[500]"
                onClick={handleSearch}
              >
                Search Opportunity
              </Button>
            )}
          </div>
        )}
      </div>

      {!item.inGeneratedItemsPage && (
        <div className="flex justify-start items-center gap-[16px] z-[2]">
          <div
            className={`px-[5px] py-[1px] text-[11px] font-[500] rounded-[6px] bg-[#E1E3DF] text-[#444845] `}
          >
            {item.type}
          </div>
          <div
            className={`px-[8px] py-[1px] text-[11px] font-[500] rounded-[6px] border-2 border-[#9DADBC]`}
          >
            Due: {moment(item.deadLine).format("MMM DD, YYYY")}
          </div>
          <MileStoneDateDialog
            id={item?._id}
            setRefreshData={item.setRefreshData}
          />
        </div>
      )}
      <span
        className={`plan-text-style-3 z-[2] ${
          item.inDetailPage ? "" : "line-clamp-1"
        } w-[100%] md:w-[60%]`}
        style={{ textAlign: "start" }}
      >
        {item.description}
      </span>
      {item.inGeneratedItemsPage && (
        <div className="flex justify-start items-center gap-[16px] z-[2]">
          <div
            className={`px-[8px] py-[1px] text-[11px] font-[500] rounded-[6px] border-2 border-[#9DADBC]`}
          >
            Due: {moment(item.deadLine).format("MMM DD, YYYY")}
          </div>
          <div
            className={`px-[5px] py-[1px] text-[11px] font-[500] rounded-[6px] bg-[#E1E3DF] text-[#444845] `}
          >
            Not Started
          </div>
        </div>
      )}
      <div className="flex justify-start items-center gap-[16px] flex-wrap z-[2]">
        {item?.majors?.map((item) => (
          <div
            key={item}
            className="px-[8px] py-[2px] text-[11px] font-[500] bg-[#D8E6DD] rounded-[6px]"
          >
            {item}
          </div>
        ))}
      </div>
      <div className="w-full flex justify-between items-center md:w-[60%] flex-wrap gap-y-[16px] z-[2]">
        {/* {item.dependencies?.length ? (
          <div className="flex justify-start items-start gap-[8px] flex-col w-[70%] lg:w-[50%] pe-0 md:pe-4">
            <span className="font-[500] text-[14px]">Dependencies:</span>
            <span className="plan-text-style-3" style={{ textAlign: "start" }}>
              {item.dependencies?.join(", ")}
            </span>
          </div>
        ) : null} */}

        {/* {item?.linkedOpportunities?.length > 0 ? (
          <div className="flex justify-start items-start gap-[8px] flex-col w-[70%] lg:w-[50%]">
            <span className="font-[500] text-[14px]">
              Linked Opportunities:
            </span>
            <span className="plan-text-style-3" style={{ textAlign: "start" }}>
              {item.linkedOpportunities?.join(", ")}
            </span>
          </div>
        ) : null} */}
      </div>
      {!item.inGeneratedItemsPage && !item.inPlanPage ? (
        <div className="grid grid-cols-2 lg:hidden gap-[16px] w-full flex-wrap z-[2]">
          <Button
            variant={"secondary_button"}
            size={"sm"}
            className="col-span-1 h-[38px] py-0 text-[14px] font-[500]"
            onClick={() => {
              deleteMilestone();
            }}
            disabled={deleteLoading}
          >
            Delete
          </Button>
          {!done && (
            <Button
              variant={"green_secondary_button"}
              size={"sm"}
              className="col-span-1 h-[38px] py-0 text-[14px] font-[500]"
            >
              Get Advice
            </Button>
          )}

          {!started && (
            <Button
              variant={"green_secondary_button"}
              size={"sm"}
              className="col-span-1 h-[38px] py-0 text-[14px] font-[500]"
              onClick={handleSkip}
            >
              {skipped ? "UnSkip" : "Skip"}
            </Button>
          )}

          {started ? (
            <Button
              variant={"main_green_button"}
              size={"sm"}
              className="col-span-2 h-[38px] py-0 text-[14px] font-[500]"
              onClick={handleDone}
            >
              Mark as Done
            </Button>
          ) : !skipped && !item.aiGenerated ? (
            <Button
              variant={"main_green_button"}
              size={"sm"}
              className="col-span-1 h-[38px] py-0 text-[14px] font-[500]"
              onClick={handleStart}
            >
              Start
            </Button>
          ) : null}
          {item.aiGenerated && !skipped && (
            <Button
              variant={"main_green_button"}
              size={"sm"}
              className="w-fit h-[38px] py-0 text-[14px] font-[500]"
              onClick={handleSearch}
            >
              Search Opportunity
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-[16px] w-full z-[2]">
          <Button
            variant={"secondary_button"}
            size={"sm"}
            className="col-span-1 h-[38px] py-0 text-[14px] font-[500]"
            onClick={() => {
              if (item?.index !== undefined) {
                dispatch(removeGeneratedMilestone(item?.index));
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant={"main_green_button"}
            size={"sm"}
            className="col-span-1 h-[38px] py-0 text-[14px] font-[500]"
            onClick={addToMilestone}
          >
            {loading ? "Adding..." : "Add to Milestone"}
          </Button>
        </div>
      )}
    </div>
  );
}
