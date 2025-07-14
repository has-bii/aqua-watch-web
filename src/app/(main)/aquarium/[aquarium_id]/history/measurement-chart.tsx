"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, isDate } from "date-fns"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Database } from "@/types/database"

// Chart configuration for different measurement parameters
const CHART_CONFIG = {
  room_temperature: {
    label: "Room Temperature",
    color: "var(--chart-1)",
  },
  water_temperature: {
    label: "Water Temperature",
    color: "var(--chart-2)",
  },
  ph: {
    label: "pH",
    color: "var(--chart-3)",
  },
  do: {
    label: "Dissolved Oxygen",
    color: "var(--chart-4)",
  },
} as const satisfies ChartConfig

// Type definitions
type MeasurementRow = Database["public"]["Tables"]["measurements"]["Row"]
type MeasurementParam = keyof Pick<MeasurementRow, "water_temperature" | "room_temperature" | "ph" | "do">

interface MeasurementChartProps {
  data: MeasurementRow[] | undefined
  param: MeasurementParam
  title: string
  unit: string
}

interface ChartData {
  date: string
  [key: string]: string | number
}

interface ProcessedChartData {
  data: ChartData[]
  min: number
  max: number
}

// Default chart bounds for empty data
const DEFAULT_CHART_BOUNDS: ProcessedChartData = {
  data: [],
  min: 20,
  max: 32,
}

// Chart dimensions
const CHART_CONFIG_DIMENSIONS = {
  height: 260,
  width: 2000,
  barSize: 32,
  tooltipWidth: 160,
} as const

/**
 * Processes raw measurement data for chart display
 */
const useChartData = (data: MeasurementRow[] | undefined, param: MeasurementParam): ProcessedChartData => {
  return React.useMemo(() => {
    if (!data) {
      return DEFAULT_CHART_BOUNDS
    }

    const processedData: ChartData[] = data.map((item: MeasurementRow) => ({
      date: item.created_at,
      [param]: item[param] ?? 0,
    }))

    const values = processedData.map((item) => item[param] as number)
    const min = Math.floor(Math.min(...values))
    const max = Math.ceil(Math.max(...values))

    return {
      data: processedData,
      min,
      max,
    }
  }, [data, param])
}

/**
 * Custom tooltip label formatter for the chart
 */
const formatTooltipLabel = (value: string): string => {
  const date = new Date(value)
  return isDate(date) ? format(date, "p PP") : "Loading..."
}

/**
 * Interactive measurement chart component for displaying aquarium parameters over time
 */
const MeasurementChart = React.memo<MeasurementChartProps>(function MeasurementChart({ param, data, title, unit }) {
  const chartData = useChartData(data, param)

  return (
    <Card className="gap-2 pb-4">
      <CardHeader>
        <CardTitle className="capitalize">
          {title} ({unit})
        </CardTitle>
        <CardDescription>Interactive chart showing {title.toLowerCase()} measurements over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="-mx-5">
          <ChartContainer
            config={CHART_CONFIG}
            className={`aspect-auto h-[${CHART_CONFIG_DIMENSIONS.height}px] w-[${CHART_CONFIG_DIMENSIONS.width}px]`}
          >
            <BarChart accessibilityLayer data={chartData.data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) => format(new Date(value), "HH:mm")}
              />
              <YAxis axisLine={false} tickLine={false} hide domain={[chartData.min, chartData.max]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className={`w-[${CHART_CONFIG_DIMENSIONS.tooltipWidth}px]`}
                    labelFormatter={(value: string) => formatTooltipLabel(value)}
                  />
                }
              />
              <Bar dataKey={param} fill={`var(--color-${param})`} barSize={CHART_CONFIG_DIMENSIONS.barSize} />
            </BarChart>
          </ChartContainer>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
})

export default MeasurementChart
