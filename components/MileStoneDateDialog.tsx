"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import DeadlinePicker from "./ui/datePicker";
import { useState } from "react";

export default function MileStoneDateDialog({
  id,
  setRefreshData,
}: {
  id?: string;
  setRefreshData?: any;
}) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<boolean>(true);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/milestones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deadLine: date }),
      });

      if (res.ok) {
        console.log(`Milestone ${id} marked as skipped`);
      } else {
        console.error("Failed to skip milestone");
      }
    } catch (err) {
      console.error("Error skipping milestone:", err);
    } finally {
      setRefreshData((prev: number) => prev + 1);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className={`px-[3px] py-[1px] text-[11px] font-[500] rounded-[6px] bg-[#FFFFEA] cursor-pointer`}
          >
            Update Date
          </div>
        </DialogTrigger>

        <DialogContent className="w-[95%] sm:max-w-[570px] rounded-[16px] flex flex-col justify-start items-center gap-[8px] p-[40px]">
          <DialogHeader>
            <DialogTitle className="text-center w-full heading-text-style-4">
              Update Due Date
            </DialogTitle>
            <DialogDescription className="mt-2 grid grid-cols-1 w-full">
              <span
                className="text-[14px] font-[400]"
                style={{ textAlign: "center" }}
              >
                This due date is estimated. You can refresh for the latest date
                or enter the exact one manually.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="w-full flex justify-between items-center text-[14px] font-[500] mt-[16px] border-b-4 border-[#F5FBF5]">
            <div
              className={`w-[49.5%] flex justify-center items-center pb-[8px] ${
                refreshToken ? "border-b-4 border-[#B32053]" : ""
              }`}
            >
              Refresh Date
            </div>
            <div
              className={`w-[49.5%] flex justify-center items-center pb-[8px] ${
                !refreshToken ? "border-b-4 border-[#B32053]" : ""
              }`}
            >
              Enter Due Date
            </div>
          </div>

          {!refreshToken && <DeadlinePicker date={date} setDate={setDate} />}

          <div className="mt-6 flex items-center justify-end w-full">
            <DialogFooter className="w-full">
              <div className="w-full grid grid-cols-1 gap-[20px]">
                {refreshToken ? (
                  <Button
                    onClick={() => {
                      setRefreshToken(false);
                    }}
                    variant={"main_green_button"}
                    className="col-span-1"
                  >
                    Refresh Date
                  </Button>
                ) : (
                  <DialogClose asChild>
                    <Button
                      onClick={handleSubmit}
                      variant={"main_green_button"}
                      className="col-span-1"
                    >
                      Update
                    </Button>
                  </DialogClose>
                )}
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
