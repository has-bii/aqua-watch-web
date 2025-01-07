"use client";

import React from "react";
import { useGetHistory } from "@/hooks/history";
import { createClient } from "@/utils/supabase/client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { format } from "date-fns";
import { dateFormat } from "@/lib/date-helper";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  params: Promise<{ ecosystem_slug: string; id: string }>;
};

export default function HistoryPage({ params }: Props) {
  const { id: env_id } = React.use(params);
  const supabase = createClient();
  const [date, setDate] = React.useState<Date>(new Date());
  const { data } = useGetHistory(supabase, env_id, date);

  const domain = React.useMemo(() => {
    if (data === undefined) return [0, 50];

    return [
      Math.min(...data.map((v) => v.temp)) - 3,
      Math.max(...data.map((v) => v.temp)) + 3,
    ];
  }, [data]);

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="flex-row justify-between space-y-0">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>Temperature History</CardTitle>
            <CardDescription>
              Showing temperature trend at {dateFormat(date ?? new Date())}
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => setDate(day!)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-64 w-full"
          >
            <AreaChart
              accessibilityLayer
              data={data ?? []}
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
                tickFormatter={(value: number) => `${value.toFixed(0)}°C`}
                type="number"
                domain={domain}
              />
              <XAxis
                dataKey="created_at"
                axisLine={false}
                tickMargin={8}
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
              <Area
                dataKey="temp"
                type="natural"
                fill="var(--color-desktop)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
