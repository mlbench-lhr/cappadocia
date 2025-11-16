"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An area chart with gradient fill";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#B32053",
  },
} satisfies ChartConfig;

export function ChartAreaGradient() {
  return (
    <div className="w-full p-0 h-full m-0 border-0 px-0 shadow-none ">
      <div className="w-full px-0 h-full ">
        <ChartContainer
          config={chartConfig}
          className="!px-0 !p-0 w-full h-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            className="!p-0 w-full h-full"
            margin={{ left: 0, right: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={0}
              tickFormatter={(value) => value.slice(0, 3)}
              className=""
            />
            <YAxis
              className=""
              tickLine={false}
              axisLine={false}
              tickMargin={20}
              tickCount={3}
              tickFormatter={(value) => "$" + value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs className="">
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
              </linearGradient>
            </defs>
            <Area
              className=""
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
