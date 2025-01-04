import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LucideProps } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

import { Area, AreaChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  title: string;
  figure: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  isLoading?: boolean;
  recent?: { data: number }[];
};

export default function Figure({
  title,
  figure,
  Icon,
  isLoading = false,
  recent,
}: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {isLoading ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        )}
        <Icon />
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <div className="text-4xl font-bold">{figure}</div>
        )}

        <ChartContainer config={chartConfig} className="aspect-auto h-20">
          <AreaChart accessibilityLayer data={recent}>
            <defs>
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
            </defs>
            <Area
              dataKey="data"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
