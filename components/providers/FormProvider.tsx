import { ReactNode } from "react";
import {
  useForm,
  FormProvider,
  FieldValues,
  UseFormProps,
} from "react-hook-form";

export type FormField = {
  name: string;
  label: string;
  type: "text" | "select" | "radio" | "phone" | "file" | "custom";
  placeholder?: string;
  options?: string[] | number[];
  radioOptions?: { value: string; label: string }[];
  defaultValue?: any;
  disabled?: boolean;
  required?: boolean;
  rules?: {
    required?: string | boolean;
    pattern?: { value: RegExp; message: string };
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    validate?: (value: any) => boolean | string;
  };
  customComponent?: ReactNode;
  gridSpan?: 1 | 2;
};

export type FormSection = {
  title: string;
  fields: FormField[];
  className?: string;
};

type FormProviderComponentProps<T extends FieldValues> = {
  sections: FormSection[];
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: UseFormProps<T>["defaultValues"];
  children?: ReactNode;
  formOptions?: UseFormProps<T>;
};

export function FormProviderComponent<T extends FieldValues>({
  sections,
  onSubmit,
  defaultValues,
  children,
  formOptions,
}: FormProviderComponentProps<T>) {
  const methods = useForm<T>({
    defaultValues,
    mode: "onBlur",
    ...formOptions,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {sections.map((section, idx) => (
          <FormSection key={idx} section={section} />
        ))}
        {children}
      </form>
    </FormProvider>
  );
}

function FormSection({ section }: { section: FormSection }) {
  return (
    <div className={section.className}>
      <h3 className="text-[18px] font-semibold mb-4">{section.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {section.fields.map((field) => (
          <FormFieldRenderer key={field.name} field={field} />
        ))}
      </div>
    </div>
  );
}

function FormFieldRenderer({ field }: { field: FormField }) {
  const gridClass =
    field.gridSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1";

  if (field.type === "custom" && field.customComponent) {
    return <div className={gridClass}>{field.customComponent}</div>;
  }

  return (
    <div className={gridClass}>
      {field.type === "text" && (
        <ControlledTextInput
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          disabled={field.disabled}
          rules={field.rules}
        />
      )}
      {field.type === "select" && (
        <ControlledSelectInput
          name={field.name}
          label={field.label}
          placeholder={field.placeholder || "Select"}
          options={field.options || []}
          rules={field.rules}
        />
      )}
      {field.type === "radio" && (
        <ControlledRadioInput
          name={field.name}
          label={field.label}
          options={field.radioOptions || []}
          rules={field.rules}
        />
      )}
      {field.type === "file" && (
        <ControlledFileInput
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          disabled={field.disabled}
          rules={field.rules}
        />
      )}
    </div>
  );
}

// Controlled Input Components
import { useFormContext, Controller } from "react-hook-form";
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

function ControlledTextInput({
  name,
  label,
  placeholder,
  disabled,
  rules,
}: {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  rules?: any;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <div className="space-y-1">
          <Label className="text-[14px] font-semibold">{label}</Label>
          <Input
            {...field}
            placeholder={placeholder || `Enter ${label}`}
            className="h-[44px] bg-white"
            disabled={disabled}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">
              {error.message as string}
            </p>
          )}
        </div>
      )}
    />
  );
}

function ControlledSelectInput({
  name,
  label,
  placeholder,
  options,
  rules,
}: {
  name: string;
  label: string;
  placeholder: string;
  options: string[] | number[];
  rules?: any;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <div className="space-y-1">
          <Label className="text-[14px] font-semibold">{label}</Label>
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full h-[44px]">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((item) => (
                <SelectItem key={item} value={item.toString()}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <p className="text-red-500 text-xs mt-1">
              {error.message as string}
            </p>
          )}
        </div>
      )}
    />
  );
}

function ControlledRadioInput({
  name,
  label,
  options,
  rules,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  rules?: any;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <div className="space-y-2">
          <Label className="text-[14px] font-semibold">{label}</Label>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="flex gap-14 flex-col md:flex-row justify-start items-center flex-wrap"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {error && (
            <p className="text-red-500 text-xs mt-1">
              {error.message as string}
            </p>
          )}
        </div>
      )}
    />
  );
}

function ControlledFileInput({
  name,
  label,
  placeholder,
  disabled,
  rules,
}: {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  rules?: any;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, ...field } }) => (
        <div className="space-y-1">
          <Label className="text-[14px] font-semibold">{label}</Label>
          <Input
            {...field}
            type="file"
            placeholder={placeholder || `Enter ${label}`}
            className="h-[44px] bg-white cursor-pointer"
            disabled={disabled}
            onChange={(e) => onChange(e.target.files)}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">
              {error.message as string}
            </p>
          )}
        </div>
      )}
    />
  );
}
