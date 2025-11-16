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
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";

interface BaseInputProps {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

// Form-controlled versions
interface FormInputProps<T extends FieldValues> {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  control: Control<T>;
  name: FieldPath<T>;
}

// Regular Select Component (non-form)
export const SelectInputComponent = ({
  label,
  placeholder,
  options,
  disabled = false,
  required = false,
  value,
  onChange,
  error,
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
        <SelectTrigger
          className={`w-full ${
            error ? "border-red-500 focus:ring-red-500" : ""
          }`}
          style={{ height: "44px" }}
        >
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
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// Form-controlled Select Component
export function FormSelectInput<T extends FieldValues>({
  label,
  placeholder,
  options,
  disabled = false,
  required = false,
  control,
  name,
}: FormInputProps<T> & {
  options?: string[] | number[];
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SelectInputComponent
          label={label}
          placeholder={placeholder}
          options={options}
          disabled={disabled}
          required={required}
          value={field.value}
          onChange={field.onChange}
          error={error?.message}
        />
      )}
    />
  );
}

// Regular Text Input Component (non-form)
export const TextInputComponent = ({
  label,
  placeholder,
  disabled = false,
  required = false,
  value,
  onChange,
  type = "text",
  error,
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
        className={`h-[44px] bg-white ${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        }`}
        required={required}
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// Form-controlled Text Input Component
export function FormTextInput<T extends FieldValues>({
  label,
  placeholder,
  disabled = false,
  required = false,
  control,
  name,
  type = "text",
}: FormInputProps<T> & {
  type?: "text" | "email" | "number" | "tel" | "password" | "date";
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextInputComponent
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          type={type}
          value={field.value}
          onChange={field.onChange}
          error={error?.message}
        />
      )}
    />
  );
}

// Regular Radio Input Component (non-form)
export const RadioInputComponent = ({
  label,
  options,
  value,
  onChange,
  required = false,
  error,
}: {
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
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
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// Form-controlled Radio Input Component
export function FormRadioInput<T extends FieldValues>({
  label,
  options,
  required = false,
  control,
  name,
}: {
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  control: Control<T>;
  name: FieldPath<T>;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <RadioInputComponent
          label={label}
          options={options}
          required={required}
          value={field.value}
          onChange={field.onChange}
          error={error?.message}
        />
      )}
    />
  );
}

// Regular File Input Component (non-form)
export const FileInputComponent = ({
  label,
  placeholder,
  disabled = false,
  required = false,
  onChange,
  error,
}: {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (file: File | null) => void;
  error?: string;
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
        className={`h-[44px] bg-white cursor-pointer ${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        }`}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.files?.[0] || null)}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// Form-controlled File Input Component
export function FormFileInput<T extends FieldValues>({
  label,
  placeholder,
  disabled = false,
  required = false,
  control,
  name,
}: {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  control: Control<T>;
  name: FieldPath<T>;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, ...field }, fieldState: { error } }) => (
        <FileInputComponent
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={onChange}
          error={error?.message}
        />
      )}
    />
  );
}
