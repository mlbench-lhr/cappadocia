import { Search } from "lucide-react";
import { Input } from "../ui/input";

export const SearchComponent = ({
  searchQuery,
  onChangeFunc,
  width = " w-full sm:w-[325px] ",
  placeholder = "Search...",
}: {
  searchQuery: string;
  placeholder?: string;
  width?: string;
  onChangeFunc: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div
      className={`${width} h-[44px] relative border rounded-[10px] flex items-center justify-start ps-2 text-black/50`}
    >
      <Search className="size-4 md:size-5.5" />
      <Input
        value={searchQuery}
        onChange={(e) => {
          onChangeFunc(e.target.value);
        }}
        className="w-full h-[44px] border-none absolute top-0 left-0 ps-8 md:ps-10"
        placeholder={placeholder}
      />
    </div>
  );
};
