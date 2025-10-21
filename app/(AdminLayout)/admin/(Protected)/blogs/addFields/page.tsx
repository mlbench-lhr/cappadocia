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
import { ChevronLeft, Plus, Save, X, Upload, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import Swal from "sweetalert2";

interface BlogFieldsType {
  tier: string[];
  type: string[];
  category: string[];
}

const initialFormState: BlogFieldsType = {
  tier: [],
  type: [],
  category: [],
};

const labels = {
  tier: "Tier",
  type: "Type",
  category: "Category",
};

const LOAD_MORE_COUNT = 5;

export default function AddBlogField() {
  const [formData, setFormData] = useState<BlogFieldsType>(initialFormState);
  const [totalCounts, setTotalCounts] = useState<
    Record<keyof BlogFieldsType, number>
  >({
    tier: 0,
    type: 0,
    category: 0,
  });
  const [loadingMore, setLoadingMore] = useState<
    Record<keyof BlogFieldsType, boolean>
  >({
    tier: false,
    type: false,
    category: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<keyof BlogFieldsType>("tier");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const router = useRouter();

  useEffect(() => {
    async function getFields() {
      try {
        setLoading(true);
        const response = await fetch("/api/blogsFields");
        const allData = await response.json();
        const fields = allData?.fields || {};
        const counts = allData?.counts || {};

        setFormData({
          tier: fields.tier || [],
          type: fields.type || [],
          category: fields.category || [],
        });

        setTotalCounts({
          tier: counts.tier || 0,
          type: counts.type || 0,
          category: counts.category || 0,
        });
      } catch (error) {
        console.error("Error fetching blog fields", error);
      } finally {
        setLoading(false);
      }
    }
    getFields();
  }, []);

  const handleOpenDialog = (type: keyof BlogFieldsType) => {
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

  const handleRemoveItem = (type: keyof BlogFieldsType, item: string) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((i) => i !== item),
    });
    setTotalCounts({
      ...totalCounts,
      [type]: Math.max(0, totalCounts[type] - 1),
    });
  };

  const handleLoadMore = async (type: keyof BlogFieldsType) => {
    setLoadingMore({ ...loadingMore, [type]: true });

    try {
      const currentOffset = formData[type].length;
      const response = await fetch(
        `/api/blogsFields?field=${type}&offset=${currentOffset}&limit=${LOAD_MORE_COUNT}`
      );
      const data = await response.json();

      if (data.success && data.items && data.items.length > 0) {
        setFormData({
          ...formData,
          [type]: [...formData[type], ...data.items],
        });
        Swal.fire(
          "Success",
          `Loaded more ${labels[type]} successfully.`,
          "success"
        );
      }
    } catch (error) {
      console.error("Error loading more items:", error);
      Swal.fire("Error", "Failed to load more items.", "error");
    } finally {
      setLoadingMore({ ...loadingMore, [type]: false });
    }
  };

  const handleCSVImport = (type: keyof BlogFieldsType, file: File) => {
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

        Swal.fire(
          "Imported",
          `Successfully imported ${uniqueNewItems.length} new ${labels[type]} items.`,
          "success"
        );
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
    type: keyof BlogFieldsType,
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
        const type = fieldKey as keyof BlogFieldsType;
        const currentLength = formData[type].length;
        const totalLength = totalCounts[type];

        if (currentLength < totalLength) {
          const response = await fetch(
            `/api/blogsFields?field=${type}&offset=${currentLength}&limit=${
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
          completeFormData[type as keyof BlogFieldsType] = [
            ...formData[type as keyof BlogFieldsType],
            ...items,
          ];
        }
      });

      const response = await fetch("/api/blogsFields", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeFormData),
      });

      if (response.ok) {
        Swal.fire("Success", "Blog fields updated successfully!", "success");
      } else {
        Swal.fire("Error", "Failed to update blog fields.", "error");
      }
    } catch (error) {
      console.error("Error updating blog fields:", error);
      Swal.fire("Error", "Error updating blog fields.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderSection = (
    title: string,
    items: string[],
    type: keyof BlogFieldsType
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
              Add {title.replace("Add ", "")}
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
            No {title.toLowerCase()} added yet. Click "Add{" "}
            {title.replace("Add ", "")}" or "Import CSV" to get started.
          </div>
        )}
      </div>
    );
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="min-h-screen w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="min-h-screen w-full">
        <div className="w-full mx-auto">
          <div className="w-full mb-8 flex justify-between items-center flex-wrap gap-y-2">
            <div className="flex items-center gap-4">
              <button
                className="p-2 hover:bg-gray-100 rounded"
                onClick={() => router.back()}
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Add Blog Fields
              </h1>
            </div>
            <Button
              onClick={handleSubmit}
              variant="main_green_button"
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

          {renderSection("Add Tier", formData.tier, "tier")}
          {renderSection("Add Type", formData.type, "type")}
          {renderSection("Add Category", formData.category, "category")}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New {labels[dialogType]}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-input">{labels[dialogType]} Name</Label>
                <Input
                  id="item-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Enter ${labels[dialogType]} name`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddItem();
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
