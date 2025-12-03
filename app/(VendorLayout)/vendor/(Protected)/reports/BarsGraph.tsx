"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { closeSidebar } from "@/lib/store/slices/sidebarSlice";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMediaQuery } from "react-responsive";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";

export const description = "A bar chart with multiple data series";

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "#B32053",
  },
  revenue: {
    label: "Revenue",
    color: "#DEC3D1",
  },
} satisfies ChartConfig;

export interface BarChartItem {
  tourName: string;
  bookings: number;
  revenue: number;
}

export interface BarChartResponse {
  totalRevenue: number;
  percentageChange: number;
  incremented: boolean;
  chartData: BarChartItem[];
}

export function ChartBarGradient({
  className = " h-full ",
}: {
  className?: string;
}) {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1350 });
  const [data, setData] = useState<BarChartResponse>({
    totalRevenue: 120000,
    percentageChange: 10.2,
    incremented: true,
    chartData: [
      { tourName: "Blue tour", bookings: 186, revenue: 80 },
      { tourName: "Blue tour", bookings: 305, revenue: 200 },
      { tourName: "Blue tour", bookings: 237, revenue: 120 },
      { tourName: "Blue tour", bookings: 73, revenue: 190 },
      { tourName: "Blue tour", bookings: 73, revenue: 190 },
      { tourName: "Blue tour", bookings: 73, revenue: 190 },
      { tourName: "Blue tour", bookings: 214, revenue: 140 },
    ],
  });

  useEffect(() => {
    if (isMobile) dispatch(closeSidebar());
  }, []);

  useEffect(() => {
    const getData = async () => {
      let response = await axios.get("/api/vendor/dashboardBarGraph");
      setData(response.data);
    };
    getData();
  }, []);

  return (
    <BoxProviderWithName
      className={className}
      name="Tour Performance Comparison"
      hFull={true}
    >
      <div className="h-full pb-4 flex flex-col justify-center items-start relative w-full overflow-hidden">
        <div className="w-full p-0 h-[calc(100%-66px)] m-0 border-0 px-0 shadow-none ">
          <div className="w-full px-0 h-full ">
            <ChartContainer
              config={chartConfig}
              className="!px-0 !p-0 w-full h-full"
            >
              <BarChart
                accessibilityLayer
                data={data.chartData}
                className="!p-0 w-full h-full"
                margin={{ left: 0, right: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="tourName"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={0}
                  className=""
                />
                <YAxis
                  className=""
                  tickLine={false}
                  axisLine={false}
                  tickMargin={20}
                  tickCount={3}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="bookings"
                  fill="var(--color-bookings)"
                  radius={4}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
        <div className="w-full h-[50px] flex justify-center items-center gap-5">
          <div className="flex justify-start items-center gap-2">
            <div className="w-6 h-4 bg-[#B32053]"></div>
            <div className="text-sm font-medium">Bookings</div>
          </div>
          <div className="flex justify-start items-center gap-2">
            <div className="w-6 h-4 bg-[#DEC3D1]"></div>
            <div className="text-sm font-medium">Revenue</div>
          </div>
        </div>
      </div>
    </BoxProviderWithName>
  );
}
