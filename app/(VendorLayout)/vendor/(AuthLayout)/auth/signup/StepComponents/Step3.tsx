"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addDocument, removeDocument } from "@/lib/store/slices/vendorSlice";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { uploadFile } from "@/lib/utils/upload";

const step3Schema = z.object({
  documents: z.array(z.string()).min(1, "At least one document is required"),
});

type Step3FormData = z.infer<typeof step3Schema>;

interface VendorSignupStep3Props {
  onNext?: () => void;
  onBack?: () => void;
}

export default function VendorSignupStep3({
  onNext,
  onBack,
}: VendorSignupStep3Props) {
  const dispatch = useAppDispatch();
  const vendorState = useAppSelector((s) => s.vendor.vendorDetails);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    formState: { errors },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      documents: vendorState.documents || [],
    },
  });
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Validate file size (5MB limit for avatars)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const url = await uploadFile(file, "avatars");
      console.log("url-----", url);
      dispatch(addDocument(url));
      setPreviewUrl(null);
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Upload failed. Please try again.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = (index: number) => {
    dispatch(removeDocument(index));
  };

  const handleNext = () => {
    if (vendorState.documents.length === 0) {
      setUploadError("At least one document is required");
      return;
    }
    onNext?.();
  };

  return (
    <Card className="w-full max-w-md auth-box-shadows min-h-fit max-h-full">
      <CardHeader className="space-y-1">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground flex items-start justify-start mb-2"
        >
          <ChevronLeft className="mr-2 h-[24px] w-[24px]" color="#B32053" />
          <span className="text-base font-semibold">Go Back</span>
        </button>
        <CardTitle className="heading-text-style-4">Documents Upload</CardTitle>
        <span className="text-base text-black/70 font-medium">
          (Please upload clear PDF/JPG copies. Multiple files allowed)
        </span>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label className="text-[14px] font-semibold">
              Tax Certificate, TÜRSAB Certificate, Business License
              <span className="text-red-500 ml-1">*</span>
            </Label>

            <div className="relative">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-600">
                    Click to upload documents (PDF or JPG)
                  </span>
                )}
              </label>
            </div>

            {uploadError && (
              <p className="text-sm text-red-500">{uploadError}</p>
            )}

            {errors.documents && (
              <p className="text-sm text-red-500">{errors.documents.message}</p>
            )}

            {vendorState.documents.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Uploaded Documents:
                </p>
                {vendorState.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <a
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate flex-1"
                    >
                      Document {index + 1}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleFileRemove(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            variant={"main_green_button"}
            onClick={handleNext}
            className="w-full"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
