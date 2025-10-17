"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import profileAvatar from "@/public/profile avatar.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAppSelector } from "@/lib/store/hooks";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";

export interface MilestoneForm {
  image: string;
  title: string;
  organization: string;
  type: string | "Opportunity" | "Awards";
  category: string;
  gradeLevel: string;
  deadLine: Date;
  description: string;
  dependencies: string[];
  linkedOpportunities: string[];
}

const schema = z.object({
  image: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  organization: z.string().min(2, "Organization must be at least 2 characters"),
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  gradeLevel: z.string().min(1, "Grade Level is required"),
  deadLine: z.string().min(1, "Deadline is required"),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  linkedOpportunities: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

export default function MilestoneFormComponent() {
  const [avatar, setAvatar] = useState<string>("");
  const [typeOptions, setTypeOptions] = useState<string[]>(["Loading...."]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([
    "Loading....",
  ]);
  const userId = useAppSelector((item) => item.auth.user?.id);
  const userData = useAppSelector((item) => item.auth.user);
  const router = useRouter();

  useEffect(() => {
    async function getFields() {
      try {
        setLoading(true);
        const allData = await axios.get("/api/milestonesFields");
        setTypeOptions(allData?.data?.fields?.type);
        setCategoryOptions(allData?.data?.fields?.category);
      } catch (error) {
        console.log("error----", error);
      } finally {
        setLoading(false);
      }
    }
    getFields();
  }, []);

  const {
    handleSubmit,
    setValue,
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      image: "",
      title: "",
      organization: "",
      type: "",
      category: "",
      gradeLevel: "",
      deadLine: "",
      description: "",
      dependencies: [],
      linkedOpportunities: [],
    },
  });

  const handleAvatarUpload = (url: string) => {
    setAvatar(url);
    setValue("image", url);
  };

  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async (data: FormData) => {
    if (!userId) return;

    setLoading(true);
    try {
      const payload = {
        ...data,
        createdBy: userId, // current logged-in user
        tier: userData?.milestoneTier || "Tier 1",
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
          confirmButtonColor: "#22c55e", // match shadcn green if you want
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Milestone added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        reset();
      }
      router.push("/milestones");
    } catch (error) {
      console.error("Error adding milestone:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[24px] w-full bg-white box-shadows-2"
    >
      <div className="flex justify-between gap-[24px] items-center mb-[16px] w-full">
        <div className="flex justify-start gap-[14px] sm:gap-[24px] items-center mb-[16px]">
          <Link href={"/milestones"} className="pl-0 md:pl-2">
            <ChevronLeft />
          </Link>
          <h4
            className="text-xl md:text-2xl font-semibold text-gray-900"
            style={{ textAlign: "start" }}
          >
            Add Custom Milestone
          </h4>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || loading}
          variant="main_green_button"
          size="lg"
          className="hidden md:block"
        >
          {isSubmitting ? "Saving..." : "Add"}
        </Button>
      </div>

      {/* Avatar Upload */}
      <div className="w-full h-[182px] md:h-[118px] flex justify-start items-start relative">
        <div className="w-full h-fit flex justify-start items-start flex-col gap-[8px]">
          <span className="plan-text-style-4">Add Image</span>
          <span className="plan-text-style-3">
            Add Image for this milestone
          </span>
          <div className="absolute left-[50%] top-[calc(100%-50px)] lg:top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <AvatarUpload
              currentAvatar={avatar}
              onAvatarUpload={handleAvatarUpload}
              size={70}
              setLoading={setLoading}
              milestone={true}
            />
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Title */}
          <div className="flex flex-col gap-[10px]">
            <Label htmlFor="title" className="label-style">
              Title<span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              className="input-style"
              placeholder="Enter Title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Organization */}
          <div className="flex flex-col gap-[10px]">
            <Label htmlFor="organization" className="label-style">
              Organization<span className="text-red-500">*</span>
            </Label>
            <Input
              id="organization"
              className="input-style"
              placeholder="Enter Organization"
              {...register("organization")}
            />
            {errors.organization && (
              <p className="text-red-500 text-sm">
                {errors.organization.message}
              </p>
            )}
          </div>

          {/* Type (Select) */}
          <div className="flex flex-col gap-[10px]">
            <Label className="label-style">
              Type<span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="input-style">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions?.map((item) => (
                      <SelectItem value={item} key={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          {/* Category (Select) */}
          <div className="flex flex-col gap-[10px]">
            <Label className="label-style">
              Category<span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="input-style">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions?.map((item) => (
                      <SelectItem value={item} key={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Grade Level (Select) */}
          <div className="flex flex-col gap-[10px]">
            <Label className="label-style">
              Grade Level<span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="gradeLevel"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="input-style">
                    <SelectValue placeholder="Select Grade Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gradeLevel && (
              <p className="text-red-500 text-sm">
                {errors.gradeLevel.message}
              </p>
            )}
          </div>

          {/* Deadline (Date Picker) */}
          <div className="flex flex-col gap-[10px]">
            <Label className="label-style">
              Deadline<span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="deadLine"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal input-style ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      {field.value ? (
                        new Date(field.value).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      ) : (
                        <span>Select Deadline</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      initialFocus
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.deadLine && (
              <p className="text-red-500 text-sm">{errors.deadLine.message}</p>
            )}
          </div>

          {/* Linked Opportunities */}
          {/* <div className="flex flex-col gap-[10px]">
            <Label htmlFor="linkedOpportunities" className="label-style">
              Linked Opportunities
            </Label>
            <Input
              id="linkedOpportunities"
              className="input-style"
              placeholder="Comma separated values"
              onChange={(e) =>
                setValue(
                  "linkedOpportunities",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
            />
          </div> */}

          {/* Dependencies */}
          {/* <div className="flex flex-col gap-[10px]">
            <Label htmlFor="dependencies" className="label-style">
              Dependencies (optional)
            </Label>
            <Input
              id="dependencies"
              className="input-style"
              placeholder="Comma separated values"
              onChange={(e) =>
                setValue(
                  "dependencies",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
            />
          </div> */}
        </div>
      </div>

      {/* Description */}
      <div className="col-span-12 flex flex-col gap-[10px]">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Label className="label-style">Description</Label>
            <Label className="label-style" style={{ fontWeight: 400 }}>
              Add short explanation of the milestone
            </Label>
          </div>
        </div>
        <Textarea
          className="input-style"
          style={{ height: "100px" }}
          placeholder="Enter description"
          {...register("description")}
          rows={5}
        />
        <div className="col-span-12 flex-col gap-[10px] flex md:hidden">
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            variant="main_green_button"
            size="lg"
          >
            {isSubmitting ? "Saving..." : "Add"}
          </Button>
        </div>
      </div>
    </form>
  );
}
