"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
// Removed Dialog imports since we won't be using a modal/dialog
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
import { ChevronLeft, Pencil, Plus, Save, Trash, X } from "lucide-react";
import { OpportunitiesCardType } from "@/lib/types/opportunities";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import Link from "next/link";
import Swal from "sweetalert2";
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
  const [formData, setFormData] =
    useState<OpportunitiesCardType>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [majorInput, setMajorInput] = useState("");
  const router = useRouter();

  // useEffect to ensure formData.dueDate is correctly initialized as a Date object if needed,
  // but initialFormState already handles this. It's often good practice to ensure
  // date formatting is correct for the input.

  // Handlers for majors (optional - keep or remove as needed)
  const handleAddMajor = () => {
    if (majorInput.trim() && !formData.majors.includes(majorInput.trim())) {
      setFormData({
        ...formData,
        majors: [...formData.majors, majorInput.trim()],
      });
      setMajorInput("");
    }
  };

  const handleRemoveMajor = (major: string) => {
    setFormData({
      ...formData,
      majors: formData.majors.filter((m) => m !== major),
    });
  };

  // The main submit function, updated to send a single opportunity object
  const handleSubmit = async () => {
    // Basic validation
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

    // Prepare payload (API might expect singular 'opportunity' or an array of one)
    // We'll send the single object, or an array containing it, based on typical API design.
    // Assuming the backend expects an array of opportunities (as implied by the original `handleSubmitAll` sending `opportunities`).
    // If the API only supports adding one, you might need to change `body: JSON.stringify({ opportunities: [formData] })` to `body: JSON.stringify(formData)`.
    const payload = {
      opportunities: [
        {
          ...formData,
          // Ensure dueDate is a string format acceptable by API (e.g., ISO string)
          dueDate: formData.dueDate.toISOString(),
        },
      ],
    };
    try {
      setIsSubmitting(true);
      // Replace with your actual API endpoint
      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Sending the single opportunity object in an array for compatibility with the original API structure
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Handle success
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Opportunity added successfully",
          showConfirmButton: true,
          confirmButtonText: "View All Opportunities",
        }).then(() => {
          router.push("/admin/opportunities");
        });
        // Reset form after successful submission
        setFormData(initialFormState);
      } else {
        // Handle API error
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
                  Add Opportunity
                </h1>
              </div>
            </div>
            {/* The primary Save Changes button, now calling handleSubmit */}
            <div className="hidden md:flex justify-end items-center gap-4">
              <Button
                onClick={handleSubmit}
                // Check if required fields are filled to enable the button
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

        {/* Removed the section displaying the list of multiple opportunities and the "Add Opportunity" button */}
        {/* The form content from the old Dialog is now directly on the page */}

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

            {/* Majors input section - uncomment if you want to keep this functionality */}
            {/* <div className="space-y-2">
              <Label className="label-style" htmlFor="majors">
                Majors
              </Label>
              <div className="flex gap-2">
                <Input
                  className="input-style"
                  id="majors"
                  value={majorInput}
                  onChange={(e) => setMajorInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddMajor())
                  }
                  placeholder="Add major and press Enter"
                />
                <Button
                  type="button"
                  onClick={handleAddMajor}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.majors.map((major) => (
                  <span
                    key={major}
                    className="bg-[#B32053] text-[white] px-3 py-1 rounded-xl text-sm flex items-center gap-2"
                  >
                    {major}
                    <button
                      onClick={() => handleRemoveMajor(major)}
                      className="p-0"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div> */}

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
                  // Format Date object to YYYY-MM-DD string for input value
                  value={
                    formData.dueDate instanceof Date
                      ? formData.dueDate.toISOString().split("T")[0]
                      : new Date(formData.dueDate).toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      // Ensure value is converted back to a Date object
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
                  // Check if required fields are filled to enable the button
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
      {/* Removed the Dialog component entirely */}
    </AdminLayout>
  );
}
