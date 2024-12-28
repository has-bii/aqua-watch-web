"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { hourFormat } from "@/lib/date-helper";
import { isSameHour } from "date-fns";

// {
//   "status": "success",
//   "data": {
//     "aquarium_id": "12345",
//     "predictions": ,
//     "averages": {
//       "temperature_avg": 25.0,
//       "pH_level_avg": 7.2,
//       "dissolved_oxygen_avg": 8.3,
//       "clarity_avg": 89.9
//     },
//     "abbreviations": {
//       "temperature": "°C",
//       "pH_level": "pH",
//       "dissolved_oxygen": "mg/L",
//       "clarity": "%"
//     }
//   },
//   "message": "Predictions for temperature, pH level, dissolved oxygen, and clarity retrieved successfully with averages included."
// }

const avg = {
  temperature: 25.0,
  pH_level: 7.2,
  dissolved_oxygen: 8.3,
  clarity: 89.9,
};

const abv = {
  temperature: "°C",
  pH_level: "pH",
  dissolved_oxygen: "mg/L",
  clarity: "%",
};

const chartData = [
  {
    timestamp: "2024-12-28T01:00:00Z",
    temperature: 24.5,
    pH_level: 7.2,
    dissolved_oxygen: 8.5,
    clarity: 92,
  },
  {
    timestamp: "2024-12-28T02:00:00Z",
    temperature: 24.7,
    pH_level: 7.3,
    dissolved_oxygen: 8.4,
    clarity: 93,
  },
  {
    timestamp: "2024-12-28T03:00:00Z",
    temperature: 25.0,
    pH_level: 7.2,
    dissolved_oxygen: 8.3,
    clarity: 91,
  },
  {
    timestamp: "2024-12-28T04:00:00Z",
    temperature: 25.3,
    pH_level: 7.1,
    dissolved_oxygen: 8.2,
    clarity: 90,
  },
  {
    timestamp: "2024-12-28T05:00:00Z",
    temperature: 25.6,
    pH_level: 7.0,
    dissolved_oxygen: 8.0,
    clarity: 89,
  },
  {
    timestamp: "2024-12-28T06:00:00Z",
    temperature: 25.8,
    pH_level: 6.9,
    dissolved_oxygen: 7.9,
    clarity: 88,
  },
  {
    timestamp: "2024-12-28T07:00:00Z",
    temperature: 25.7,
    pH_level: 7.0,
    dissolved_oxygen: 8.0,
    clarity: 87,
  },
  {
    timestamp: "2024-12-28T08:00:00Z",
    temperature: 25.4,
    pH_level: 7.1,
    dissolved_oxygen: 8.1,
    clarity: 88,
  },
  {
    timestamp: "2024-12-28T09:00:00Z",
    temperature: 25.1,
    pH_level: 7.2,
    dissolved_oxygen: 8.3,
    clarity: 89,
  },
  {
    timestamp: "2024-12-28T10:00:00Z",
    temperature: 24.9,
    pH_level: 7.3,
    dissolved_oxygen: 8.4,
    clarity: 90,
  },
  {
    timestamp: "2024-12-28T11:00:00Z",
    temperature: 24.6,
    pH_level: 7.4,
    dissolved_oxygen: 8.5,
    clarity: 91,
  },
  {
    timestamp: "2024-12-28T12:00:00Z",
    temperature: 24.3,
    pH_level: 7.5,
    dissolved_oxygen: 8.6,
    clarity: 92,
  },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  temperature: {
    label: "Temp",
    color: "hsl(var(--chart-1))",
  },
  pH_level: {
    label: "pH Level",
    color: "hsl(var(--chart-2))",
  },
  dissolved_oxygen: {
    label: "Oxygen",
    color: "hsl(var(--chart-3))",
  },
  clarity: {
    label: "Clarity",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function FigureChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("temperature");

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Prediction</CardTitle>
          <CardDescription>
            Showing the predictions for 24 hours
          </CardDescription>
        </div>
        <div className="flex">
          {["temperature", "pH_level", "dissolved_oxygen", "clarity"].map(
            (key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {avg[key as keyof typeof avg].toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {abv[key as keyof typeof avg].toString()}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 6,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                isSameHour(value, new Date()) ? "Now" : hourFormat(value, "k a")
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={chartConfig[activeChart].label}
                  labelFormatter={(value) =>
                    isSameHour(value, new Date())
                      ? "Now"
                      : hourFormat(value, "k a")
                  }
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(v: number) =>
                  `${v} ${abv[activeChart as keyof typeof abv].toString()}`
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
