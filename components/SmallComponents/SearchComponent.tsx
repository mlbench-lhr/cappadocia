import { Search } from "lucide-react";
import { Input } from "../ui/input";

export const SearchComponent = ({
  searchQuery,
  onChangeFunc,
}: {
  searchQuery: string;
  onChangeFunc: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="w-full sm:w-[325px] h-[44px] relative border rounded-[10px] flex items-center justify-start ps-2 text-black/50">
      <Search size={22} />
      <Input
        value={searchQuery}
        onChange={(e) => {
          onChangeFunc(e.target.value);
        }}
        className="w-full h-[44px] border-none absolute top-0 left-0 ps-10"
        placeholder="Search..."
      />
    </div>
  );
};
