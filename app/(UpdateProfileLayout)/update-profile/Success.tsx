"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUpdateProfileStep } from "@/lib/store/slices/generalSlice";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Success() {
  const dispatch = useAppDispatch();
  return (
    <div className="w-full h-full flex justify-center min-h-[calc(100vh-320px)] items-center">
      <Card className="w-full md:w-[490px] h-full md:h-[312px] flex flex-col justify-center items-center">
        <CardHeader className="flex flex-col justify-center items-center">
          <div className="h-[170px] w-[170px] flex justify-center items-center rounded-full border">
            <div className="h-[120px] w-[120px] flex justify-center items-center rounded-full border">
              <div className="h-[80px] w-[80px] flex justify-center items-center rounded-full bg-primary">
                <Check className="text-white" size={40} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-base font-medium text-center">
          <span>
            Your vendor profile has been submitted successfully and is now
            pending admin review. You will be notified once approved.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
