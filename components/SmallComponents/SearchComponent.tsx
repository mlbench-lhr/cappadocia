import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const SearchComponent = ({
  searchQuery,
  onChangeFunc,
  width = " w-full sm:w-[325px] ",
  placeholder = "Search...",
  searchButton = false,
  onClickAction,
}: {
  searchQuery: string;
  placeholder?: string;
  width?: string;
  onChangeFunc: React.Dispatch<React.SetStateAction<string>>;
  searchButton?: boolean;
  onClickAction?: any;
}) => {
  return (
    <div
      className={`${width} ${
        searchButton ? "h-[55px]" : "h-[44px]"
      } relative border rounded-[10px] flex items-center justify-start ps-2 text-black/50`}
    >
      <Search className="size-4 md:size-5.5" />
      <Input
        value={searchQuery}
        onChange={(e) => {
          onChangeFunc(e.target.value);
        }}
        className={`w-full ${
          searchButton ? "h-[55px]" : "h-[44px]"
        } border-none absolute top-0 left-0 ps-8 md:ps-10`}
        placeholder={placeholder}
      />
      {searchButton && onClickAction && (
        <Button
          variant={"main_green_button"}
          className={`absolute right-2 top-1/2 -translate-y-1/2 ${
            searchButton && "w-[130px]"
          }`}
          onClick={onClickAction}
        >
          Search
        </Button>
      )}
    </div>
  );
};
