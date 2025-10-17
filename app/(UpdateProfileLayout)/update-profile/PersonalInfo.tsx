"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import profileAvatar from "@/public/profile avatar.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import {
  updateProfileStepBack,
  updateProfileStepNext,
} from "@/lib/store/slices/generalSlice";
import { updateUser } from "@/lib/store/slices/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User } from "@/lib/types/auth";
import { State, City, IState, ICity } from "country-state-city";
import axios from "axios";

const schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.string().min(1, "Gender is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().optional(),
  annualIncome: z.string().min(1, "Annual income is required"),
  firstGenerationCollegeStudent: z.boolean(),
  hispanicOrLatino: z.boolean(),
  race: z.string().min(1, "Race is required"),
});

type FormData = z.infer<typeof schema>;

export default function PersonalInfoComponent() {
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const dispatch = useAppDispatch();
  const userData = useAppSelector((s) => s.auth.user) as
    | (User & {
        personalInfo?: Partial<FormData>;
      })
    | null;
  const updateProfileStep = useAppSelector((s) => s.general.updateProfileStep);
  const [avatar, setAvatar] = useState<string>(userData?.avatar || "");

  useEffect(() => {
    const usStates = State.getStatesOfCountry("US");
    setStates(usStates);
  }, []);
  const [raceOptions, setRaceOptions] = useState<string[]>(["Loading...."]);
  const [annualIncomeOptions, setAnnualIncomeOptions] = useState<string[]>([
    "Loading....",
  ]);
  useEffect(() => {
    async function getFields() {
      try {
        const allData = await axios.get("/api/surveyFields");
        setRaceOptions(allData?.data?.fields?.race);
        setAnnualIncomeOptions(allData?.data?.fields?.annualIncome);
      } catch (error) {
        console.log("error----", error);
      } finally {
      }
    }
    getFields();
  }, []);

  useEffect(() => {
    if (userData?.personalInfo?.state) {
      const stateCities = City.getCitiesOfState(
        "US",
        userData?.personalInfo?.state
      );
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [userData?.personalInfo?.state]);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      gender: userData?.personalInfo?.gender || "",
      state: userData?.personalInfo?.state || "",
      city: userData?.personalInfo?.city || "N/A",
      annualIncome: userData?.personalInfo?.annualIncome || "",
      firstGenerationCollegeStudent:
        userData?.personalInfo?.firstGenerationCollegeStudent || false,
      hispanicOrLatino: userData?.personalInfo?.hispanicOrLatino || false,
      race: userData?.personalInfo?.race || "",
    },
    mode: "onSubmit",
  });

  // Keep RHF in sync with Redux userData
  useEffect(() => {
    reset({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      gender: userData?.personalInfo?.gender || "",
      state: userData?.personalInfo?.state || "",
      city: userData?.personalInfo?.city || "N/A",
      annualIncome: userData?.personalInfo?.annualIncome || "",
      firstGenerationCollegeStudent:
        userData?.personalInfo?.firstGenerationCollegeStudent || false,
      hispanicOrLatino: userData?.personalInfo?.hispanicOrLatino || false,
      race: userData?.personalInfo?.race || "",
    });
    setAvatar(userData?.avatar || "");
  }, [userData, reset]);

  // Generic handler so TS knows the type relationship between field and value
  const handleFieldChange = <K extends keyof FormData>(
    field: K,
    value: any
  ) => {
    setValue(field, value);

    const currentPersonal = (userData?.personalInfo as Partial<FormData>) || {};
    const updatedPersonal: Partial<FormData> = {
      ...currentPersonal,
      [field as string]: value as any,
    };

    const payload: Partial<User & { personalInfo?: FormData }> = {
      ...(userData || {}),
      personalInfo: {
        ...(userData?.personalInfo || {}),
        ...(updatedPersonal as FormData),
      },
    };

    if (field === "firstName") payload.firstName = value as unknown as string;
    if (field === "lastName") payload.lastName = value as unknown as string;

    dispatch(updateUser(payload));
  };

  const handleAvatarUpload = (url: string) => {
    setAvatar(url);
    const payload: Partial<User> = {
      ...(userData || {}),
      avatar: url,
    };
    dispatch(updateUser(payload));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userData?.id,
          personalInfo: {
            gender: data.gender,
            state: data.state,
            city: data.city || "N/A",
            annualIncome: data.annualIncome,
            firstGenerationCollegeStudent: data.firstGenerationCollegeStudent,
            hispanicOrLatino: data.hispanicOrLatino,
            race: data.race,
          },
          firstName: data.firstName,
          lastName: data.lastName,
          avatar: avatar,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      const responseData = await res.json();
      console.log("API response:", responseData);
      const dataToUpdateInRedux = {
        personalInfo: responseData?.user?.personalInfo,
        firstName: responseData?.user?.firstName,
        lastName: responseData?.user?.lastName,
        avatar: responseData?.user?.avatar,
      };
      dispatch(updateUser({ ...userData, ...dataToUpdateInRedux }));
      dispatch(updateProfileStepNext());
    } catch (err) {
      console.error("submit error", err);
    }
  };
  console.log("userData:", userData);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[24px] w-full bg-white"
    >
      <h4 className="heading-text-style-4" style={{ textAlign: "start" }}>
        Personal Info
      </h4>

      <div className="w-full h-[182px] md:h-[118px] box-shadows-2 flex justify-start items-start relative">
        <div className="w-full h-fit flex justify-start items-start flex-col gap-[8px]">
          <span className="plan-text-style-4">Profile Picture</span>
          <span className="plan-text-style-3">
            This picture will be displayed on your profile
          </span>
          <div className="absolute left-[50%] top-[calc(100%-50px)] lg:top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <AvatarUpload
              currentAvatar={avatar || profileAvatar.src}
              onAvatarUpload={handleAvatarUpload}
              size={70}
            />
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="w-full box-shadows-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First Name */}
          <div className="flex flex-col gap-[10px]">
            <Label htmlFor="firstName" className="label-style">
              First Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="firstName"
              className="input-style"
              placeholder="Enter First Name"
              value={userData?.firstName || ""}
              onChange={(e) => handleFieldChange("firstName", e.target.value)}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-[10px]">
            <Label htmlFor="lastName" className="label-style">
              Last Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="lastName"
              className="input-style"
              placeholder="Enter Last Name"
              value={userData?.lastName || ""}
              onChange={(e) => handleFieldChange("lastName", e.target.value)}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>

          {/* Gender (Select) */}
          <div className="flex flex-col gap-[10px]">
            <Label className="label-style">
              Gender <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={userData?.personalInfo?.gender || ""}
              onValueChange={(v) =>
                handleFieldChange("gender", v as FormData["gender"])
              }
            >
              <SelectTrigger className="input-style">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Prefer not to say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          {/* State */}
          <div className="flex flex-col gap-[10px]">
            <Label className="label-style">
              State <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={userData?.personalInfo?.state || ""}
              onValueChange={(v) =>
                handleFieldChange("state", v as FormData["state"])
              }
            >
              <SelectTrigger className="input-style">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((item) => (
                  <SelectItem key={item.name} value={item.isoCode}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state.message}</p>
            )}
          </div>

          {/* City */}
          <div className="flex flex-col gap-[10px]">
            <Label className="label-style">City</Label>
            <Select
              value={userData?.personalInfo?.city}
              onValueChange={(v) =>
                handleFieldChange("city", v as FormData["city"])
              }
            >
              <SelectTrigger className="input-style">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {cities.length > 0 ? (
                  cities.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={"not found"} disabled>
                    City not found for this state
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>

          {/* Annual Income */}
          <div className="flex flex-col gap-[10px]">
            <Label className="label-style">
              Annual Income <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={userData?.personalInfo?.annualIncome || ""}
              onValueChange={(v) =>
                handleFieldChange("annualIncome", v as FormData["annualIncome"])
              }
            >
              <SelectTrigger className="input-style">
                <SelectValue placeholder="Select Income" />
              </SelectTrigger>
              <SelectContent>
                {annualIncomeOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.annualIncome && (
              <p className="text-red-500 text-sm">
                {errors.annualIncome.message}
              </p>
            )}
          </div>

          {/* First Gen */}
          <div className="flex flex-col gap-[24px]">
            <Label className="label-style">
              First Generation College Student
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fg"
                checked={
                  !!userData?.personalInfo?.firstGenerationCollegeStudent
                }
                onCheckedChange={(val) =>
                  handleFieldChange("firstGenerationCollegeStudent", !!val)
                }
              />
              <Label htmlFor="fg">
                I am a first generation college student
              </Label>
            </div>
          </div>

          {/* Ethnicity */}
          <div className="flex flex-col gap-[24px]">
            <Label className="label-style">
              Ethnicity (Are you Hispanic or Latino?)
            </Label>
            <RadioGroup
              value={userData?.personalInfo?.hispanicOrLatino ? "yes" : "no"}
              onValueChange={(val) =>
                handleFieldChange("hispanicOrLatino", val === "yes")
              }
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Race */}
          <div className="flex flex-col gap-[10px]">
            <Label className="label-style">
              Race <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={userData?.personalInfo?.race || ""}
              onValueChange={(v) =>
                handleFieldChange("race", v as FormData["race"])
              }
            >
              <SelectTrigger className="input-style">
                <SelectValue placeholder="Select Race" />
              </SelectTrigger>
              <SelectContent>
                {raceOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.race && (
              <p className="text-red-500 text-sm">{errors.race.message}</p>
            )}
          </div>
        </div>
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
