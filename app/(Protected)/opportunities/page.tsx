"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { ListFilter, Search, Sparkles, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import OpportunitiesCard from "@/components/OpportunitiesCard";
import Image from "next/image";
import noDataIcon from "@/public/no data plant.svg";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { setQueryValue } from "@/lib/store/slices/opportunitySlice";
import Swal from "sweetalert2";

export default function BlogsPage() {
  const filterArray1: string[] = [
    "All Opportunities",
    "Internships",
    "Summer Program",
    "Clubs",
    "Community Service",
    "Competitions",
  ];
  const [filter1Value, setFilter1Value] = useState("All Opportunities");
  const [refreshFilter, setRefreshFilter] = useState<number>(0);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const opportunitiesFromRedux = useAppSelector(
    (s) => s.opportunity.opportunities
  );
  const searchParams = useSearchParams();
  const queryValue = useAppSelector((s) => s.opportunity.queryValue);
  const searchPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, [isMobile, dispatch]);

  const filterArray2: string[] = [
    "Saved Opportunities",
    "Ignored Opportunities",
  ];
  const [filter2Value, setFilter2Value] = useState("all");

  const [opportunities, setOpportunities] = useState<any[]>([]);
  useEffect(() => {
    if (opportunitiesFromRedux?.length > 0) {
      setOpportunities(opportunitiesFromRedux);
    }
  }, []);
  const [loading, setLoading] = useState(!queryValue);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [openFilterSidebar, setOpenFilterSidebar] = useState(false);

  // Updated state for single selection
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedFavorite, setSelectedFavorite] = useState<string>("");
  const [selectedPriceType, setSelectedPriceType] = useState<string>("");
  const [showSearchedLinks, setShowSearchedLinks] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const showSearchButton: Boolean = useMemo(() => {
    console.log("mount");
    if (
      selectedFormat ||
      selectedLocation ||
      selectedFavorite ||
      selectedPriceType ||
      showSearchedLinks ||
      searchInput ||
      filter1Value !== "All Opportunities"
    ) {
      return true;
    } else {
      return false;
    }
  }, [
    selectedFormat,
    selectedLocation,
    selectedFavorite,
    selectedPriceType,
    showSearchedLinks,
    searchInput,
    filter1Value,
  ]);
  // For search suggestions
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchPopupRef.current &&
        !searchPopupRef.current.contains(event.target as Node)
      ) {
        setShowSearchedLinks(false);
      }
    };

    if (showSearchedLinks) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchedLinks]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filter1Value,
    filter2Value,
    selectedFormat,
    selectedLocation,
    selectedFavorite,
    selectedPriceType,
    searchQuery,
  ]);

  // Fetch opportunities with filters and pagination
  useEffect(() => {
    const fetchOpportunities = async () => {
      if (isFirstLoad) {
        setLoading(true);
      }
      try {
        // Build query params
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        // Add filters
        if (filter1Value && filter1Value !== "All Opportunities") {
          params.append("category", filter1Value);
        }

        // Map filter2Value to backend parameter
        if (filter2Value === "Saved Opportunities") {
          params.append("savedIgnored", "saved");
        } else if (filter2Value === "Ignored Opportunities") {
          params.append("savedIgnored", "ignored");
        } else {
          params.append("savedIgnored", "all");
        }

        if (selectedFormat) {
          params.append("format", selectedFormat);
        }

        if (selectedLocation) {
          params.append("location", selectedLocation);
        }

        if (selectedFavorite) {
          params.append("favorite", selectedFavorite);
        }

        if (selectedPriceType) {
          params.append("priceType", selectedPriceType);
        }

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        console.log("this--------", params.toString());
        const res = await axios.get(`/api/opportunities?${params.toString()}`);

        setOpportunities(res.data.opportunities || []);
        setTotalPages(res.data.pagination?.totalPages || 0);
        setTotalCount(res.data.pagination?.totalCount || 0);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
        setOpportunities([]);
        setTotalPages(0);
        setTotalCount(0);
      } finally {
        if (isFirstLoad) {
          setLoading(false);
          setIsFirstLoad(false);
        }
      }
    };

    if (!queryValue) {
      fetchOpportunities();
    } else {
      dispatch(setQueryValue(false));
    }
  }, [
    refreshFilter,
    currentPage,
    filter1Value,
    filter2Value,
    selectedFormat,
    selectedLocation,
    selectedFavorite,
    selectedPriceType,
    searchQuery,
  ]);

  // Fetch search suggestions (without pagination)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchInput.trim()) {
        setSearchSuggestions([]);
        return;
      }

      try {
        const params = new URLSearchParams({
          search: searchInput,
          limit: "5", // Limit suggestions to 5
          page: "1",
          savedIgnored: "all",
        });

        const res = await axios.get(`/api/opportunities?${params.toString()}`);
        setSearchSuggestions(res.data.opportunities || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSearchSuggestions([]);
      }
    };
    if (!queryValue) {
      const timeoutId = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setQueryValue(false);
    }
  }, [searchInput]);

  function searchByQuery() {
    setSearchQuery(searchInput);
    setShowSearchedLinks(false);
  }
  async function searchAiOpportunities() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (filter1Value && filter1Value !== "All Opportunities") {
        params.append("category", filter1Value);
      }
      if (selectedFormat) {
        params.append("format", selectedFormat);
      }
      if (selectedLocation) {
        params.append("location", selectedLocation);
      }
      if (selectedPriceType) {
        params.append("priceType", selectedPriceType);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      console.log("this--------", params.toString());
      const res = await axios.get(
        `/api/opportunities/search?${params.toString()}`
      );
      setOpportunities(res.data.savedOpportunities);
      setTotalPages(res.data.pagination?.totalPages || 0);
      setTotalCount(res.data.pagination?.totalCount || 0);
      console.log("res-------", res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to search opportunities.",
        text: "The model is overloaded. Please try again later.",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  }

  function searchTyping(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    setShowSearchedLinks(true);
  }

  return (
    <div className="flex flex-col gap-[24px] justify-start items-start w-full section-box-1 bg-white px-[0px] md:px-[40px] py-[24px] md:py-[24px]">
      <h5 className="heading-text-style-4">Opportunities</h5>

      {/* Search bar */}
      <div
        className="flex justify-between items-center w-full relative"
        ref={searchPopupRef}
      >
        <div className="w-full flex justify-between gap-2 items-center">
          <div className="relative w-full md:w-[600px] h-fit">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              value={searchInput}
              onChange={searchTyping}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchByQuery();
                }
              }}
              placeholder="Search opportunities (title, institute, description, majors)"
              className="w-full input-style"
              style={{ paddingLeft: "50px" }}
            />
          </div>
          {showSearchButton && (
            <Button
              variant={"main_green_button"}
              size="lg"
              className="hidden lg:flex "
              onClick={searchAiOpportunities}
              loading={loading}
            >
              <Sparkles />
              Search
            </Button>
          )}
          <Button
            variant={"main_green_button"}
            size="lg"
            className="block lg:hidden"
            onClick={() => setOpenFilterSidebar(true)}
          >
            <ListFilter />
          </Button>
        </div>
        {searchSuggestions?.length > 0 && showSearchedLinks && (
          <div
            className="w-full max-h-[300px] box-shadows-2 border-b-[24px] border-r-[30px] border-white shadow-2 overflow-auto absolute top-[50px] flex flex-col justify-start items-center gap-2 bg-white z-50"
            style={{ paddingTop: "12px", paddingLeft: "30px" }}
          >
            {searchSuggestions?.map((item) => (
              <OpportunitySearchCard item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Filter buttons group 1 */}
      <div className="flex justify-start items-center w-full gap-[16px] overflow-auto no-scrollbar">
        {filterArray1.map((item) => (
          <Button
            key={item}
            variant={
              item === filter1Value
                ? "main_green_button"
                : "secondary_plane_button"
            }
            className="w-fit"
            size="lg"
            onClick={() =>
              setFilter1Value((prev) => {
                return prev === item ? "All Opportunities" : item;
              })
            }
            style={{ flex: "none" }}
          >
            {item}
          </Button>
        ))}
      </div>

      {/* Mobile filter sidebar */}
      {openFilterSidebar && (
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-white flex flex-col justify-start items-center gap-[24px] mt-[24px] px-[20px] z-[100] overflow-auto">
          <div className="w-full flex justify-between items-center sticky top-0 bg-white py-4">
            <span className="font-[500] text-[20px]">Filter</span>
            <X onClick={() => setOpenFilterSidebar(false)} />
          </div>
          <div className="flex-col flex md:hidden justify-start items-start w-full gap-[16px] flex-wrap">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              {/* Format */}
              <div className="flex justify-start gap-[16px] items-start col-span-1 flex-col">
                <Label className=" block">Format</Label>
                <div className="flex gap-6 w-[100%]">
                  {["Online", "In-Person"].map((format) => (
                    <label
                      key={format}
                      className="w-[40%] flex items-center gap-2"
                    >
                      <Checkbox
                        checked={selectedFormat === format}
                        onCheckedChange={(checked) =>
                          setSelectedFormat(checked ? format : "")
                        }
                      />
                      <span>{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="flex justify-start gap-[16px] items-start col-span-1 flex-col">
                <Label className=" block">Location:</Label>
                <div className="flex gap-6 w-[100%]">
                  {["Local", "Anywhere"].map((loc) => (
                    <label
                      key={loc}
                      className="w-[40%] flex items-center gap-2"
                    >
                      <Checkbox
                        checked={selectedLocation === loc}
                        onCheckedChange={(checked) =>
                          setSelectedLocation(checked ? loc : "")
                        }
                      />
                      <span>{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Favorites */}
              {/* <div className="flex justify-start gap-[16px] items-start col-span-1 flex-col">
                <Label className=" block">Favorites:</Label>
                <div className="flex gap-6 w-[100%]">
                  {["All", "Saved"].map((fav) => (
                    <label
                      key={fav}
                      className="w-[40%] flex items-center gap-2"
                    >
                      <Checkbox
                        checked={selectedFavorite === fav}
                        onCheckedChange={(checked) =>
                          setSelectedFavorite(checked ? fav : "")
                        }
                      />
                      <span>{fav}</span>
                    </label>
                  ))}
                </div>
              </div> */}

              {/* Price Type */}
              <div className="flex justify-start gap-[16px] items-start col-span-1 flex-col">
                <Label className=" block">Price Type:</Label>
                <div className="flex gap-6 w-[100%]">
                  {["Free", "paid"].map((p) => (
                    <label key={p} className="w-[40%] flex items-center gap-2">
                      <Checkbox
                        checked={selectedPriceType === p}
                        onCheckedChange={(checked) =>
                          setSelectedPriceType(checked ? p : "")
                        }
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop checkbox filters */}
      <div className="flex-col hidden md:flex justify-start items-start w-full gap-[16px] flex-wrap">
        <h2 className="heading-text-style-5">Filter By:</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Format */}
          <div className="flex justify-start gap-[12px] items-center col-span-1 flex-wrap">
            <Label className=" block">Format:</Label>
            <div className="flex gap-6">
              {["Online", "In-Person"].map((format) => (
                <label key={format} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedFormat === format}
                    onCheckedChange={(checked) =>
                      setSelectedFormat(checked ? format : "")
                    }
                  />
                  <span>{format}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="flex justify-start gap-[12px] items-center col-span-1">
            <Label className=" block">Location:</Label>
            <div className="flex gap-6">
              {["Local", "Anywhere"].map((loc) => (
                <label key={loc} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedLocation === loc}
                    onCheckedChange={(checked) =>
                      setSelectedLocation(checked ? loc : "")
                    }
                  />
                  <span>{loc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Favorites */}
          {/* <div className="flex justify-start gap-[12px] items-center col-span-1">
            <Label className=" block">Favorites:</Label>
            <div className="flex gap-6">
              {["All", "Saved"].map((fav) => (
                <label key={fav} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedFavorite === fav}
                    onCheckedChange={(checked) =>
                      setSelectedFavorite(checked ? fav : "")
                    }
                  />
                  <span>{fav}</span>
                </label>
              ))}
            </div>
          </div> */}

          {/* Price Type */}
          <div className="flex justify-start gap-[12px] items-center col-span-1">
            <Label className=" block">Price Type:</Label>
            <div className="flex gap-6">
              {["Free", "paid"].map((p) => (
                <label key={p} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedPriceType === p}
                    onCheckedChange={(checked) =>
                      setSelectedPriceType(checked ? p : "")
                    }
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter buttons group 2 */}
      <div className="flex justify-start items-center w-full gap-[16px] overflow-auto">
        {filterArray2.map((item) => (
          <Button
            key={item}
            variant={
              item === filter2Value
                ? "main_green_button"
                : "secondary_plane_button"
            }
            className="w-fit"
            style={{ flex: "none" }}
            size="lg"
            onClick={() =>
              setFilter2Value((prev) => {
                return prev === item ? "all" : item;
              })
            }
          >
            {item}
          </Button>
        ))}
      </div>

      {/* Opportunities list */}
      {loading ? (
        <div className="w-full h-full flex justify-center items-start mt-[16px]">
          <div className="flex justify-start items-center gap-[12px] flex-col">
            Loading...
          </div>
        </div>
      ) : opportunities?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {opportunities.map((item, index) => (
              <OpportunitiesCard
                key={index}
                {...item}
                setRefreshFilter={setRefreshFilter}
                filter2Value={
                  filter2Value as
                    | "Saved Opportunities"
                    | "Ignored Opportunities"
                }
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <Pagination className="w-full p-0">
              <PaginationContent className="relative w-full flex justify-center items-center">
                <PaginationItem className="absolute left-1 sm:left-8">
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum =
                    totalPages <= 5
                      ? i + 1
                      : currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                      ? totalPages - 4 + i
                      : currentPage - 2 + i;

                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationEllipsis />
                )}

                <PaginationItem className="absolute right-1 sm:right-5">
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-start mt-[16px]">
          <div className="flex justify-start items-center gap-[12px] flex-col">
            <Image src={noDataIcon} width={60} height={60} alt="" />
            No Opportunity Found
          </div>
        </div>
      )}
    </div>
  );
}

const OpportunitySearchCard = ({ item }: any) => {
  const [imgSrc, setImgSrc] = useState(
    item?.image ||
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
  );
  useEffect(() => {
    setImgSrc(
      item?.image ||
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
    );
  }, [item?.image]);

  return (
    <Link
      key={item?._id}
      href={`/opportunities/detail/${item?._id}`}
      className="w-full flex justify-start gap-[16px] items-center hover:bg-gray-50 p-2 rounded"
    >
      <div className="rounded-full overflow-hidden w-[40px] h-[40px]">
        <Image
          src={imgSrc}
          width={40}
          height={40}
          alt={""}
          className="w-[40px] h-[40px]"
          onError={() =>
            setImgSrc(
              "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
            )
          }
        />
      </div>
      <div className="flex justify-start gap-[8px] flex-col items-start font-[400] text-[14px] md:text-[16px]">
        {item?.title}
      </div>
    </Link>
  );
};
