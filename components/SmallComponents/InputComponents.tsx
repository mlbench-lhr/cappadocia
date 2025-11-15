import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

export const SelectInputComponent = ({
  label,
  placeholder,
  options,
}: {
  label: string;
  placeholder: string;
  options: string[] | number[];
}) => {
  return (
    <div className="space-y-1 col-span-1">
      <Label className="text-[14px] font-semibold">{label}</Label>
      <Select>
        <SelectTrigger className="w-full" style={{ height: "44px" }}>
          {placeholder}
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
}: {
  label: string;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const placeholderTemp = placeholder || "Enter " + label;
  return (
    <div className="space-y-1 col-span-1">
      <Label className="text-[14px] font-semibold">{label}</Label>
      <Input
        placeholder={placeholderTemp}
        className="h-[44px] bg-white"
        required
        disabled
      />
    </div>
  );
};
