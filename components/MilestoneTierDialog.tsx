import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setMilestoneTier } from "@/lib/store/slices/generalSlice";
import { updateUser } from "@/lib/store/slices/authSlice";
import axios from "axios";
import { setRefreshMilestoneData } from "@/lib/store/slices/milestoneSlice";

export default function MilestoneTierDialog() {
  const milestoneTier = useAppSelector((item) => item.general.milestoneTier);
  const userData = useAppSelector((item) => item.auth.user);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [tierOptions, setTierOptions] = useState<string[]>(["Loading...."]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userData?.email) {
      setOpen(!userData.milestoneTier);
    }
  }, [userData?.milestoneTier, userData?.email]);
  useEffect(() => {
    async function getFields() {
      try {
        setLoading(true);
        const allData = await axios.get("/api/milestonesFields");
        setTierOptions(allData?.data?.fields?.tier);
      } catch (error) {
        console.log("error----", error);
      } finally {
        setLoading(false);
      }
    }
    getFields();
  }, []);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    console.log("milestoneTier", milestoneTier);

    if (!milestoneTier) {
      setError("Please select a Tier before proceeding.");
      return;
    }
    setError("");
    try {
      setLoading(true);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userData?.id,
          milestoneTier: milestoneTier,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      const responseData = await res.json();
      console.log("API response:", responseData);
      dispatch(updateUser(responseData.user));
      setLoading(false);
      setOpen(false);
      try {
        await axios.post("/api/roadMap");
      } catch (error) {
        console.log("error---------", error);
      }
      dispatch(setRefreshMilestoneData());
    } catch (err) {
      console.error("submit error", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="w-[95%] sm:max-w-[570px] rounded-[16px] flex flex-col justify-start items-center gap-[8px] p-[40px]"
      >
        <DialogHeader>
          <DialogTitle className="text-center w-full heading-text-style-4">
            Which Tier of School Are You Aiming For?
          </DialogTitle>
          <DialogDescription className="mt-2 grid grid-cols-1 w-full">
            <Select
              onValueChange={(e) =>
                dispatch(setMilestoneTier(e as "Tier 1" | "Tier 2" | "Tier 3"))
              }
              value={milestoneTier || ""}
            >
              <SelectTrigger className="input-style">
                <SelectValue placeholder="Select a Tier" />
              </SelectTrigger>
              <SelectContent>
                {tierOptions?.map((item) => (
                  <SelectItem value={item} key={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex items-center justify-end w-full">
          <DialogFooter className="w-full">
            <div className="w-full grid grid-cols-1 gap-[20px]">
              <Button
                variant={"main_green_button"}
                className="col-span-1"
                onClick={() => onSubmit()}
                loading={loading}
              >
                Next
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
