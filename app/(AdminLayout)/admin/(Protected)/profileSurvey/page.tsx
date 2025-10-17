"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, X, Upload, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import Papa from "papaparse";
import Swal from "sweetalert2";

interface MilestoneFieldsType {
  race: string[];
  annualIncome: string[];
  gradeLevel: string[];
  dreamSchool: string[];
  recognitionLevel: string[];
  activityType: string[];
}

const initialFormState: MilestoneFieldsType = {
  race: [],
  annualIncome: [],
  gradeLevel: [],
  dreamSchool: [],
  recognitionLevel: [],
  activityType: [],
};

const labels = {
  race: "Race",
  annualIncome: "Annual Income",
  gradeLevel: "Grade Level",
  dreamSchool: "Dream School",
  recognitionLevel: "Recognition Level",
  activityType: "Activity Type",
};

const LOAD_MORE_COUNT = 6;

export default function AddMilestoneField() {
  const [formData, setFormData] =
    useState<MilestoneFieldsType>(initialFormState);
  const [totalCounts, setTotalCounts] = useState<
    Record<keyof MilestoneFieldsType, number>
  >({
    race: 0,
    annualIncome: 0,
    gradeLevel: 0,
    dreamSchool: 0,
    recognitionLevel: 0,
    activityType: 0,
  });
  const [loadingMore, setLoadingMore] = useState<
    Record<keyof MilestoneFieldsType, boolean>
  >({
    race: false,
    annualIncome: false,
    gradeLevel: false,
    dreamSchool: false,
    recognitionLevel: false,
    activityType: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] =
    useState<keyof MilestoneFieldsType>("race");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    async function getFields() {
      try {
        setLoading(true);
        const response = await fetch("/api/surveyFields");
        const allData = await response.json();
        const fields = allData?.fields || {};
        const counts = allData?.counts || {};

        setFormData({
          race: fields.race || [],
          annualIncome: fields.annualIncome || [],
          gradeLevel: fields.gradeLevel || [],
          dreamSchool: fields.dreamSchool || [],
          recognitionLevel: fields.recognitionLevel || [],
          activityType: fields.activityType || [],
        });

        setTotalCounts({
          race: counts.race || 0,
          annualIncome: counts.annualIncome || 0,
          gradeLevel: counts.gradeLevel || 0,
          dreamSchool: counts.dreamSchool || 0,
          recognitionLevel: counts.recognitionLevel || 0,
          activityType: counts.activityType || 0,
        });
      } catch (error) {
        console.error("Error fetching milestone fields", error);
        Swal.fire("Error", "Failed to load survey fields.", "error");
      } finally {
        setLoading(false);
      }
    }
    getFields();
  }, []);

  const handleOpenDialog = (type: keyof MilestoneFieldsType) => {
    setDialogType(type);
    setInputValue("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setInputValue("");
  };

  const handleAddItem = () => {
    if (!inputValue.trim()) return;

    const key = dialogType;
    if (!formData[key].includes(inputValue.trim())) {
      const newItem = inputValue.trim();
      setFormData({
        ...formData,
        [key]: [newItem, ...formData[key]],
      });
      setTotalCounts({
        ...totalCounts,
        [key]: totalCounts[key] + 1,
      });
    }
    handleCloseDialog();
  };

  const handleRemoveItem = (type: keyof MilestoneFieldsType, item: string) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((i) => i !== item),
    });
    setTotalCounts({
      ...totalCounts,
      [type]: Math.max(0, totalCounts[type] - 1),
    });
  };

  const handleLoadMore = async (type: keyof MilestoneFieldsType) => {
    setLoadingMore({ ...loadingMore, [type]: true });

    try {
      const currentOffset = formData[type].length;
      const response = await fetch(
        `/api/surveyFields?field=${type}&offset=${currentOffset}&limit=${LOAD_MORE_COUNT}`
      );
      const data = await response.json();

      if (data.success && data.items && data.items.length > 0) {
        setFormData({
          ...formData,
          [type]: [...formData[type], ...data.items],
        });
      }
    } catch (error) {
      console.error("Error loading more items:", error);
      Swal.fire("Error", "Failed to load more items.", "error");
    } finally {
      setLoadingMore({ ...loadingMore, [type]: false });
    }
  };

  const handleCSVImport = (type: keyof MilestoneFieldsType, file: File) => {
    Papa.parse(file, {
      complete: (results) => {
        const newItems: string[] = [];

        results.data.forEach((row: any) => {
          const value = Array.isArray(row) ? row[0] : row[Object.keys(row)[0]];
          if (value && typeof value === "string" && value.trim()) {
            newItems.push(value.trim());
          }
        });

        const existingSet = new Set(formData[type]);
        const uniqueNewItems = newItems.filter(
          (item) => !existingSet.has(item)
        );

        setFormData({
          ...formData,
          [type]: [...uniqueNewItems, ...formData[type]],
        });

        setTotalCounts({
          ...totalCounts,
          [type]: totalCounts[type] + uniqueNewItems.length,
        });
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        console.error("CSV Parse Error:", error);
        Swal.fire("Error", "Error parsing CSV file.", "error");
      },
    });
  };

  const handleFileSelect = (
    type: keyof MilestoneFieldsType,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        handleCSVImport(type, file);
      } else {
        Swal.fire("Invalid File", "Please select a valid CSV file.", "warning");
      }
    }
    event.target.value = "";
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      // Fetch all remaining data before saving
      const allFieldsPromises = Object.keys(formData).map(async (fieldKey) => {
        const type = fieldKey as keyof MilestoneFieldsType;
        const currentLength = formData[type].length;
        const totalLength = totalCounts[type];

        if (currentLength < totalLength) {
          const response = await fetch(
            `/api/surveyFields?field=${type}&offset=${currentLength}&limit=${
              totalLength - currentLength
            }`
          );
          const data = await response.json();
          return { type, items: data.items || [] };
        }
        return { type, items: [] };
      });

      const allRemainingData = await Promise.all(allFieldsPromises);

      const completeFormData = { ...formData };
      allRemainingData.forEach(({ type, items }) => {
        if (items.length > 0) {
          completeFormData[type as keyof MilestoneFieldsType] = [
            ...formData[type as keyof MilestoneFieldsType],
            ...items,
          ];
        }
      });

      const response = await fetch("/api/surveyFields", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeFormData),
      });
    } catch (error) {
      console.error("Error updating milestone fields:", error);
      Swal.fire("Error", "Error updating survey fields.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderSection = (
    title: string,
    items: string[],
    type: keyof MilestoneFieldsType
  ) => {
    const hasMore = items.length < totalCounts[type];
    const remaining = totalCounts[type] - items.length;

    return (
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-semibold text-gray-700">
            {title}{" "}
            <span className="text-sm text-gray-500">({totalCounts[type]})</span>
          </h2>
          <div className="flex gap-2">
            <input
              type="file"
              ref={(el: any) => (fileInputRefs.current[type] = el)}
              onChange={(e) => handleFileSelect(type, e)}
              accept=".csv"
              style={{ display: "none" }}
            />
            <Button
              onClick={() => fileInputRefs.current[type]?.click()}
              variant="main_green_button"
              size="sm"
            >
              <Upload className="w-4 h-4" /> Import
            </Button>
            <Button
              onClick={() => handleOpenDialog(type)}
              variant="green_secondary_button"
              size="sm"
            >
              <Plus className="mr-2" size={16} />
              Add {title}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-gray-300 transition-colors"
            >
              <span className="text-gray-700 text-sm flex-1 truncate">
                {item}
              </span>
              <button
                onClick={() => handleRemoveItem(type, item)}
                className="ml-3 p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-4 text-center">
            <Button
              onClick={() => handleLoadMore(type)}
              variant="outline"
              disabled={loadingMore[type]}
              className="min-w-[120px]"
            >
              {loadingMore[type] ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                `More (${remaining} remaining)`
              )}
            </Button>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No {title.toLowerCase()} added yet. Click "Add {title}" or "Import
            CSV" to get started.
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-[24px] flex flex-col gap-[32px] justify-start items-start w-full">
          <div className="box-shadows-2 py-[24px] flex flex-col gap-[32px] justify-start items-start w-full relative">
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
          <div className="w-full mb-8 flex justify-between items-center flex-wrap gap-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Add Survey Fields
              </h1>
            </div>
            <Button
              onClick={handleSubmit}
              variant={"main_green_button"}
              className="w-full md:w-fit"
              disabled={submitLoading}
            >
              {submitLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={16} />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {renderSection("Race", formData.race, "race")}
          {renderSection(
            "Annual Income",
            formData.annualIncome,
            "annualIncome"
          )}
          {renderSection("Grade Level", formData.gradeLevel, "gradeLevel")}
          {renderSection("Dream School", formData.dreamSchool, "dreamSchool")}
          {renderSection(
            "Recognition Level",
            formData.recognitionLevel,
            "recognitionLevel"
          )}
          {renderSection(
            "Activity Type",
            formData.activityType,
            "activityType"
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New {labels[dialogType]}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-input">{labels[dialogType]}</Label>
                <Input
                  id="item-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Enter ${labels[dialogType]}`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddItem();
                    }
                  }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                onClick={handleAddItem}
                className="bg-[#00B67A] hover:bg-[#009461] text-white"
              >
                Add {labels[dialogType]}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
