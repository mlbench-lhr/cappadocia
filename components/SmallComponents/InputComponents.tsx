import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface BaseInputProps {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export const SelectInputComponent = ({
  label,
  placeholder,
  options,
  disabled = false,
  required = false,
  value,
  onChange,
}: BaseInputProps & {
  options?: string[] | number[];
}) => {
  return (
    <div className="space-y-1 col-span-1">
      <Label className="text-[14px] font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger className="w-full" style={{ height: "44px" }}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full">
          {options?.map((item) => (
            <SelectItem key={item} value={item as string}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const TextInputComponent = ({
  label,
  placeholder,
  disabled = false,
  required = false,
  value,
  onChange,
  type = "text",
}: BaseInputProps & {
  type?: "text" | "email" | "number" | "tel" | "password" | "date";
}) => {
  const placeholderTemp = placeholder || "Enter " + label;
  return (
    <div className="space-y-1 col-span-1">
      <Label className="text-[14px] font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type={type}
        placeholder={placeholderTemp}
        className="h-[44px] bg-white"
        required={required}
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export const RadioInputComponent = ({
  label,
  options,
  value,
  onChange,
  required = false,
}: {
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) => {
  return (
    <div className="space-y-2 col-span-1">
      <Label className="text-[14px] font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex gap-14 flex-col md:flex-row justify-start items-center flex-wrap"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export const FileInputComponent = ({
  label,
  placeholder,
  disabled = false,
  required = false,
  onChange,
}: {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (file: File | null) => void;
}) => {
  const placeholderTemp = placeholder || "Choose file";
  return (
    <div className="space-y-1 col-span-1">
      <Label className="text-[14px] font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="file"
        placeholder={placeholderTemp}
        className="h-[44px] bg-white cursor-pointer"
        required={required}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.files?.[0] || null)}
      />
    </div>
  );
};
