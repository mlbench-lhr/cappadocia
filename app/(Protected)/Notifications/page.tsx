"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { useAppDispatch } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import { useCallback, useEffect, useState } from "react";
import { Bell, ChevronLeft, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import notIcon1 from "@/public/notIcon.svg";
import notIcon2 from "@/public/notIcon Milestone.svg";
import Image from "next/image";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Notification {
  name: string;
  type: string;
  endDate: string;
  image: string;
  _id: string;
  createdAt: string;
}

export default function CalendarPage() {
  const events = useAppSelector((state) => state.calendar.events);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  useEffect(() => {
    async function getNot() {
      try {
        setLoading(true);
        let result: { data: Notification[] } = await axios.get(
          "/api/notifications"
        );
        setNotifications(result.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    getNot();
  }, []);
  useEffect(() => {
    async function markRead() {
      try {
        setLoading(true);
        let result: { data: Notification[] } = await axios.put(
          "/api/notifications/markRead"
        );
      } catch (error) {}
    }
    markRead();
  }, []);

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-[100%] flex flex-col gap-[0px] justify-start items-start w-full">
      <div className="md:px-[40px] md:py-[24px] md:rounded-[24px] w-full relative h-full bg-white">
        <div className="flex justify-start gap-[20px] items-start mb-[16px] flex-col h-full">
          <div className="flex justify-start gap-[12px] items-center mb-[16px]">
            <div
              onClick={() => {
                router.back();
              }}
              className="pl-2 cursor-pointer"
            >
              <ChevronLeft />
            </div>
            <h4
              className="font-[500] text-[20px]"
              style={{ textAlign: "start" }}
            >
              Notifications{" "}
            </h4>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4 w-full">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="w-full flex justify-between gap-3 items-center border-b-2 pb-3"
                >
                  <div className="w-full flex justify-start gap-3 items-center">
                    {/* Image skeleton */}
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex flex-col gap-2 w-[60%]">
                      <Skeleton className="h-3 w-[80%]" />
                      <Skeleton className="h-3 w-[40%]" />
                    </div>
                  </div>
                  {/* Close icon skeleton */}
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
              ))}
            </div>
          ) : currentNotifications.length < 1 ? (
            <div className="flex flex-col gap-4 w-full">
              <div className="mx-auto w-full flex justify-center items-center flex-col pt-6 gap-y-2">
                <Bell color="#D8E6DD" size={40} />
                No notification found
              </div>
            </div>
          ) : (
            <>
              <div className="w-full flex justify-start gap-[16px] items-start mb-[16px] flex-col h-full bg-yellow-5">
                {currentNotifications.map((item) => (
                  <NotificationBox item={item} key={item._id} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="w-full flex justify-center items-center py-[20px] border-t border-gray-200">
                  <div className="flex justify-between items-center w-full">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="px-[24px] py-[10px] rounded-[8px] border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-[14px]"
                    >
                      Previous
                    </Button>

                    <span className="text-[14px] font-medium text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="px-[24px] py-[10px] rounded-[8px] border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-[14px]"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const NotificationBox = ({ item }: { item: Notification }) => {
  const [imgSrc, setImgSrc] = useState<string>(
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
  );
  const [deleted, setDeleted] = useState(false);
  useEffect(() => {
    setImgSrc(item.image);
  }, [item.image]);
  console.log("imgSrc--------", imgSrc);

  function deleteNot(_id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B32053",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeleted(true);
          await axios.delete(`/api/notifications/delete/${_id}`);
        } catch (error) {
          console.log("error------", error);
        }
      }
    });
  }
  if (deleted) {
    return null;
  }
  return (
    <div className="w-full flex justify-between gap-[12px] items-center last-of-type:border-b-0 border-b-2 pb-[12px]">
      <div className="flex justify-start gap-[12px] items-center w-[calc(100%-32px)]">
        {typeof imgSrc === "string" ? (
          <Image
            src={imgSrc}
            alt=""
            width={48}
            height={48}
            className="rounded-full overflow-hidden w-[48px] h-[48px]"
            onError={() =>
              setImgSrc(
                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
              )
            }
          />
        ) : (
          <div className="rounded-full overflow-hidden w-[48px] h-[48px] bg-[#B32053] flex justify-center items-center">
            <Image
              src={imgSrc}
              alt=""
              width={24}
              height={24}
              className="rounded-full overflow-hidden w-[24px] h-[24px]"
              onError={() =>
                setImgSrc(
                  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                )
              }
            />
          </div>
        )}
        <div className="w-[calc(100%-60px)] lg:w-[50%] flex justify-start items-start flex-col gap-[5px] line-clamp-2">
          <span className="w-fit lg:w-[100%] leading-[20px] text-[14px]">
            Your {item.type} deadline is{" "}
            {moment(item.endDate).format("MMM DD, YYYY")}. Don’t miss it make
            sure to complete it on time.
          </span>
          <span className="text-[#51606E] text-[12px]">
            {moment(item.createdAt).format("MMM DD, YYYY")}
          </span>
        </div>
      </div>
      <X
        size={20}
        className="cursor-pointer"
        onClick={() => {
          deleteNot(item._id);
        }}
      />
    </div>
  );
};

export const getIcon: any = {
  Internships: "📅",
  Competitions: "🏆",
  Clubs: "🏆",
  "Community Service": "🤝",
  "Summer Program": "🎓",
  milestone: "🤖",
};

export const getColor: any = {
  Internships: "rgba(77, 182, 172, 0.5)",
  Competitions: "rgba(255, 111, 97, 0.5)",
  Clubs: "rgba(77, 182, 172, 0.5)",
  "Community Service": "rgba(179, 157, 219, 0.5)",
  "Summer Program": "rgba(255, 140, 102, 0.5)",
  milestone: "rgba(179, 157, 219, 0.5)",
};
