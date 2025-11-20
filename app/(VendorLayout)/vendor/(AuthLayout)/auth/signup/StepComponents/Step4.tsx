"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setVendorField,
  addLanguage,
  removeLanguage,
} from "@/lib/store/slices/vendorSlice";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  SelectInputComponent,
  TextInputComponent,
} from "@/components/SmallComponents/InputComponents";

const step4Schema = z.object({
  aboutUs: z.string().min(10, "About Us must be at least 10 characters"),
  language: z.string(),
});

type Step4FormData = z.infer<typeof step4Schema>;

const languageOptions = [
  "English",
  "Turkish",
  "Arabic",
  "French",
  "German",
  "Spanish",
  "Chinese",
];

interface VendorSignupStep4Props {
  onNext?: () => void;
  onBack?: () => void;
}

export default function VendorSignupStep4({
  onNext,
  onBack,
}: VendorSignupStep4Props) {
  const dispatch = useAppDispatch();
  const vendorState = useAppSelector((s) => s.vendor.vendorDetails);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      aboutUs: vendorState.aboutUs || "",
      language: "",
    },
  });
  console.log("errorr-----", errors);
  console.log("control-----", control);

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.aboutUs) {
        dispatch(
          setVendorField({
            field: "aboutUs",
            value: value.aboutUs,
          })
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  const onSubmit = (data: Step4FormData) => {
    dispatch(
      setVendorField({
        field: "aboutUs",
        value: data.aboutUs,
      })
    );

    onNext?.();
  };

  const handleAddLanguage = (language: string) => {
    if (language && !vendorState.languages.includes(language)) {
      dispatch(addLanguage(language));
    }
  };

  const handleRemoveLanguage = (language: string) => {
    dispatch(removeLanguage(language));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground flex items-start justify-start mb-2"
        >
          <ChevronLeft className="mr-2 h-[24px] w-[24px]" color="#B32053" />
          <span className="text-base font-semibold">Go Back</span>
        </button>
        <CardTitle className="text-2xl font-bold">Profile & Branding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="aboutUs"
            control={control}
            render={({ field }) => (
              <TextInputComponent
                label="About Us"
                placeholder="Tell us about your business"
                value={field.value}
                onChange={field.onChange}
                error={errors.aboutUs?.message}
                required
              />
            )}
          />

          <div className="space-y-2">
            <label className="text-sm font-semibold">Languages Supported</label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <SelectInputComponent
                  label=""
                  placeholder="Select language"
                  value={field.value}
                  onChange={(value) => {
                    handleAddLanguage(value);
                    field.onChange("");
                  }}
                  error={errors.language?.message}
                  options={languageOptions}
                />
              )}
            />

            {vendorState.languages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {vendorState.languages.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                    <button
                      onClick={() => handleRemoveLanguage(lang)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Next
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
