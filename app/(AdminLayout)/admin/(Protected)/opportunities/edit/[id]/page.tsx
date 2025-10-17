"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AdminLayout } from "@/components/admin/admin-layout";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Save, Trash } from "lucide-react";
import { OpportunitiesCardType } from "@/lib/types/opportunities";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import Link from "next/link";
import { useRouter } from "next/navigation";

const initialFormState: OpportunitiesCardType = {
  _id: 0,
  location: "",
  image: "",
  category: "Internships",
  title: "",
  institute: "",
  description: "",
  majors: [],
  type: "Online",
  difficulty: "Easy",
  dueDate: new Date(),
  saved: false,
  ignored: false,
  addedToMilestone: false,
  appliedBy: [],
  milestoneAddedBy: [],
  savedBy: [],
  ignoredBy: [],
  price: 0,
  perHour: false,
  link: "",
};

export default function AddOpp() {
  const { id } = useParams();
  const user = useAppSelector((s) => s.auth.user);
  const [item, setItem] = useState<OpportunitiesCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] =
    useState<OpportunitiesCardType>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5AD2A6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeleteLoading(true);
          const res = await fetch(`/api/opportunities/${item?._id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          if (res.ok) {
            console.log(`Milestone ${item?._id} marked as skipped`);
          } else {
            console.error("Failed to skip milestone");
          }
          router.push(`/admin/opportunities`);
        } catch (err) {
          console.error("Error skipping milestone:", err);
        } finally {
          setDeleteLoading(false);
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.institute ||
      !formData.location ||
      !formData.link
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields (Title, Organization, Location, Link).",
      });
      return;
    }
    const payload = {
      image: formData.image,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      institute: formData.institute,
      difficulty: formData.difficulty,
      link: formData.link,
      location: formData.location,
      type: formData.type,
      price: formData.price,
      dueDate:
        typeof formData.dueDate === "string"
          ? formData.dueDate
          : formData.dueDate.toISOString(),
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/opportunities/${item?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Opportunity Updated successfully",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          router.push(`/admin/opportunities/detail/${id}`);
        });
        setFormData(initialFormState);
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Failed to add opportunity.",
        });
      }
    } catch (error) {
      console.error("Error saving opportunity:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "An error occurred while connecting to the server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = (url: string) => {
    setFormData({ ...formData, image: url });
  };
  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/opportunities/${id}`);
        setItem(res.data);
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOpportunity();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-[24px] flex flex-col gap-[32px] justify-start items-start w-full">
          <div className="py-[24px] flex flex-col gap-[32px] justify-start items-start w-full relative">
            <div className="flex justify-start items-center gap-[12px] flex-col">
              Loading...
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full">
        <div className="w-full mx-auto">
          <div className="w-full mb-4 flex justify-between items-center">
            <div className="w-fit mb-0 spacey-[15px]">
              <div className="flex justify-start gap-6 items-center">
                <Link href={"/admin/opportunities"} className="pl-2">
                  <ChevronLeft />
                </Link>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-700">
                  Edit Opportunity
                </h1>
              </div>
            </div>
            <div className="hidden md:flex justify-end items-center gap-4">
              <Button
                onClick={handleDelete}
                variant={"secondary_button"}
                loading={deleteLoading}
              >
                <Trash className="mr-2" size={16} />
                Delete
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !formData.title ||
                  !formData.institute ||
                  !formData.location ||
                  !formData.link
                }
                variant={"main_green_button"}
                loading={isSubmitting}
              >
                <Save className="mr-2" size={16} />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full mt-10 bg-white">
          <div className="space-y-6 w-full">
            <div className="w-full h-[118px] flex justify-start items-start relative">
              <div className="w-full h-fit flex justify-start items-start flex-col gap-[8px]">
                <div className="absolute left-[50%] top-[calc(100%-50px)] lg:top-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <AvatarUpload
                    currentAvatar={formData.image}
                    onAvatarUpload={handleAvatarUpload}
                    size={70}
                    opportunity={true}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 w-full gap-5">
              <div className="col-span-3 md:col-span-1 space-y-2">
                <Label className="label-style" htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="input-style"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Software Dev Internship"
                />
              </div>
              <div className="col-span-3 md:col-span-1 space-y-2">
                <Label className="label-style" htmlFor="institute">
                  Organization <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="input-style"
                  id="institute"
                  value={formData.institute}
                  onChange={(e) =>
                    setFormData({ ...formData, institute: e.target.value })
                  }
                  placeholder="e.g., Google, MIT, etc."
                />
              </div>
              <div className="col-span-3 md:col-span-1 space-y-2">
                <Label className="label-style" htmlFor="category">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="input-style w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="Internships">Internships</SelectItem>
                    <SelectItem value="Summer Program">
                      Summer Program
                    </SelectItem>
                    <SelectItem value="Clubs">Clubs</SelectItem>
                    <SelectItem value="Community Service">
                      Community Service
                    </SelectItem>
                    <SelectItem value="Competitions">Competitions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3 md:col-span-1 space-y-2">
                <Label className="label-style" htmlFor="difficulty">
                  Difficulty
                </Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, difficulty: value })
                  }
                >
                  <SelectTrigger className="input-style w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 md:col-span-1 space-y-2">
                <Label className="label-style" htmlFor="type">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="input-style w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 md:col-span-1 space-y-2">
                <Label className="label-style" htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="input-style"
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., New York, Remote"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="label-style" htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the opportunity"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="col-span-3 md:col-span-1 space-y-2">
                <Label className="label-style" htmlFor="price">
                  Price
                </Label>
                <Input
                  className="input-style"
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="col-span-3 md:col-span-1 space-y-2 relative">
                <Label className="label-style" htmlFor="dueDate">
                  Due Date
                </Label>
                <Input
                  className="input-style pr-10 [appearance:textfield] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  id="dueDate"
                  type="date"
                  value={
                    formData.dueDate instanceof Date
                      ? formData.dueDate.toISOString().split("T")[0]
                      : new Date(formData.dueDate).toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dueDate: new Date(e.target.value),
                    })
                  }
                />
              </div>
              <div className="col-span-3 md:col-span-1 space-y-2">
                <Label className="label-style" htmlFor="link">
                  Link <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="input-style"
                  placeholder="https://example.com"
                  id="link"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                />
              </div>
              <div className="flex col-span-3 md:hidden justify-end items-center gap-4 mt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !formData.title ||
                    !formData.institute ||
                    !formData.location ||
                    !formData.link
                  }
                  variant={"green_secondary_button"}
                  loading={isSubmitting}
                >
                  <Save className="mr-2" size={16} />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
