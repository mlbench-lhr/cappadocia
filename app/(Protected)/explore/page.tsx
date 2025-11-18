"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { Button } from "@/components/ui/button";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import { ChevronDown } from "lucide-react";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TourAndActivityCard } from "@/components/TourAndActivityCard";

export type DashboardCardProps = {
  image: string;
  title: string;
  description: string;
};

export type UpComingReservationsProps = {
  image: string;
  title: string;
  date: Date;
  adultCount: number;
  childCount: number;
  bookingId: string;
  status: "Paid" | "Pending";
  _id: string;
};

export type exploreProps = {
  image: string;
  title: string;
  rating: number;
  groupSize: number;
  price: number;
  pickupAvailable: Boolean;
  _id: string;
  vendorDetails: {
    title: string;
    tursabNumber: number;
    image: string;
  };
};

const exploreData: exploreProps[] = [
  {
    image: "/userDashboard/img8.png",
    title: "Sunset ATV Safari Tour",
    rating: 4.5,
    groupSize: 20,
    price: 465,
    pickupAvailable: true,
    _id: "0",
    vendorDetails: {
      image: "/userDashboard/img8.png",
      title: "SkyView Balloon Tours",
      tursabNumber: 12345,
    },
  },
  {
    image: "/userDashboard/img4.png",
    title: "Sunrise Hot Air Balloon Ride",
    rating: 4.5,
    groupSize: 20,
    price: 120,
    pickupAvailable: true,
    _id: "1",
    vendorDetails: {
      image: "/userDashboard/img8.png",
      title: "SkyView Balloon Tours",
      tursabNumber: 12345,
    },
  },
  {
    image: "/userDashboard/img2.png",
    title: "Sunset ATV Safari Tour",
    rating: 3.9,
    groupSize: 20,
    price: 250,
    pickupAvailable: true,
    _id: "2",
    vendorDetails: {
      image: "/userDashboard/img8.png",
      title: "SkyView Balloon Tours",
      tursabNumber: 12345,
    },
  },
  {
    image: "/userDashboard/img9.png",
    title: "Sunrise Hot Air Balloon Ride",
    rating: 4.8,
    groupSize: 20,
    price: 95,
    pickupAvailable: true,
    _id: "3",
    vendorDetails: {
      image: "/userDashboard/img8.png",
      title: "SkyView Balloon Tours",
      tursabNumber: 12345,
    },
  },
];
type DurationFilter = { duration: { from: Date | null; to: Date | null } };
type PriceRangeFilter = {
  priceRange: { min: number | null; max: number | null };
};
type RatingFilter = { rating: number };

export default function ExplorePage({
  type = "both",
}: {
  type: "both" | "tour" | "activity";
}) {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<
    ("all" | DurationFilter | PriceRangeFilter | RatingFilter)[]
  >(["all"]);
  console.log("filters-------", filters);
  const [durationOpen, setDurationOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [tempFrom, setTempFrom] = useState<Date | null>(null);
  const [tempTo, setTempTo] = useState<Date | null>(null);
  const [tempMinPrice, setTempMinPrice] = useState<number | "">("");
  const [tempMaxPrice, setTempMaxPrice] = useState<number | "">("");
  const [tempRating, setTempRating] = useState<number | null>(null);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);
  const removeFilterKind = (kind: "duration" | "priceRange" | "rating") => {
    setFilters((prev) =>
      prev.filter(
        (f) =>
          typeof f === "string" ||
          (kind === "duration" && !("duration" in (f as any))) ||
          (kind === "priceRange" && !("priceRange" in (f as any))) ||
          (kind === "rating" && !("rating" in (f as any)))
      )
    );
  };
  const applyDurationFilter = (from: Date | null, to: Date | null) => {
    removeFilterKind("duration");
    if (from || to) {
      setFilters((p) => [
        ...p.filter((x) => x !== "all"),
        { duration: { from, to } },
      ]);
      setFilters((p) =>
        p.filter((x, i, arr) => !(x === "all" && arr.length > 1))
      );
    } else {
      setFilters(["all"]);
    }
  };

  const applyPriceFilter = (min: number | null, max: number | null) => {
    removeFilterKind("priceRange");
    if (min != null || max != null) {
      setFilters((p) => [
        ...p.filter((x) => x !== "all"),
        { priceRange: { min, max } },
      ]);
      setFilters((p) =>
        p.filter((x, i, arr) => !(x === "all" && arr.length > 1))
      );
    } else {
      if (filters.length === 0) setFilters(["all"]);
    }
  };
  const applyRatingFilter = (rating: number | null) => {
    removeFilterKind("rating");
    if (rating != null) {
      setFilters((p) => [...p.filter((x) => x !== "all"), { rating }]);
      setFilters((p) =>
        p.filter((x, i, arr) => !(x === "all" && arr.length > 1))
      );
    } else {
      if (filters.length === 0) setFilters(["all"]);
    }
  };
  const clearAllFilters = () => {
    setFilters(["all"]);
    setTempFrom(null);
    setTempTo(null);
    setTempMinPrice("");
    setTempMaxPrice("");
    setTempRating(null);
  };

  const isAllActive = filters.includes("all");
  const isDurationActive = filters.some(
    (f) => typeof f === "object" && "duration" in (f as any)
  );
  const isPriceActive = filters.some(
    (f) => typeof f === "object" && "priceRange" in (f as any)
  );
  const isRatingActive = filters.some(
    (f) => typeof f === "object" && "rating" in (f as any)
  );

  return (
    <BasicStructureWithName
      name={
        type === "both" ? "Explore Cappadocia" : "Explore Cappadocia " + type
      }
      showBackOption
      rightSideComponent={
        <SearchComponent
          searchQuery={searchQuery}
          onChangeFunc={setSearchQuery}
        />
      }
    >
      <div className="flex flex-col justify-start items-start w-full gap-3 h-fit">
        <div className="flex justify-start items-start w-full gap-1.5 h-fit flex-wrap md:flex-nowrap">
          <div
            onClick={() => clearAllFilters()}
            className={`cursor-pointer ${
              isAllActive ? " bg-secondary text-primary" : "border"
            } px-2.5 sm:px-4 py-1.5 sm:py-3 leading-tight rounded-[14px] text-[12px] font-medium`}
          >
            All
          </div>

          {/* Duration */}
          <Popover open={durationOpen} onOpenChange={setDurationOpen}>
            <PopoverTrigger asChild>
              <div
                className={`cursor-pointer ${
                  isDurationActive ? " bg-secondary text-primary" : "border"
                } px-2.5 sm:px-4 py-1.5 sm:py-3 leading-tight rounded-[14px] text-[12px] font-medium flex justify-between items-center gap-2`}
              >
                Duration
                <ChevronDown size={16} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-4 relative md:absolute left-2 md:left-0">
              <div className="space-y-2">
                <Label className="text-sm">Choose date range</Label>
                <DateRangePicker
                  value={{ from: tempFrom, to: tempTo }}
                  onChange={(val: { from: Date | null; to: Date | null }) => {
                    console.log("val", val);
                    setTempFrom(val.from ?? null);
                    setTempTo(val.to ?? null);
                  }}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      applyDurationFilter(tempFrom, tempTo);
                      setDurationOpen(false);
                      // remove 'all' if present
                      setFilters((p) => p.filter((x) => x !== "all"));
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Price Range */}
          <Popover open={priceOpen} onOpenChange={setPriceOpen}>
            <PopoverTrigger asChild>
              <div
                className={`cursor-pointer ${
                  isPriceActive ? " bg-secondary text-primary" : "border"
                } px-2.5 sm:px-4 py-1.5 sm:py-3 leading-tight rounded-[14px] text-[12px] font-medium flex justify-between items-center gap-2`}
              >
                Price Range
                <ChevronDown size={16} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-sm">Min</Label>
                    <Input
                      className="text-sm"
                      value={tempMinPrice === "" ? "" : String(tempMinPrice)}
                      onChange={(e) => {
                        const v = e.target.value;
                        setTempMinPrice(v === "" ? "" : Number(v));
                      }}
                      placeholder="e.g. 50"
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Max</Label>
                    <Input
                      className="text-sm"
                      value={tempMaxPrice === "" ? "" : String(tempMaxPrice)}
                      onChange={(e) => {
                        const v = e.target.value;
                        setTempMaxPrice(v === "" ? "" : Number(v));
                      }}
                      placeholder="e.g. 500"
                      type="number"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      const min =
                        tempMinPrice === "" ? null : Number(tempMinPrice);
                      const max =
                        tempMaxPrice === "" ? null : Number(tempMaxPrice);
                      applyPriceFilter(min, max);
                      setPriceOpen(false);
                      setFilters((p) => p.filter((x) => x !== "all"));
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Rating */}
          <Popover open={ratingOpen} onOpenChange={setRatingOpen}>
            <PopoverTrigger asChild>
              <div
                className={`cursor-pointer ${
                  isRatingActive ? " bg-secondary text-primary" : "border"
                } px-2.5 sm:px-4 py-1.5 sm:py-3 leading-tight rounded-[14px] text-[12px] font-medium flex justify-between items-center gap-2`}
              >
                Rating
                <ChevronDown size={16} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-4">
              <div className="space-y-2">
                <Label className="text-sm">Minimum rating</Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="text-sm"
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={tempRating ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTempRating(v === "" ? null : Number(v));
                    }}
                    placeholder="e.g. 4.0"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      applyRatingFilter(tempRating);
                      setRatingOpen(false);
                      setFilters((p) => p.filter((x) => x !== "all"));
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <BoxProviderWithName className="">
          <div className="w-full space-y-0">
            {(type === "both" || type === "tour") && (
              <BoxProviderWithName
                noBorder={true}
                name="Popular Tours"
                rightSideLink={type === "both" ? "/explore/tour" : undefined}
                rightSideLabel="View All Tours"
              >
                <div className="w-full space-y-3 grid grid-cols-12 gap-3">
                  {exploreData.map((item) => (
                    <TourAndActivityCard item={item} />
                  ))}
                </div>
              </BoxProviderWithName>
            )}
            {(type === "both" || type === "activity") && (
              <BoxProviderWithName
                className="!py-0"
                noBorder={true}
                name="Popular Activities"
                rightSideLink={
                  type === "both" ? "/explore/activity" : undefined
                }
                rightSideLabel="View All Activities"
              >
                <div className="w-full space-y-3 grid grid-cols-12 gap-3">
                  {exploreData.map((item) => (
                    <TourAndActivityCard item={item} />
                  ))}
                </div>
              </BoxProviderWithName>
            )}
          </div>
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
