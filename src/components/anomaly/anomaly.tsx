"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TPrediction } from "@/hooks/prediction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isSameDay, isSameHour } from "date-fns";
import { dateFormat, hourFormat } from "@/lib/date-helper";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  data: TPrediction["data"]["anomalies"];
  children: React.ReactNode;
};

export default function Anomaly({ data, children }: Props) {
  const formatDate = React.useCallback(
    (start_date: string, end_date: string): string => {
      return `${isSameDay(end_date, start_date) ? dateFormat(start_date) : `${dateFormat(start_date)} - ${dateFormat(start_date)}`} ${isSameHour(start_date, end_date) ? `(${hourFormat(start_date, "p")})` : `(${hourFormat(start_date, "p")}-${hourFormat(end_date, "p")})`}`;
    },
    [],
  );

  const [selected, setSelected] = React.useState(
    data.length === 0
      ? undefined
      : formatDate(data[0].start_time, data[0].end_time),
  );

  const selectedData = React.useMemo(() => {
    return (
      data.find((d) => selected === formatDate(d.start_time, d.end_time))
        ?.data ?? []
    );
  }, [selected, data, formatDate]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-full space-y-4">
        <DialogHeader>
          <DialogTitle>Review Anomalies Detected</DialogTitle>
          <DialogDescription>
            These anomalies are unusual measurements in the aquarium’s
            environment. Review the details below to determine whether they need
            to be addressed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full items-center justify-between">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>

            <SelectContent>
              {data.map((d, i) => (
                <SelectItem
                  key={i}
                  value={formatDate(d.start_time, d.end_time)}
                >
                  {formatDate(d.start_time, d.end_time)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ChartContainer
          className="aspect-auto h-64 w-full"
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={selectedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              dataKey="temp"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value: number) => `${value.toFixed(2)}°C`}
              type="number"
            />
            <XAxis
              dataKey="date_time"
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
              dataKey="temp"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </DialogContent>
    </Dialog>
  );
}
