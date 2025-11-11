"use client";
import moment from "moment";
import { useEffect, useState } from "react";

interface AnnotationData {
  date: string;
  value: number;
}

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  verifiedUsers: number;
  projectCompletionRate: number;
  userVerificationRate: number;
}

export const SimpleBarChart = ({
  data,
  isLoading,
}: {
  data: AnnotationData[];
  isLoading: boolean;
}) => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter out data points with 0 values when all values are 0
  const hasAnyData = data.some((d) => d.value > 0);
  const displayData = hasAnyData
    ? data
    : data.slice(0, Math.min(5, data?.length)); // Show max 5 empty bars

  const maxValue = Math.max(...displayData.map((d) => d.value), 1); // Ensure minimum of 1 for scaling

  const getBarHeight = (value: number) => {
    if (windowWidth === null) return 0;
    const height = windowWidth < 640 ? 120 : windowWidth < 768 ? 140 : 180;
    // For empty data, show minimal height
    if (value === 0) return 4;
    return (value / maxValue) * height;
  };

  const getLabel = (name: string) => {
    if (windowWidth === null) return "";
    return windowWidth < 640 ? name.split(" ")[1] || name : name;
  };

  // Fixed Y-axis labels
  const yAxisLabels = ["80", "60", "40", "20", "0"];

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[300px] md:h-[100%] items-end justify-start relative">
      {/* Y-axis labels */}
      <div className="flex flex-col justify-between text-[10px] md:text-xs text-gray-500 flex-shrink-0 h-[80%] absolute left-0 w-full">
        {yAxisLabels.map((label, index) => (
          <div
            key={index}
            className="flex items-center h-fit w-full justify-between"
          >
            <span className="leading-none w-[20px] h-[20px] tex-[14px] text-[#51606E] font-[500]">
              {label}
            </span>
            <div className="border-t-2 border-dashed w-[calc(100%-30px)] h-[30px]"></div>
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="flex-1 min-w-0 relative h-full ps-[20px]">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {yAxisLabels.map((_, index) => (
            <div key={index} className="opacity-50 w-full"></div>
          ))}
        </div>

        <div
          className="flex items-end justify-between px-0 md:px-4 space-x-2"
          style={{
            height: "100%",
          }}
        >
          {displayData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center h-full justify-end"
              style={{ width: "40px" }}
            >
              <div className="w-6 flex flex-col items-center">
                <div
                  className={`w-full rounded-t-md ${"bg-[#B32053]"}`}
                  style={{
                    height: `${getBarHeight(item.value)}px`,
                    transition: "height 0.3s ease",
                  }}
                />
                <span className="h-fit md:h-[30px] text-[10px] md:text-xs text-gray-500 font-[500] w-[80px] text-center">
                  {moment(item.date).format("MMM DD")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
