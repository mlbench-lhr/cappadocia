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
      <Card className="w-full md:w-[480px] h-full md:h-[450px]">
        <CardHeader className="flex flex-col justify-center items-center">
          <div className="h-[80px] w-[80px] flex justify-center items-center rounded-full bg-[#D8E6DD] mt-[60px]">
            <Check className="text-primary h-[40px] w-[40px]" />
          </div>
          <CardTitle className="heading-text-style-4 text-center mt-[28px]">
            Profile Setup Successful{" "}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-[38px] space-y-[16px]">
          <Button asChild className="w-full" variant="main_green_button">
            <Link href="/opportunities">Explore Opportunities</Link>
          </Button>
          <Button
            className="w-full"
            variant="secondary_plane_button"
            onClick={() => {
              dispatch(setUpdateProfileStep(0));
            }}
          >
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
