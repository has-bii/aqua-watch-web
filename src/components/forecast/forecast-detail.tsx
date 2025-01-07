import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetPrediction } from "@/hooks/prediction";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  env_id: string;
};

export default function ForecastDetail({ env_id }: Props) {
  const { data: predictions } = useGetPrediction(env_id);

  if (predictions)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detailed Forecast</CardTitle>
          <CardDescription>
            Showing the forecast for the next 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-auto h-64 w-full"
            config={chartConfig}
          >
            <AreaChart
              accessibilityLayer
              data={predictions?.data?.predictions ?? []}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <YAxis
                dataKey="temperature"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value: number) => `${value.toFixed(2)}°C`}
                type="number"
              />
              <XAxis
                dataKey="timestamp"
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) =>
                  format(new Date(value).toLocaleString(), "p")
                }
                minTickGap={10}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      format(new Date(value).toLocaleString(), "p")
                    }
                    hideIndicator
                  />
                }
              />
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
                dataKey="temperature"
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

  return <Skeleton className="h-64 w-full rounded-xl" />;
}
