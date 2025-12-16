"use client";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useEffect, useState } from "react";
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { SearchComponent } from "@/components/SmallComponents/SearchComponent";
import CompletedBookings from "./CompletedBookings";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";
import SubmittedReviews from "./SubmittedReviews";
import { Button } from "@/components/ui/button";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"reviews" | "bookings">("reviews");

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  return (
    <BasicStructureWithName name="Reviews" showBackOption>
      <div className="flex flex-col justify-start items-start w-full gap-0 md:gap-3 h-fit">
        <BoxProviderWithName
          noBorder={true}
          leftSideComponent={
            <div className="w-fit flex justify-start items-center gap-2">
              <div className=" flex justify-start items-center gap-2">
                <Button
                  className={`h-[36px] md:h-[44px] ${
                    activeTab === "reviews"
                      ? "bg-secondary text-primary hover:bg-secondary"
                      : "bg-white text-black/70 border hover:bg-white"
                  } font-semibold  text-xs md:text-base !rounded-2xl `}
                  onClick={() => {
                    setActiveTab("reviews");
                  }}
                >
                  Submitted Reviews
                </Button>
                <Button
                  className={`h-[36px] md:h-[44px]  ${
                    activeTab === "bookings"
                      ? "bg-secondary text-primary hover:bg-secondary"
                      : "bg-white text-black/70 border hover:bg-white"
                  } font-semibold  text-xs md:text-base !rounded-2xl `}
                  onClick={() => {
                    setActiveTab("bookings");
                  }}
                >
                  Completed Bookings
                </Button>
              </div>
            </div>
          }
          rightSideComponent={
            <SearchComponent
              placeholder={
                activeTab === "bookings"
                  ? "Search by invoice id..."
                  : "Search by title..."
              }
              width=" w-full md:w-[325px] "
              searchQuery={searchQuery}
              onChangeFunc={setSearchQuery}
            />
          }
        >
          {activeTab === "reviews" ? (
            <SubmittedReviews searchQuery={searchQuery} />
          ) : (
            <CompletedBookings searchQuery={searchQuery} />
          )}
        </BoxProviderWithName>
      </div>
    </BasicStructureWithName>
  );
}
