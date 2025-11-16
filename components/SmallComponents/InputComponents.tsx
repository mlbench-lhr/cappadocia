import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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
        disabled={disabled}
      />
    </div>
  );
};

export const RadioInputComponent = ({ label }: { label: string }) => {
  return (
    <div className="space-y-2 col-span-1">
      <Label className="text-[14px] font-semibold">{label}</Label>
      <RadioGroup
        value={"Add later"}
        onValueChange={(val) => {
          console.log("val-------", val);
        }}
        className="flex gap-14 flex-col md:flex-row justify-start items-center flex-wrap"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Add location now" id="Add location now" />
          <Label htmlFor="Add location now">Add location now</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Add later" id="Add later" />
          <Label htmlFor="Add later">Add later</Label>
        </div>
      </RadioGroup>{" "}
    </div>
  );
};

export const FileInputComponent = ({
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
        type="file"
        placeholder={placeholderTemp}
        className="h-[44px] bg-white cursor-pointer"
        required
        disabled={disabled}
      />
    </div>
  );
};
