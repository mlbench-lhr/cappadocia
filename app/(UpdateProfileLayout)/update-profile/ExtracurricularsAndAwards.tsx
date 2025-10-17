"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import pencil from "@/public/pencil.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  updateProfileStepBack,
  updateProfileStepNext,
} from "@/lib/store/slices/generalSlice";
import { updateUser } from "@/lib/store/slices/authSlice";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User } from "@/lib/types/auth";
import { Plus, Trash2, Edit, ChevronDown } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import axios from "axios";

const awardSchema = z.object({
  awardName: z.string().min(1, "Award name is required"),
  gradeLevel: z.array(z.string()).min(1, "At least one grade is required"),
  recognitionLevel: z.string().min(1, "Recognition level is required"),
  description: z.string().optional(),
});

const extracurricularSchema = z.object({
  activityType: z.string().min(1, "Activity type is required"),
  activityTitle: z.string().min(1, "Role/Title is required"),
  organization: z.string().min(1, "Organization is required"),
  description: z.string().optional(),
  grade: z.array(z.string()).min(1, "At least one grade is required"),
  timing: z.string().min(1, "Timing is required"),
  hourPerWeek: z.number().min(0, "Hours per week must be positive"),
  weekPerYear: z.number().min(0, "Weeks per year must be positive"),
});

const schema = z.object({
  awards: z.array(awardSchema).default([]),
  extracurricularActivity: z.array(extracurricularSchema).default([]),
});

type FormData = z.infer<typeof schema>;
type AwardData = z.infer<typeof awardSchema>;
type ExtracurricularData = z.infer<typeof extracurricularSchema>;

export default function ExtracurricularsAndAwards() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((s) => s.auth.user) as
    | (User & {
        extracurricularsAndAwards?: Partial<FormData>;
      })
    | null;
  const updateProfileStep = useAppSelector((s) => s.general.updateProfileStep);
  const [gradeLevel, setGradeLevel] = useState<string[]>(["Loading...."]);
  const [rlOptions, setRlOptions] = useState<string[]>(["Loading...."]);
  const [aTOptions, setATOptions] = useState<string[]>(["Loading...."]);

  useEffect(() => {
    async function getFields() {
      try {
        const allData = await axios.get("/api/surveyFields");
        setGradeLevel(allData?.data?.fields?.gradeLevel);
        setRlOptions(allData?.data?.fields?.recognitionLevel);
        setATOptions(allData?.data?.fields?.activityType);
      } catch (error) {
        console.log("error----", error);
      } finally {
      }
    }
    getFields();
  }, []);

  // Modal states
  const [awardModalOpen, setAwardModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingAwardIndex, setEditingAwardIndex] = useState<number | null>(
    null
  );
  const [editingActivityIndex, setEditingActivityIndex] = useState<
    number | null
  >(null);

  // Collapse states
  const [openAwards, setOpenAwards] = useState<Set<number>>(new Set());
  const [openActivities, setOpenActivities] = useState<Set<number>>(new Set());

  // Modal form states
  const [currentAward, setCurrentAward] = useState<AwardData>({
    awardName: "",
    gradeLevel: [],
    recognitionLevel: "",
    description: "",
  });

  const [currentActivity, setCurrentActivity] = useState<ExtracurricularData>({
    activityType: "",
    activityTitle: "",
    organization: "",
    description: "",
    grade: [],
    timing: "",
    hourPerWeek: 0,
    weekPerYear: 0,
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      awards: userData?.extracurricularsAndAwards?.awards || [],
      extracurricularActivity:
        userData?.extracurricularsAndAwards?.extracurricularActivity || [],
    },
    mode: "onSubmit",
  });

  const {
    fields: awardFields,
    append: appendAward,
    remove: removeAward,
    update: updateAward,
  } = useFieldArray({
    control,
    name: "awards",
  });

  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
    update: updateActivity,
  } = useFieldArray({
    control,
    name: "extracurricularActivity",
  });

  // Keep RHF in sync with Redux userData
  useEffect(() => {
    reset({
      awards: userData?.extracurricularsAndAwards?.awards || [],
      extracurricularActivity:
        userData?.extracurricularsAndAwards?.extracurricularActivity || [],
    });
  }, [userData, reset]);

  const handleFieldChange = <K extends keyof FormData>(
    field: K,
    value: any
  ) => {
    setValue(field, value);

    const currentData =
      (userData?.extracurricularsAndAwards as Partial<FormData>) || {};
    const updatedData: Partial<FormData> = {
      ...currentData,
      [field as string]: value as any,
    };

    const payload: Partial<User & { extracurricularsAndAwards?: FormData }> = {
      ...(userData || {}),
      extracurricularsAndAwards: {
        ...(userData?.extracurricularsAndAwards || {}),
        ...(updatedData as FormData),
      },
    };

    dispatch(updateUser(payload));
  };

  // Award Modal Functions
  const openAwardModal = (index?: number) => {
    if (index !== undefined) {
      setEditingAwardIndex(index);
      const award = awardFields[index];
      setCurrentAward({
        awardName: award.awardName,
        gradeLevel: award.gradeLevel,
        recognitionLevel: award.recognitionLevel,
        description: award.description || "",
      });
    } else {
      setEditingAwardIndex(null);
      setCurrentAward({
        awardName: "",
        gradeLevel: [],
        recognitionLevel: "",
        description: "",
      });
    }
    setAwardModalOpen(true);
  };

  const closeAwardModal = () => {
    setAwardModalOpen(false);
    setEditingAwardIndex(null);
    setCurrentAward({
      awardName: "",
      gradeLevel: [],
      recognitionLevel: "",
      description: "",
    });
  };

  const handleAddAward = () => {
    if (editingAwardIndex !== null) {
      updateAward(editingAwardIndex, currentAward);
    } else {
      appendAward(currentAward);
    }
    const awards =
      editingAwardIndex !== null
        ? awardFields.map((award, idx) =>
            idx === editingAwardIndex ? currentAward : award
          )
        : [...awardFields, currentAward];
    handleFieldChange("awards", awards);
    closeAwardModal();
  };

  // Activity Modal Functions
  const openActivityModal = (index?: number) => {
    if (index !== undefined) {
      setEditingActivityIndex(index);
      const activity = activityFields[index];
      setCurrentActivity({
        activityType: activity.activityType,
        activityTitle: activity.activityTitle,
        organization: activity.organization,
        description: activity.description || "",
        grade: activity.grade,
        timing: activity.timing,
        hourPerWeek: activity.hourPerWeek,
        weekPerYear: activity.weekPerYear,
      });
    } else {
      setEditingActivityIndex(null);
      setCurrentActivity({
        activityType: "",
        activityTitle: "",
        organization: "",
        description: "",
        grade: [],
        timing: "",
        hourPerWeek: 0,
        weekPerYear: 0,
      });
    }
    setActivityModalOpen(true);
  };

  const closeActivityModal = () => {
    setActivityModalOpen(false);
    setEditingActivityIndex(null);
    setCurrentActivity({
      activityType: "",
      activityTitle: "",
      organization: "",
      description: "",
      grade: [],
      timing: "",
      hourPerWeek: 0,
      weekPerYear: 0,
    });
  };

  const handleAddActivity = () => {
    if (editingActivityIndex !== null) {
      updateActivity(editingActivityIndex, currentActivity);
    } else {
      appendActivity(currentActivity);
    }
    const activities =
      editingActivityIndex !== null
        ? activityFields.map((activity, idx) =>
            idx === editingActivityIndex ? currentActivity : activity
          )
        : [...activityFields, currentActivity];
    handleFieldChange("extracurricularActivity", activities);
    closeActivityModal();
  };

  // Toggle functions for collapsibles
  const toggleAward = (index: number) => {
    const newOpenAwards = new Set(openAwards);
    if (newOpenAwards.has(index)) {
      newOpenAwards.delete(index);
    } else {
      newOpenAwards.add(index);
    }
    setOpenAwards(newOpenAwards);
  };

  const toggleActivity = (index: number) => {
    const newOpenActivities = new Set(openActivities);
    if (newOpenActivities.has(index)) {
      newOpenActivities.delete(index);
    } else {
      newOpenActivities.add(index);
    }
    setOpenActivities(newOpenActivities);
  };

  const handleDeleteAward = (index: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5AD2A6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeAward(index);
        const awards = awardFields.filter((_, idx) => idx !== index);
        handleFieldChange("awards", awards);

        const newOpenAwards = new Set<number>();
        openAwards.forEach((openIndex) => {
          if (openIndex < index) newOpenAwards.add(openIndex);
          else if (openIndex > index) newOpenAwards.add(openIndex - 1);
        });
        setOpenAwards(newOpenAwards);
      }
    });
  };

  const handleDeleteActivity = (index: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This activity will be removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5AD2A6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeActivity(index);
        const activities = activityFields.filter((_, idx) => idx !== index);
        handleFieldChange("extracurricularActivity", activities);

        const newOpenActivities = new Set<number>();
        openActivities.forEach((openIndex) => {
          if (openIndex < index) newOpenActivities.add(openIndex);
          else if (openIndex > index) newOpenActivities.add(openIndex - 1);
        });
        setOpenActivities(newOpenActivities);
      }
    });
  };

  const onSubmit = async (data: FormData) => {
    console.log("data------------", data);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userData?.id,
          extracurricularsAndAwards: data,
          profileUpdated: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      const responseData = await res.json();
      console.log("API response:", responseData);

      dispatch(
        updateUser({
          ...userData,
          extracurricularsAndAwards:
            responseData?.user?.extracurricularsAndAwards,
        })
      );
      dispatch(updateProfileStepNext());
    } catch (err) {
      console.error("submit error", err);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[24px] w-full bg-white"
      >
        {/* Awards Section */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-4 gap-y-3">
            <div className="flex justify-center items-start gap-[8px] flex-col ">
              <h2 className="heading-text-style-2 flex justify-start items-center gap-2">
                <span className="hidden sm:block">Add </span>
                Extracurricular Award
              </h2>
            </div>
            <Button
              type="button"
              variant="green_secondary_button"
              size="sm"
              onClick={() => openAwardModal()}
            >
              <Plus className="w-4 h-4 mr-0 md:mr-2" />
              Add
              <span className="hidden sm:block"> Award</span>
            </Button>
          </div>

          {awardFields.length > 0 && (
            <div className="w-full flex flex-col justify-start items-start gap-[17px] border p-[8px] md:p-[12px] rounded-[12px]">
              {/* Awards List */}
              {awardFields.map((field, index) => (
                <Collapsible
                  key={field.id}
                  open={openAwards.has(index)}
                  onOpenChange={() => toggleAward(index)}
                  className="w-full"
                >
                  <div
                    className={`w-full rounded-[8px] p-[8px] ${
                      openAwards.has(index) ? "bg-white" : "bg-[#F5FBF5]"
                    }`}
                  >
                    <CollapsibleTrigger className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openAwards.has(index) ? "rotate-180" : ""
                          }`}
                        />
                        <span className="font-[500] text-[20px] text-start w-[200px] sm:w-[400px] md:w-[580px] truncate">
                          {field.awardName || "Unnamed Award"}
                        </span>
                      </div>
                      <div className="flex gap-2 md:gap-[28px]">
                        <Image
                          src={pencil.src}
                          alt=""
                          width={16}
                          height={16}
                          onClick={() => openAwardModal(index)}
                        />
                        <Trash2
                          className="w-4 h-4"
                          color="red"
                          onClick={() => handleDeleteAward(index)}
                        />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 ps-[24px]">
                      <div className="grid grid-cols-2 gap-[8px]">
                        <p className="w-full md:w-[80%] col-span-2 font-[400] text-[16px]">
                          {field.description}
                        </p>
                        <div className="col-span-2 flex justify-start items-center gap-3">
                          {field.gradeLevel.map((item) => (
                            <div
                              key={item}
                              className="font-[500] text-[14px] p-[8px] bg-[#5AD2A6] w-fit rounded-[8px]"
                            >
                              Grade {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </div>

        {/* Extracurricular Activities Section */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-4 gap-y-3">
            <div className="flex justify-center items-start gap-[8px] flex-col ">
              <h2 className="heading-text-style-2 flex justify-start items-center gap-2">
                <span className="hidden sm:block">Add </span>
                Extracurricular Activities
              </h2>
            </div>
            <Button
              type="button"
              variant="green_secondary_button"
              size="sm"
              onClick={() => openActivityModal()}
            >
              <Plus className="w-4 h-4 mr-0 md:mr-2" />
              Add
              <span className="hidden sm:block"> Activity</span>
            </Button>
          </div>
          {activityFields.length > 0 && (
            <div className="w-full flex flex-col justify-start items-start gap-[17px] border p-[8px] md:p-[12px] rounded-[12px]">
              {/* Activities List */}
              {activityFields.map((field, index) => (
                <Collapsible
                  key={field.id}
                  open={openActivities.has(index)}
                  onOpenChange={() => toggleActivity(index)}
                  className="w-full"
                >
                  <div
                    className={`w-full rounded-[8px] p-[8px] ${
                      openActivities.has(index) ? "bg-white" : "bg-[#F5FBF5]"
                    }`}
                  >
                    <CollapsibleTrigger className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openActivities.has(index) ? "rotate-180" : ""
                          }`}
                        />
                        <span className="font-[500] text-[20px] text-start w-[200px] sm:w-[400px] md:w-[580px] truncate">
                          {field.activityType || "Unnamed Award"}
                        </span>
                      </div>
                      <div className="flex gap-2 md:gap-[28px]">
                        <Image
                          src={pencil.src}
                          alt=""
                          width={16}
                          height={16}
                          onClick={() => openActivityModal(index)}
                        />
                        <Trash2
                          className="w-4 h-4"
                          color="red"
                          onClick={() => handleDeleteActivity(index)}
                        />
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-4 ps-[24px]">
                      <div className="grid grid-cols-2 gap-[8px]">
                        <p className="w-full md:w-[80%] col-span-2 font-[400] text-[16px]">
                          {field.description}
                        </p>
                        <div className="col-span-2 flex justify-start items-center gap-3">
                          {field.grade.map((item) => (
                            <div
                              key={item}
                              className="font-[500] text-[14px] p-[8px] bg-[#5AD2A6] w-fit rounded-[8px]"
                            >
                              Grade {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-end gap-2">
          {updateProfileStep !== 0 && (
            <Button
              type="button"
              variant="green_secondary_button"
              size="lg"
              onClick={() => dispatch(updateProfileStepBack())}
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="main_green_button"
            size="lg"
            loading={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </form>

      {/* Award Modal */}
      <Dialog open={awardModalOpen} onOpenChange={setAwardModalOpen}>
        <DialogContent className="max-w-[98vw] md:max-w-[980px] p-[14px] md:p-[20px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Extracurricular Awards</DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col justify-start items-start gap-[24px] box-shadows-1">
            <div className="w-full flex justify-center items-start gap-[8px] flex-col ">
              <h2 className="heading-text-style-2">
                {editingAwardIndex !== null ? "Edit Award" : "Add Award"}
              </h2>
              <h2 className="plan-text-style-3" style={{ textAlign: "start" }}>
                Highlight your achievements by adding an award to your profile.{" "}
              </h2>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-[10px]">
                <Label className="label-style">
                  Award Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="input-style"
                  placeholder="Enter Award Name"
                  value={currentAward.awardName}
                  onChange={(e) =>
                    setCurrentAward({
                      ...currentAward,
                      awardName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-[10px]">
                <div className="space-y-1">
                  <Label className="label-style">
                    Grades <span className="text-red-500">*</span>
                  </Label>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {gradeLevel
                    .filter((item) => item !== "Loading....")
                    .map((gradeOption) => {
                      const isSelected =
                        currentAward.gradeLevel.includes(gradeOption);
                      return (
                        <div
                          key={gradeOption}
                          onClick={() => {
                            const newGrades = isSelected
                              ? currentAward.gradeLevel.filter(
                                  (g) => g !== gradeOption
                                )
                              : [...currentAward.gradeLevel, gradeOption];
                            setCurrentAward({
                              ...currentAward,
                              gradeLevel: newGrades,
                            });
                          }}
                          className={`cursor-pointer px-[12px] py-[8px] rounded-[8px] transition-colors label-style ${
                            isSelected
                              ? "bg-[#5AD2A6] text-white"
                              : "bg-[#F5FBF5] text-black"
                          }`}
                        >
                          Grade {gradeOption}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex flex-col gap-[10px] md:col-span-2">
                <Label className="label-style">
                  Recognition Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={currentAward.recognitionLevel}
                  onValueChange={(v) =>
                    setCurrentAward({ ...currentAward, recognitionLevel: v })
                  }
                >
                  <SelectTrigger className="input-style">
                    <SelectValue placeholder="Select Recognition Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {rlOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}{" "}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-[10px] md:col-span-2">
                <Label className="label-style">Description</Label>
                <Label className="label-style" style={{ fontWeight: 400 }}>
                  Add short explanation of the award (150 characters max)
                </Label>
                <Textarea
                  maxLength={150}
                  className="input-style"
                  placeholder="Describe the award"
                  value={currentAward.description}
                  onChange={(e) =>
                    setCurrentAward({
                      ...currentAward,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="green_secondary_button"
              onClick={closeAwardModal}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size={"sm"}
              variant="main_green_button"
              onClick={handleAddAward}
              disabled={
                !currentAward.awardName ||
                currentAward.gradeLevel.length === 0 ||
                !currentAward.recognitionLevel
              }
            >
              {editingAwardIndex !== null ? "Update Award" : "Add Award"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Modal */}
      <Dialog open={activityModalOpen} onOpenChange={setActivityModalOpen}>
        <DialogContent className="max-w-[98vw] md:max-w-[980px] p-[14px] md:p-[20px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Extracurricular Activity</DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col justify-start items-start gap-[24px] box-shadows-1">
            <div className="w-full flex justify-center items-start gap-[8px] flex-col ">
              <h2 className="heading-text-style-2">
                {editingAwardIndex !== null ? "Edit Activity" : "Add Activity"}
              </h2>
              <h2 className="plan-text-style-3" style={{ textAlign: "start" }}>
                Highlight your achievements by adding an activity to your
                profile.{" "}
              </h2>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-[10px]">
                <Label className="label-style">
                  Activity Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={currentActivity.activityType}
                  onValueChange={(val) =>
                    setCurrentActivity({
                      ...currentActivity,
                      activityType: val,
                    })
                  }
                >
                  <SelectTrigger className="input-style">
                    <SelectValue placeholder="Select Activity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {aTOptions.map((item) => (
                      <SelectItem value={item} key={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-[10px]">
                <Label className="label-style">
                  Role/Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="input-style"
                  placeholder="Enter Role/Title"
                  value={currentActivity.activityTitle}
                  onChange={(e) =>
                    setCurrentActivity({
                      ...currentActivity,
                      activityTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-[10px] md:col-span-2">
                <Label className="label-style">
                  Organization <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="input-style"
                  placeholder="Enter Organization"
                  value={currentActivity.organization}
                  onChange={(e) =>
                    setCurrentActivity({
                      ...currentActivity,
                      organization: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-[10px] md:col-span-2">
                <Label className="label-style">Description</Label>
                <Label className="label-style" style={{ fontWeight: 400 }}>
                  Summarize leadership or achievement(s) (150 characters max)
                </Label>
                <Textarea
                  maxLength={150}
                  className="input-style"
                  placeholder="Describe the activity"
                  value={currentActivity.description}
                  onChange={(e) =>
                    setCurrentActivity({
                      ...currentActivity,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <div className="space-y-1">
                  <Label className="label-style">
                    Grades <span className="text-red-500">*</span>
                  </Label>
                  <h2
                    className="plan-text-style-3"
                    style={{ textAlign: "start" }}
                  >
                    Participation grade levels.
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {gradeLevel?.map((gradeOption) => {
                    const isSelected =
                      currentActivity.grade.includes(gradeOption);
                    return (
                      <div
                        key={gradeOption}
                        onClick={() => {
                          const newGrades = isSelected
                            ? currentActivity.grade.filter(
                                (g) => g !== gradeOption
                              )
                            : [...currentActivity.grade, gradeOption];
                          setCurrentActivity({
                            ...currentActivity,
                            grade: newGrades,
                          });
                        }}
                        className={`cursor-pointer px-[12px] py-[8px] rounded-[8px] transition-colors label-style ${
                          isSelected
                            ? "bg-[#5AD2A6] text-white"
                            : "bg-[#F5FBF5] text-black"
                        }`}
                      >
                        Grade {gradeOption}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-[10px]">
                <div className="space-y-1">
                  <Label className="label-style">
                    Timing <span className="text-red-500">*</span>
                  </Label>
                  <h2
                    className="plan-text-style-3"
                    style={{ textAlign: "start" }}
                  >
                    Choose Period during which you were active most of the time.
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["School Year", "School Break", "Year Round"].map(
                    (period) => {
                      const selected = currentActivity.timing === period;
                      return (
                        <div
                          key={period}
                          onClick={() =>
                            setCurrentActivity({
                              ...currentActivity,
                              timing: period,
                            })
                          }
                          className={`cursor-pointer px-[12px] py-[8px] rounded-[8px] transition-colors label-style ${
                            selected
                              ? "bg-[#5AD2A6] text-white"
                              : "bg-[#F5FBF5] text-black"
                          }`}
                        >
                          {period}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-[10px]">
                <Label className="label-style">
                  Hours per Week <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  className="input-style"
                  placeholder="Enter Hours per Week"
                  value={currentActivity.hourPerWeek || ""}
                  onChange={(e) =>
                    setCurrentActivity({
                      ...currentActivity,
                      hourPerWeek: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-[10px]">
                <Label className="label-style">
                  Weeks per Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  className="input-style"
                  placeholder="Enter Weeks per Year"
                  value={currentActivity.weekPerYear || ""}
                  onChange={(e) =>
                    setCurrentActivity({
                      ...currentActivity,
                      weekPerYear: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="green_secondary_button"
              onClick={closeActivityModal}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="main_green_button"
              onClick={handleAddActivity}
              disabled={
                !currentActivity.activityType ||
                !currentActivity.activityTitle ||
                !currentActivity.organization ||
                currentActivity.grade.length === 0 ||
                !currentActivity.timing ||
                currentActivity.hourPerWeek <= 0 ||
                currentActivity.weekPerYear <= 0
              }
            >
              {editingActivityIndex !== null
                ? "Update Activity"
                : "Add Activity"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
