"use client"

import { Area, AreaChart, YAxis } from "recharts"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { AquariumData } from "@/types/aquarium-data"
import { format } from "date-fns"

const chartConfig = {
  room_temperature: {
    label: "°C",
    color: "var(--color-green-700)",
  },
  do: {
    label: "mg/L",
    color: "var(--color-blue-700)",
  },
  turbidity: {
    label: "%",
    color: "var(--color-yellow-700)",
  },
  flow_rate: {
    label: "mL/min",
    color: "var(--color-red-700)",
  },
} satisfies ChartConfig

type ChartData = {
  [key in keyof AquariumData]?: number
} & {
  date: string
}

type ParameterChartProps = {
  data: Array<ChartData>
  param: string
}

export function ParameterChart({ data, param }: ParameterChartProps) {
  return (
    <ChartContainer config={chartConfig} className="-mx-4 -mb-3 mt-auto h-24 w-[calc(100%+2rem)]">
      <AreaChart accessibilityLayer data={data}>
        <Area
          dataKey={param}
          type="natural"
          fill="var(--color-green-300)"
          fillOpacity={0.2}
          stroke="var(--color-green-600)"
          strokeWidth={1.5}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              className="w-[150px]"
              formatter={(value, name, item) => (
                <>
                  <div className="text-muted-foreground">
                    <p className="truncate">{format(item.payload.date, "p PP")}</p>
                  </div>
                  <div className="text-foreground font-medium">
                    {value.toString()} {chartConfig[name as keyof typeof chartConfig]?.label || name}
                  </div>
                </>
              )}
            />
          }
        />
        <YAxis hide type="number" domain={["dataMin - 1", "dataMax + 1"]} />
      </AreaChart>
    </ChartContainer>
  )
}
