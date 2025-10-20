"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setGeneratedMilestones } from "@/lib/store/slices/milestoneSlice";
import { ChevronLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  type: "user" | "ai" | "system";
  message: string;
};

export default function MilestoneChat() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      type: "ai",
      message: "Hi! I’m your milestone assistant. What’s your goal?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [milestoneLoading, setMilestoneLoading] = useState(false);
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.auth.user?.id);

  const handleSubmit = async (msgP: string) => {
    setMsg("");
    if (!msgP.trim()) return;
    setChat((prev) => [...prev, { type: "user", message: msgP }]);
    setChat((prev) => [
      ...prev,
      { type: "system", message: "AI is typing..." },
    ]);
    setLoading(true);
    const res = await fetch("/api/milestones/generate/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage: msgP }),
    });
    const data = await res.json();

    setLoading(false);
    setChat((prev) => prev.filter((c) => c.type !== "system"));
    if (data.isMilestone) {
      setMilestoneLoading(true);
      dispatch(setGeneratedMilestones(data.data));
      // await fetch("/api/milestones/generate/save", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ milestone: data.data, userId }),
      // });

      setTimeout(() => {
        setMilestoneLoading(false);
      }, 1000);
      router.push("/milestones/generated-milestones");
    } else {
      setChat((prev) => [...prev, { type: "ai", message: data.data }]);
    }
  };
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  if (milestoneLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="h-fit mx-auto flex flex-col justify-start w-full items-center gap-[40px]">
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            width="113"
            height="113"
            viewBox="0 0 113 113"
            fill="none"
          >
            <circle
              cx="56.4993"
              cy="56.1074"
              r="35.3863"
              transform="rotate(150 56.4993 56.1074)"
              stroke="#B32053"
              strokeWidth="1.2638"
            />
            <path
              d="M25.8415 73.8084C23.1286 75.3747 22.1703 78.874 24.0951 81.3455C27.4008 85.5899 31.5201 89.1587 36.2313 91.8317C42.5932 95.4413 49.8037 97.2864 57.1175 97.1765C64.4313 97.0665 71.583 95.0054 77.8336 91.2062C82.4623 88.3928 86.4725 84.7018 89.6491 80.3599C91.4988 77.8317 90.4356 74.3628 87.6769 72.8787V72.8787C84.9182 71.3947 81.5162 72.4739 79.5359 74.9011C77.4074 77.5101 74.8423 79.7493 71.9416 81.5125C67.4173 84.2624 62.2408 85.7542 56.947 85.8338C51.6532 85.9134 46.4341 84.5779 41.8293 81.9652C38.8768 80.2901 36.2455 78.1289 34.0396 75.5851C31.9873 73.2185 28.5543 72.2421 25.8415 73.8084V73.8084Z"
              fill="#B32053"
            />
          </svg>
          <span className="text-[32px] font-[500]">
            Generating your Milestone{" "}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[32px] justify-start items-start w-full">
      <div className="h-[calc(100vh-142px)] box-shadows-2 py-[24px] px-[24px] md:px-[40px] flex flex-col gap-[32px] justify-between items-start w-full relative">
        <div className="flex justify-start gap-[24px] items-center">
          <Link href={"/milestones"} className="pl-2">
            <ChevronLeft />
          </Link>
          <h4 className="font-[500] text-[20px]" style={{ textAlign: "start" }}>
            Add Info to Generate Milestones{" "}
          </h4>
        </div>
        <div className="h-[100%] overflow-auto w-full flex flex-col justify-start items-start gap-[32px]">
          {chat?.map((c, i) => (
            <div key={i} className={`chat-message ${c.type}`}>
              {c.message}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="w-full h-fit flex flex-col justify-start items-center gap-[40px]">
          {!chat.find((item) => item.type === "user") && (
            <span className="text-[20px] font-[500]">
              Describe your goal to generate a milestone
            </span>
          )}
          <div className="z-[0] w-full relative h-[46px] flex justify-end items-center">
            <Input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="I want to learn data science in 3 months"
              className="z-[0] w-full absolute top-0 left-0 h-full pe-[50px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading && !milestoneLoading) {
                  handleSubmit(msg);
                }
              }}
            />
            <Button
              onClick={() => {
                handleSubmit(msg);
              }}
              disabled={loading || milestoneLoading}
              className="hover:bg-[#B32053] z-[1] text-black w-[32px] h-[32px] rounded-full bg-[#B32053] flex items-center justify-center me-3"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
