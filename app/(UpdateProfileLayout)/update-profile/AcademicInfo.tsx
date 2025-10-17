"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import {
  updateProfileStepBack,
  updateProfileStepNext,
} from "@/lib/store/slices/generalSlice";
import { updateUser } from "@/lib/store/slices/authSlice";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User } from "@/lib/types/auth";
import {
  Download,
  File,
  ImageIcon,
  Plus,
  Trash,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";

const manualCourseSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  grade: z.string().min(1, "Grade is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
});

const schema = z
  .object({
    gradeLevel: z.string().min(1, "Grade level is required"),
    school: z.string().min(1, "School is required"),
    gpaType: z.enum(["Unweighted GPA", "Weighted GPA"]),
    gpa: z.string().min(1, "GPA is required"),
    testScores: z.enum(["SAT", "ACT", "PSAT", "PACT", "N/A"]),
    english: z.string().optional(),
    maths: z.string().optional(),
    reading: z.string().optional(),
    science: z.string().optional(),
    transcript: z.array(z.string()).default([]),
    manualCourse: z.array(manualCourseSchema).default([]),
  })
  .refine(
    (data) => {
      if (data.testScores === "N/A") return true;

      if (data.testScores === "ACT") {
        return !!(data.english && data.maths && data.reading);
      }

      return !!(data.reading && data.maths);
    },
    {
      message: "Required test scores are missing",
      path: ["testScores"],
    }
  );

type FormData = z.infer<typeof schema>;

export default function AcademicInfo() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((s) => s.auth.user) as
    | (User & {
        academicInfo?: Partial<FormData>;
      })
    | null;
  const updateProfileStep = useAppSelector((s) => s.general.updateProfileStep);
  const [gradeLevel, setGradeLevel] = useState<string[]>(["Loading...."]);
  useEffect(() => {
    async function getFields() {
      try {
        const allData = await axios.get("/api/surveyFields");
        setGradeLevel(allData?.data?.fields?.gradeLevel);
      } catch (error) {
        console.log("error----", error);
      } finally {
      }
    }
    getFields();
  }, []);

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
      gradeLevel: userData?.academicInfo?.gradeLevel || "",
      school: userData?.academicInfo?.school || "",
      gpaType: userData?.academicInfo?.gpaType || "Unweighted GPA",
      gpa: userData?.academicInfo?.gpa || "",
      testScores: userData?.academicInfo?.testScores || "N/A",
      english: userData?.academicInfo?.english || "",
      maths: userData?.academicInfo?.maths || "",
      reading: userData?.academicInfo?.reading || "",
      science: userData?.academicInfo?.science || "",
      transcript: userData?.academicInfo?.transcript || [],
      manualCourse: userData?.academicInfo?.manualCourse || [],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "manualCourse",
  });

  const testScoresValue = watch("testScores");
  const gpaTypeValue = watch("gpaType");

  // Keep RHF in sync with Redux userData
  useEffect(() => {
    reset({
      gradeLevel: userData?.academicInfo?.gradeLevel || "",
      school: userData?.academicInfo?.school || "",
      gpaType: userData?.academicInfo?.gpaType || "Unweighted GPA",
      gpa: userData?.academicInfo?.gpa || "",
      testScores: userData?.academicInfo?.testScores || "N/A",
      english: userData?.academicInfo?.english || "",
      maths: userData?.academicInfo?.maths || "",
      reading: userData?.academicInfo?.reading || "",
      science: userData?.academicInfo?.science || "",
      transcript: userData?.academicInfo?.transcript || [],
      manualCourse: userData?.academicInfo?.manualCourse || [],
    });
  }, [userData, reset]);

  const handleFieldChange = <K extends keyof FormData>(
    field: K,
    value: any
  ) => {
    setValue(field, value);

    const currentAcademic = (userData?.academicInfo as Partial<FormData>) || {};

    // Create updated academic info with all current values
    const updatedAcademic: Partial<FormData> = {
      ...currentAcademic,
      [field as string]: value as any,
    };

    // If test scores type changes, handle conditional fields
    if (field === "testScores") {
      if (value === "N/A") {
        // Clear all score fields when N/A is selected
        updatedAcademic.english = "";
        updatedAcademic.maths = "";
        updatedAcademic.reading = "";
        updatedAcademic.science = "";
        setValue("english", "");
        setValue("maths", "");
        setValue("reading", "");
        setValue("science", "");
      } else if (value !== "ACT") {
        // Clear ACT-specific fields when switching to non-ACT tests
        updatedAcademic.english = "";
        updatedAcademic.science = "";
        setValue("english", "");
        setValue("science", "");
      }
    }

    const payload: Partial<User & { academicInfo?: FormData }> = {
      ...(userData || {}),
      academicInfo: {
        ...(userData?.academicInfo || {}),
        ...(updatedAcademic as FormData),
      },
    };

    dispatch(updateUser(payload));
  };

  const handleScoreFieldChange = <K extends keyof FormData>(
    field: K,
    value: any
  ) => {
    setValue(field, value);

    const currentAcademic = (userData?.academicInfo as Partial<FormData>) || {};
    const updatedAcademic: Partial<FormData> = {
      ...currentAcademic,
      [field as string]: value as any,
    };

    const payload: Partial<User & { academicInfo?: FormData }> = {
      ...(userData || {}),
      academicInfo: {
        ...(userData?.academicInfo || {}),
        ...(updatedAcademic as FormData),
      },
    };

    dispatch(updateUser(payload));
  };

  const handleGPAChange = (value: string) => {
    // Allow only numbers, decimal point, and slash for weighted GPA format
    const formattedValue = value.replace(/[^0-9./]/g, "");

    // For unweighted GPA, cap at 4.0
    if (gpaTypeValue === "Unweighted GPA") {
      const numValue = parseFloat(formattedValue);
      if (!isNaN(numValue) && numValue > 4.0) {
        setValue("gpa", "4.0");
        handleFieldChange("gpa", "4.0");
        return;
      }
    }

    setValue("gpa", formattedValue);
    handleFieldChange("gpa", formattedValue);
  };

  const handleTestScoreChange = (
    field: keyof FormData,
    value: string,
    maxScore: number
  ) => {
    // Allow only numbers and slash
    const formattedValue = value.replace(/[^0-9/]/g, "");

    // Check if value contains a slash (for weighted GPA format)
    if (formattedValue.includes("/")) {
      const [score, max] = formattedValue.split("/");
      const numScore = parseInt(score);
      if (!isNaN(numScore) && numScore > maxScore) {
        const cappedValue = `${maxScore}/${max}`;
        setValue(field, cappedValue);
        handleScoreFieldChange(field, cappedValue);
        return;
      }
    } else {
      const numValue = parseInt(formattedValue);
      if (!isNaN(numValue) && numValue > maxScore) {
        setValue(field, maxScore.toString());
        handleScoreFieldChange(field, maxScore.toString());
        return;
      }
    }

    setValue(field, formattedValue);
    handleScoreFieldChange(field, formattedValue);
  };

  const handleTranscriptUpload = (urls: string[]) => {
    const currentTranscripts = userData?.academicInfo?.transcript || [];
    const updatedTranscripts = [...currentTranscripts, ...urls];
    handleFieldChange("transcript", updatedTranscripts);
  };

  const handleTranscriptRemove = (urlToRemove: string) => {
    const currentTranscripts = userData?.academicInfo?.transcript || [];
    const updatedTranscripts = currentTranscripts.filter(
      (url) => url !== urlToRemove
    );
    handleFieldChange("transcript", updatedTranscripts);
  };
  const handleFileDownload = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop() || "download"; // fallback name
      document.body.appendChild(link);
      link.click();

      // cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Prepare the data to send, ensuring only relevant fields are included
      const academicInfoToSend: Partial<FormData> = {
        gradeLevel: data.gradeLevel,
        school: data.school,
        gpaType: data.gpaType,
        gpa: data.gpa,
        testScores: data.testScores,
        transcript: data.transcript,
        manualCourse: data.manualCourse,
      };

      // Only include score fields if testScores is not N/A
      if (data.testScores !== "N/A") {
        academicInfoToSend.maths = data.maths;
        academicInfoToSend.reading = data.reading;

        // Only include ACT-specific fields if test is ACT
        if (data.testScores === "ACT") {
          academicInfoToSend.english = data.english;
          academicInfoToSend.science = data.science;
        }
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userData?.id,
          academicInfo: academicInfoToSend,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      const responseData = await res.json();
      console.log("API response:", responseData);
      dispatch(
        updateUser({
          ...userData,
          academicInfo: responseData?.user?.academicInfo,
        })
      );
      dispatch(updateProfileStepNext());
    } catch (err) {
      console.error("submit error", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[24px] w-full bg-white"
    >
      <h4 className="heading-text-style-4" style={{ textAlign: "start" }}>
        Academic Info
      </h4>

      <div className="w-full box-shadows-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Grade Level */}

          <div className="flex flex-col gap-[10px]">
            <Label className="label-style">
              Grade Level <span className="text-red-500">*</span>
            </Label>
            <Select
              value={userData?.academicInfo?.gradeLevel || ""}
              onValueChange={(v) => handleFieldChange("gradeLevel", v)}
            >
              <SelectTrigger className="input-style">
                <SelectValue placeholder="Add Grade Level" />
              </SelectTrigger>
              <SelectContent>
                {gradeLevel.map((item) => (
                  <SelectItem key={item} value={item}>
                    Grade {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gradeLevel && (
              <p className="text-red-500 text-sm">
                {errors.gradeLevel.message}
              </p>
            )}
          </div>

          {/* School */}
          <div className="flex flex-col gap-[10px]">
            <Label htmlFor="school" className="label-style">
              School <span className="text-red-500">*</span>
            </Label>
            <Input
              id="school"
              className="input-style"
              placeholder="Enter School Name"
              value={userData?.academicInfo?.school || ""}
              onChange={(e) => handleFieldChange("school", e.target.value)}
            />
            {errors.school && (
              <p className="text-red-500 text-sm">{errors.school.message}</p>
            )}
          </div>
        </div>
      </div>
      <div className="w-full box-shadows-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* GPA Type */}
          <div className="flex flex-col gap-[24px]">
            <Label className="heading-text-style-2">
              GPA <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={userData?.academicInfo?.gpaType || "Unweighted GPA"}
              onValueChange={(val) =>
                handleFieldChange("gpaType", val as FormData["gpaType"])
              }
              className="flex gap-6 flex-col md:flex-row"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Unweighted GPA" id="unweighted" />
                <Label htmlFor="unweighted">Unweighted GPA</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Weighted GPA" id="weighted" />
                <Label htmlFor="weighted">Weighted GPA</Label>
              </div>
            </RadioGroup>
            {errors.gpaType && (
              <p className="text-red-500 text-sm">{errors.gpaType.message}</p>
            )}
          </div>

          {/* GPA */}
          <div className="flex flex-col gap-[10px]">
            <Label htmlFor="gpa" className="label-style">
              Enter {userData?.academicInfo?.gpaType || "Unweighted GPA"}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="gpa"
              className="input-style"
              placeholder={
                userData?.academicInfo?.gpaType === "Weighted GPA"
                  ? "e.g., 4.3/5.0"
                  : "e.g., 3.8"
              }
              value={userData?.academicInfo?.gpa || ""}
              onChange={(e) => handleGPAChange(e.target.value)}
            />
            {errors.gpa && (
              <p className="text-red-500 text-sm">{errors.gpa.message}</p>
            )}
          </div>
        </div>
      </div>
      <div className="w-full box-shadows-2">
        <div className="grid grid-cols-11 gap-4">
          {/* Test Scores */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-5 flex flex-col gap-[24px]">
            <Label className="heading-text-style-2">
              Test Scores <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={userData?.academicInfo?.testScores || "N/A"}
              onValueChange={(val) =>
                handleFieldChange("testScores", val as FormData["testScores"])
              }
              className="flex gap-3 flex-col md:flex-row"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SAT" id="sat" />
                <Label htmlFor="sat">SAT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ACT" id="act" />
                <Label htmlFor="act">ACT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PSAT" id="psat" />
                <Label htmlFor="psat">PSAT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PACT" id="pact" />
                <Label htmlFor="pact">PACT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="N/A" id="na" />
                <Label htmlFor="na">N/A</Label>
              </div>
            </RadioGroup>
            {errors.testScores && (
              <p className="text-red-500 text-sm">
                {errors.testScores.message}
              </p>
            )}
          </div>
          <div className="col-span-12 sm:col-span-12 lg:col-span-6 gap-[24px] grid grid-cols-12">
            {/* ACT English Score */}
            {testScoresValue === "ACT" && (
              <div className="col-span-12 sm:col-span-6 lg:col-span-6 flex flex-col gap-[10px]">
                <Label htmlFor="english" className="label-style">
                  English Score <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="english"
                  className="input-style"
                  placeholder="Max: 35"
                  value={userData?.academicInfo?.english || ""}
                  onChange={(e) =>
                    handleTestScoreChange("english", e.target.value, 35)
                  }
                />
                {errors.english && (
                  <p className="text-red-500 text-sm">
                    {errors.english.message}
                  </p>
                )}
              </div>
            )}

            {/* Math Score */}
            {testScoresValue !== "N/A" && (
              <div className="col-span-12 sm:col-span-6 lg:col-span-6 flex flex-col gap-[10px]">
                <Label htmlFor="maths" className="label-style">
                  Math Score <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maths"
                  className="input-style"
                  placeholder={
                    testScoresValue === "SAT"
                      ? "Max: 800"
                      : testScoresValue === "PSAT"
                      ? "Max: 760"
                      : testScoresValue === "ACT"
                      ? "Max: 35"
                      : "Max: 35"
                  }
                  value={userData?.academicInfo?.maths || ""}
                  onChange={(e) => {
                    const maxScore =
                      testScoresValue === "SAT"
                        ? 800
                        : testScoresValue === "PSAT"
                        ? 760
                        : testScoresValue === "ACT"
                        ? 35
                        : 35;
                    handleTestScoreChange("maths", e.target.value, maxScore);
                  }}
                />
                {errors.maths && (
                  <p className="text-red-500 text-sm">{errors.maths.message}</p>
                )}
              </div>
            )}

            {/* Reading Score */}
            {testScoresValue !== "N/A" && (
              <div className="col-span-12 sm:col-span-6 lg:col-span-6 flex flex-col gap-[10px]">
                <Label htmlFor="reading" className="label-style">
                  Reading Score <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reading"
                  className="input-style"
                  placeholder={
                    testScoresValue === "SAT"
                      ? "Max: 800"
                      : testScoresValue === "PSAT"
                      ? "Max: 760"
                      : testScoresValue === "ACT"
                      ? "Max: 35"
                      : "Max: 35"
                  }
                  value={userData?.academicInfo?.reading || ""}
                  onChange={(e) => {
                    const maxScore =
                      testScoresValue === "SAT"
                        ? 800
                        : testScoresValue === "PSAT"
                        ? 760
                        : testScoresValue === "ACT"
                        ? 35
                        : 35;
                    handleTestScoreChange("reading", e.target.value, maxScore);
                  }}
                />
                {errors.reading && (
                  <p className="text-red-500 text-sm">
                    {errors.reading.message}
                  </p>
                )}
              </div>
            )}

            {/* ACT Science Score (Optional) */}
            {testScoresValue === "ACT" && (
              <div className="col-span-12 sm:col-span-6 lg:col-span-6 flex flex-col gap-[10px]">
                <Label htmlFor="science" className="label-style">
                  Science Score (Optional)
                </Label>
                <Input
                  id="science"
                  className="input-style"
                  placeholder="Max: 35"
                  value={userData?.academicInfo?.science || ""}
                  onChange={(e) =>
                    handleTestScoreChange("science", e.target.value, 35)
                  }
                />
                {errors.science && (
                  <p className="text-red-500 text-sm">
                    {errors.science.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Courses Section */}
      <div className="w-full box-shadows-2 flex flex-col justify-between items-start gap-[24px]">
        <div className="flex justify-between items-center gap-[24px] w-full flex-col md:flex-row">
          <div className="flex justify-center items-start gap-[8px] flex-col w-full">
            <h2 className="heading-text-style-2">Coursework</h2>
            <h2
              className="w-full md:w-fit plan-text-style-3"
              style={{ textAlign: "start" }}
            >
              Upload or manually input your past and current courses.
            </h2>
          </div>

          <div className="flex justify-end items-center mb-4 gap-4 flex-col md:flex-row w-full md:w-fit">
            <>
              <Dialog>
                {/* <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="green_secondary_button"
                    size="sm"
                    className="w-full md:w-fit"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Transcript{" "}
                  </Button>
                </DialogTrigger> */}

                <DialogContent className="sm:max-w-lg rounded-[16px] flex flex-col justify-start items-center gap-[8px] p-[40px]">
                  <DialogDescription className="mt-2 plan-text-style-3 w-full">
                    <div className="w-full">
                      <div className="flex flex-col gap-4 w-full">
                        <h5
                          className="plan-text-style-4"
                          style={{ textAlign: "start" }}
                        >
                          Upload Transcript
                        </h5>
                        <FileUpload
                          onFileUpload={handleTranscriptUpload}
                          onFileRemove={handleTranscriptRemove}
                          multiple={true}
                        />
                      </div>
                    </div>{" "}
                  </DialogDescription>

                  <div className="mt-6 flex items-center justify-end w-full">
                    <DialogFooter className="w-full">
                      <div className="w-full grid grid-cols-2 gap-[20px]">
                        <DialogClose asChild>
                          <Button
                            variant="secondary_button"
                            className="col-span-1 mr-2"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant={"main_green_button"}
                            className="col-span-1"
                          >
                            Next
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            </>

            <Button
              type="button"
              variant="green_secondary_button"
              size="sm"
              className="w-full md:w-fit"
              onClick={() =>
                append({ courseName: "", grade: "", gradeLevel: "" })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Manually Add Course{" "}
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-col gap-[15px] justify-start items-start">
          {/* <h3 className="heading-text-style-5">Uploaded Transcript</h3> */}
          <div className="grid grid-cols-12 gap-4 mb-[24px] rounded-lg w-full">
            {userData?.academicInfo?.transcript &&
              userData?.academicInfo?.transcript?.length > 0 &&
              userData?.academicInfo?.transcript?.map((file, index) => (
                <div
                  key={index}
                  className="col-span-12 sm:col-span-6 lg:col-span-4 flex bg-[#D8E6DD] rounded-[8px] py-[8px] px-[16px] items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <File className="w-4 h-4" color="#006C4F" />{" "}
                    <span className="text-sm truncate w-[120px]">
                      {file.split("/").pop()}
                    </span>
                  </div>
                  <div className="flex justify-start items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileDownload(file)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>{" "}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTranscriptRemove(file)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {fields.map((field, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 mb-[24px] rounded-lg w-full"
          >
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col gap-[10px]">
              <Label className="label-style">
                Course Name <span className="text-red-500">*</span>
              </Label>
              <Input
                className="input-style"
                placeholder="Enter Course Name"
                value={watch(`manualCourse.${index}.courseName`) || ""}
                onChange={(e) => {
                  setValue(`manualCourse.${index}.courseName`, e.target.value);
                  const courses = watch("manualCourse");
                  handleFieldChange("manualCourse", courses);
                }}
              />
              {errors?.manualCourse?.[index]?.courseName && (
                <p className="text-red-500 text-sm">
                  {errors?.manualCourse?.[index]?.courseName?.message}
                </p>
              )}
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col gap-[10px]">
              <Label className="label-style">
                Grade/Score <span className="text-red-500">*</span>
              </Label>
              <Input
                className="input-style"
                placeholder="Enter Grade"
                value={watch(`manualCourse.${index}.grade`) || ""}
                onChange={(e) => {
                  const formattedValue = e.target.value.replace(/[^0-9/]/g, "");
                  setValue(`manualCourse.${index}.grade`, formattedValue);
                  const courses = watch("manualCourse");
                  handleFieldChange("manualCourse", courses);
                }}
              />
              {errors?.manualCourse?.[index]?.grade && (
                <p className="text-red-500 text-sm">
                  {errors?.manualCourse?.[index]?.grade?.message}
                </p>
              )}
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col gap-[10px]">
              <Label className="label-style">
                Grade Level<span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch(`manualCourse.${index}.gradeLevel`) || ""}
                onValueChange={(val) => {
                  setValue(`manualCourse.${index}.gradeLevel`, val);
                  const courses = watch("manualCourse");
                  handleFieldChange("manualCourse", courses);
                }}
              >
                <SelectTrigger className="input-style">
                  <SelectValue placeholder="Select Grade Level" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevel.map((item) => (
                    <SelectItem key={item} value={item}>
                      Grade {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.manualCourse?.[index]?.gradeLevel && (
                <p className="text-red-500 text-sm">
                  {errors?.manualCourse?.[index]?.gradeLevel?.message}
                </p>
              )}
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-1 flex-col justify-start flex items-end gap-[10px]">
              <Label className="label-style" style={{ color: "transparent" }}>
                *{" "}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => remove(index)}
                className="w-full h-[46px]"
              >
                <Trash2 className="w-full h-[46px]" />
              </Button>
            </div>
          </div>
        ))}
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
  );
}
