"use client";

import { Dot } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAppSelector } from "@/lib/store/hooks";

export const description = "An area chart with gradient fill";

const chartConfig = {
  users: {
    label: "Users",
    color: "rgba(90, 210, 166, 0.3)",
  },
  milestones: {
    label: "Milestones",
    color: "#51606E",
  },
} satisfies ChartConfig;

export function ChartAreaGradient() {
  const overview = useAppSelector((s) => s.admin.overview);
  return (
    <Card className="border-none shadow-none p-0">
      <CardHeader className="p-0 flex justify-start leading-[0px] items-center gap-[16px] flex-wrap">
        <span className="text-[16px] md:text-[20px] font-[500]">
          Total Users
        </span>
        <span className="text-[14px] font-[500]">Total Milestones</span>
        <span className="text-[14px] font-[500] text-[#D5DCD6]">|</span>
        <div className="p-0 flex justify-start leading-[0px] items-center gap-[7px]">
          <Dot color="" className="w-[6px] h-[6px] bg-[#B32053] rounded-full" />
          <span className="text-[12px] font-[500]">Total Users</span>
        </div>
        <div className="p-0 flex justify-start leading-[0px] items-center gap-[7px]">
          <Dot color="" className="w-[6px] h-[6px] bg-[#51606E] rounded-full" />
          <span className="text-[12px] font-[500]">Total milestones</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={overview.overview}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={20} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMilestones" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-milestones)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-milestones)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="milestones"
              type="natural"
              fill="transparent"
              stroke="var(--color-milestones)"
              strokeDasharray="4 4"
            />
            <Area
              dataKey="users"
              type="natural"
              fill="url(#fillUsers)"
              stroke="rgba(90, 210, 166, 1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
