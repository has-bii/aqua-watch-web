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
  if (!isLoading)
    return (
      <Card className="flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="">
            <div className="text-3xl font-bold">{figure}</div>
            <div className="text-xs text-muted-foreground">Last one hour</div>
          </div>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-16 w-full"
          >
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
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );

  return <Skeleton className="h-48 w-full" />;
}
