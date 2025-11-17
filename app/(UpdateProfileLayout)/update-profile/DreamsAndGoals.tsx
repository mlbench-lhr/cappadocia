"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import React from "react";
import HarvardUniversity from "@/public/Harvard University.png";
import university2 from "@/public/Ellipse 8.png";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  updateProfileStepBack,
  updateProfileStepNext,
} from "@/lib/store/slices/generalSlice";
import { updateUser } from "@/lib/store/slices/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User } from "@/lib/types/auth";
import { ChevronDown, X } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { careerOptions, majorsOptions, subMajors } from "@/lib/constants";

const schema = z.object({
  dreamSchool: z.array(z.string()).default([]),
  majors: z.array(z.string()).default([]),
  intendedMajors: z.array(z.string()).default([]),
  careerAspiration: z.array(z.string()).default([]),
  intendedMajorsNotInterested: z.array(z.string()).default([]),
  careerAspirationNotInterested: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof schema>;

export default function DreamsAndGoals() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((s) => s.auth.user) as
    | (User & { dreamsAndGoals?: Partial<FormData> })
    | null;
  const signupSteps = useAppSelector((s) => s.general.signupSteps);

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      dreamSchool: userData?.dreamsAndGoals?.dreamSchool || [],
      majors: userData?.dreamsAndGoals?.majors || [],
      intendedMajors: userData?.dreamsAndGoals?.intendedMajors || [],
      careerAspiration: userData?.dreamsAndGoals?.careerAspiration || [],
      intendedMajorsNotInterested:
        userData?.dreamsAndGoals?.intendedMajorsNotInterested || [],
      careerAspirationNotInterested:
        userData?.dreamsAndGoals?.careerAspirationNotInterested || [],
    },
    mode: "onSubmit",
  });

  console.log("RHF defaultValues (initial):", {
    dreamSchool: userData?.dreamsAndGoals?.dreamSchool || [],
    majors: userData?.dreamsAndGoals?.majors || [],
    intendedMajors: userData?.dreamsAndGoals?.intendedMajors || [],
    careerAspiration: userData?.dreamsAndGoals?.careerAspiration || [],
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log("RHF watch callback — change:", { name, type, value });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    console.log("useEffect userData/reset called. userData:", userData);
    const vals = {
      dreamSchool: userData?.dreamsAndGoals?.dreamSchool || [],
      majors: userData?.dreamsAndGoals?.majors || [],
      intendedMajors: userData?.dreamsAndGoals?.intendedMajors || [],
      careerAspiration: userData?.dreamsAndGoals?.careerAspiration || [],
      intendedMajorsNotInterested:
        userData?.dreamsAndGoals?.intendedMajorsNotInterested || [],
      careerAspirationNotInterested:
        userData?.dreamsAndGoals?.careerAspirationNotInterested || [],
    };
    console.log("Resetting form to:", vals);
    reset(vals);
  }, [userData, reset]);

  const handleFieldChange = <K extends keyof FormData>(
    field: K,
    value: string[]
  ) => {
    console.log("handleFieldChange called:", { field, value });

    const before = watch(field);
    console.log(`Before setValue for ${String(field)}:`, before);

    // Update form state immediately
    setValue(field, value, { shouldValidate: true, shouldDirty: true });

    const afterImmediate = watch(field);
    console.log(`After immediate watch for ${String(field)}:`, afterImmediate);

    // Update Redux store
    const currentGoals = (userData?.dreamsAndGoals as Partial<FormData>) || {};
    const updatedGoals: Partial<FormData> = {
      ...currentGoals,
      [field as string]: value,
    };

    const payload: Partial<User & { dreamsAndGoals?: FormData }> = {
      ...(userData || {}),
      dreamsAndGoals: {
        ...(userData?.dreamsAndGoals || {}),
        ...(updatedGoals as FormData),
      },
    };

    console.log("Dispatching updateUser with payload:", payload);
    dispatch(updateUser(payload))
      .then((r: any) =>
        console.log("updateUser dispatch resolved, result:", { r })
      )
      .catch((e: any) =>
        console.error("updateUser dispatch rejected, error:", { e })
      );
  };

  const removeItem = (field: keyof FormData, value: string) => {
    console.log("removeItem called:", { field, value });
    const currentArray = watch(field) || [];
    console.log(
      `Current array for ${String(field)} before removal:`,
      currentArray
    );
    const newArray = currentArray.filter((v: string) => v !== value);
    console.log(`New array for ${String(field)} after removal:`, newArray);
    handleFieldChange(field, newArray);
  };

  const onSubmit = async (data: FormData) => {
    console.log("onSubmit called with data:", data);
    try {
      console.log("Sending PUT /api/profile with id:", userData?.id);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userData?.id, dreamsAndGoals: data }),
      });

      console.log("Fetch returned. ok:", res.ok, "status:", res.status);
      if (!res.ok) {
        const text = await res.text().catch(() => "no body");
        console.error("Failed to submit. Response body:", text);
        throw new Error("Failed to submit");
      }
      const responseData = await res.json();
      console.log("Response JSON:", responseData);
      dispatch(
        updateUser({
          ...userData,
          dreamsAndGoals: responseData?.user?.dreamsAndGoals,
        })
      );
      dispatch(updateProfileStepNext());
    } catch (err) {
      console.error("submit error", err);
    }
  };

  const dreamSchoolOptions = [
    { label: "Harvard University", imageIcon: HarvardUniversity.src },
    { label: "Stanford University", imageIcon: university2.src },
  ];

  const intendedMajorsOptions = [...majorsOptions];
  const careerAspirationOptions = [
    "Software Engineer",
    "Data Scientist",
    "Researcher",
    "Product Manager",
    "Entrepreneur",
    "Consultant",
    "Physician",
    "Civil Engineer",
    "Educator",
    "Artist",
  ];

  type Option = string | { label: string; imageIcon?: string };

  type Props = {
    field: keyof FormData;
    label: string;
    options: Option[];
    watch: (field: keyof FormData) => string[];
    handleFieldChange: (field: keyof FormData, value: string[]) => void;
    removeItem: (field: keyof FormData, value: string) => void;
  };
  type PropsMajor = {
    field: keyof FormData;
    label: string;
    watch: (field: keyof FormData) => string[];
    handleFieldChange: (field: keyof FormData, value: string[]) => void;
    removeItem: (field: keyof FormData, value: string) => void;
  };

  const SearchableMultiSelect = ({
    field,
    label,
    options,
    watch,
    handleFieldChange,
    removeItem,
  }: Props) => {
    const [search, setSearch] = React.useState("");
    const [focused, setFocused] = React.useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const selected = watch(field) || [];

    const normalizedOptions = options.map((opt) =>
      typeof opt === "string" ? { label: opt } : opt
    );

    useEffect(() => {
      console.log("SearchableMultiSelect mounted for field:", field);
      return () => {
        console.log("SearchableMultiSelect unmounted for field:", field);
      };
    }, [field]);

    useEffect(() => {
      console.log("SearchableMultiSelect selected/watched change:", {
        field,
        selected,
      });
    }, [selected, field]);

    // Handle clicks outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setFocused(false);
        }
      };

      if (focused) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [focused]);

    const filteredOptions = normalizedOptions.filter(
      (opt) =>
        !selected.includes(opt.label) &&
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    console.log("SearchableMultiSelect filteredOptions:", {
      field,
      search,
      filteredOptions,
      normalizedOptions,
      selected,
    });

    const addOption = (option: string) => {
      console.log("SearchableMultiSelect addOption called:", {
        field,
        option,
      });
      handleFieldChange(field, [...selected, option]);
      setSearch("");
      setFocused(false);
    };

    return (
      <div className="flex flex-col gap-4 w-full relative">
        <Label className="font-[400] text-[16px]">{label}</Label>

        <div className="relative w-full h-fit">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search..."
            value={search}
            onChange={(e) => {
              console.log("Search input change:", {
                field,
                value: e.target.value,
              });
              setSearch(e.target.value);
            }}
            onFocus={() => {
              console.log("Search input focus:", { field });
              setFocused(true);
            }}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
          />
          <div className="absolute right-2 top-[50%] translate-y-[-50%] cursor-pointer">
            <ChevronDown size={15} color="#BBBBBB" />
          </div>
        </div>

        {focused && (
          <div
            ref={dropdownRef}
            className="absolute top-[85px] left-0 w-full max-h-48 overflow-y-auto border rounded-md bg-white shadow-lg z-50"
          >
            {filteredOptions?.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.label}
                  onMouseDown={(e) => {
                    // Use onMouseDown instead of onClick to prevent blur from firing first
                    e.preventDefault();
                    console.log("Dropdown item clicked:", {
                      field,
                      label: option.label,
                    });
                    addOption(option.label);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-green-100 flex items-center gap-2"
                >
                  {option.imageIcon && (
                    <Image
                      src={option.imageIcon}
                      width={24}
                      height={24}
                      alt={option.label}
                      className="rounded-full"
                    />
                  )}
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No options found</div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((opt) => (
            <div
              key={opt}
              role="button"
              tabIndex={0}
              className="cursor-pointer px-[12px] py-[8px] rounded-[8px] flex items-center gap-1 bg-[#B32053]"
            >
              {opt}
              <X
                size={16}
                onClick={() => {
                  console.log("Chip X clicked in SearchableMultiSelect:", {
                    field,
                    opt,
                  });
                  removeItem(field, opt);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SearchableMultiSelectMajor = ({
    field,
    label,
    watch,
    handleFieldChange,
    removeItem,
  }: PropsMajor) => {
    const [search, setSearch] = React.useState("");
    const [selectedMajor, setSelectedMajor] = React.useState<string>("All");
    const [focused, setFocused] = React.useState(false);
    const [filterOpen, setFilterOpen] = React.useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const selected = watch(field) || [];
    const userDataLocal = useAppSelector((s) => s.auth.user) as
      | (User & { dreamsAndGoals?: Partial<FormData> })
      | null;

    useEffect(() => {
      console.log("SearchableMultiSelectMajor mounted:", { field });
      return () => {
        console.log("SearchableMultiSelectMajor unmounted:", { field });
      };
    }, [field]);

    // Handle clicks outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setFocused(false);
          setFilterOpen(false);
        }
      };

      if (focused || filterOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [focused, filterOpen]);

    const normalizedOptions = useMemo(() => {
      const sub = subMajors[selectedMajor] || [];
      console.log("normalizedOptions computed for selectedMajor:", {
        selectedMajor,
        sub,
      });
      return sub.map((opt) => opt);
    }, [selectedMajor]);

    const addOption = (option: string) => {
      console.log("SearchableMultiSelectMajor addOption:", { field, option });
      handleFieldChange(field, [...selected, option]);
      setSearch("");
      setFocused(false);
      setFilterOpen(false);
    };

    const filteredOptions: string[] | undefined = useMemo(() => {
      if (field === "careerAspiration") {
        const allCareerOptions =
          userDataLocal?.dreamsAndGoals?.majors?.flatMap(
            (subMajor) => careerOptions[subMajor] || []
          ) || careerAspirationOptions;

        console.log("Building career options based on majors:", {
          userMajors: userDataLocal?.dreamsAndGoals?.majors,
          allCareerOptions,
        });

        return allCareerOptions.filter(
          (opt) =>
            !selected.includes(opt) &&
            opt.toLowerCase().includes(search.toLowerCase())
        );
      } else {
        return normalizedOptions.filter(
          (opt) =>
            !selected.includes(opt) &&
            opt.toLowerCase().includes(search.toLowerCase())
        );
      }
    }, [
      userDataLocal?.dreamsAndGoals?.majors,
      selected,
      normalizedOptions,
      search,
      field,
    ]);

    console.log("SearchableMultiSelectMajor filteredOptions:", {
      field,
      filteredOptions,
      search,
      selected,
      selectedMajor,
    });

    return (
      <div className=" w-full relative grid grid-cols-2 gap-[10px]">
        {field !== "careerAspiration" && (
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4 w-full relative">
            <Label className="font-[400] text-[16px]">
              Filter by Category:
            </Label>
            <Select
              value={selectedMajor}
              onValueChange={(e) => {
                console.log("Major filter changed:", { e });
                setSelectedMajor(e);
                setFilterOpen(true);
                setFocused(true);
              }}
            >
              <SelectTrigger className="w-full" style={{ height: "42.5px" }}>
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                {majorsOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div
          className={`col-span-2 ${
            field !== "careerAspiration" ? "md:col-span-1" : "md:col-span-2"
          } flex flex-col gap-4 w-full relative`}
        >
          <Label className="font-[400] text-[16px]">{label}</Label>

          <div className="relative w-full h-fit">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to search..."
              value={search}
              onChange={(e) => {
                console.log("Major search input change:", {
                  field,
                  value: e.target.value,
                });
                setSearch(e.target.value);
              }}
              onFocus={() => {
                console.log("Major search input focus:", { field });
                setFocused(true);
              }}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
            />
            <div
              className="absolute right-2 top-[50%] translate-y-[-50%] cursor-pointer"
              onClick={() => {
                console.log("Major dropdown chevron clicked:", {
                  field,
                  focused,
                  filterOpen,
                });
                if (focused || filterOpen) {
                  setFilterOpen(false);
                  setFocused(false);
                } else {
                  setFilterOpen(true);
                  setFocused(true);
                }
              }}
            >
              <ChevronDown size={15} color="#BBBBBB" />
            </div>
          </div>

          {(focused || filterOpen) && (
            <div
              ref={dropdownRef}
              className={`absolute ${
                field === "careerAspiration" ? "top-[60px]" : "top-[85px]"
              } left-0 w-full max-h-48 overflow-y-auto border rounded-md bg-white shadow-lg z-50`}
            >
              {filteredOptions && filteredOptions?.length > 0 ? (
                filteredOptions?.map((option) => (
                  <div
                    key={option}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      console.log("Major dropdown option clicked:", {
                        field,
                        option,
                      });
                      addOption(option);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-green-100 flex items-center gap-2"
                  >
                    {option}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500">No options found</div>
              )}
            </div>
          )}
        </div>

        <div className="col-span-2 flex flex-wrap gap-2 mt-2">
          {selected.map((opt) => (
            <div
              key={opt}
              role="button"
              tabIndex={0}
              className="cursor-pointer px-[12px] py-[8px] rounded-[8px] flex items-center gap-1 bg-[#B32053]"
            >
              {opt}
              <X
                size={16}
                onClick={() => {
                  console.log("Major chip X clicked:", { field, opt });
                  removeItem(field, opt);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  type OptionInputProps = {
    field: keyof FormData;
    placeholder?: string;
  };

  const OptionInput = ({
    field,
    placeholder = "Enter your career aspiration",
  }: OptionInputProps) => {
    const [inputValue, setInputValue] = useState("");
    const values: string[] = watch(field) || [];

    useEffect(() => {
      console.log("OptionInput mounted for field:", field);
      return () => {
        console.log("OptionInput unmounted for field:", field);
      };
    }, [field]);

    const addValue = () => {
      const trimmed = inputValue.trim();
      console.log("OptionInput addValue called:", { field, trimmed });
      if (trimmed && !values.includes(trimmed)) {
        handleFieldChange(field, [...values, trimmed]);
      } else {
        console.log("OptionInput addValue ignored (empty or duplicate):", {
          trimmed,
          values,
        });
      }
      setInputValue("");
    };

    const removeValue = (val: string) => {
      console.log("OptionInput removeValue called:", { field, val });
      handleFieldChange(
        field,
        values.filter((item) => item !== val)
      );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addValue();
      }
    };

    return (
      <div>
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => {
            console.log("OptionInput change:", {
              field,
              value: e.target.value,
            });
            setInputValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="w-full border rounded-[8px] px-3 py-2 outline-none"
        />

        <div className="flex flex-wrap gap-[8px] mt-[16px]">
          {values.map((val) => (
            <div
              key={val}
              className="px-[12px] py-[6px] rounded-[8px] flex items-center gap-[6px] bg-[#B32053] font-[500]"
            >
              <span>{val}</span>
              <X
                size={16}
                onClick={() => {
                  console.log("OptionInput chip X clicked:", { field, val });
                  removeValue(val);
                }}
                className="cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[32px] w-full bg-white"
    >
      <div className="w-full space-y-[16px]">
        <h4 className="heading-text-style-4" style={{ textAlign: "start" }}>
          Dreams & Goals<span className="text-red-500 ml-1">*</span>
        </h4>
        <SearchableMultiSelect
          field="dreamSchool"
          label="Search for your dream school:"
          options={dreamSchoolOptions}
          watch={watch}
          handleFieldChange={handleFieldChange}
          removeItem={removeItem}
        />
      </div>

      <div className="w-full space-y-[16px]">
        <h4 className="heading-text-style-4" style={{ textAlign: "start" }}>
          Select Major<span className="text-red-500 ml-1">*</span>
        </h4>
        <SearchableMultiSelectMajor
          field="majors"
          label="Search for your major:"
          watch={watch}
          handleFieldChange={handleFieldChange}
          removeItem={removeItem}
        />
      </div>

      <div className="w-full space-y-[16px]">
        <h4 className="heading-text-style-4" style={{ textAlign: "start" }}>
          Career Aspiration<span className="text-red-500 ml-1">*</span>
        </h4>
        <SearchableMultiSelectMajor
          field="careerAspiration"
          label=""
          watch={watch}
          handleFieldChange={handleFieldChange}
          removeItem={removeItem}
        />
      </div>

      <div className="w-full flex justify-end gap-2">
        {signupSteps !== 0 && (
          <Button
            type="button"
            variant="green_secondary_button"
            size="lg"
            onClick={() => {
              console.log(
                "Back button clicked. dispatching updateProfileStepBack()"
              );
              dispatch(updateProfileStepBack());
            }}
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
