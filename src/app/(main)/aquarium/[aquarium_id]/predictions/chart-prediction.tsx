"use client"

// import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Database } from "@/types/database"
import { format, isDate } from "date-fns"
import { useMemo } from "react"

export const description = "A multiple line chart"

const chartConfig = {
  predicted_value: {
    label: "Prediction Value",
    color: "var(--chart-1)",
  },
  actual_value: {
    label: "True Value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface ChartData {
  date: string
  predicted_value: number
  actual_value: number | null
}

interface ProcessedChartData {
  data: ChartData[]
  min: number
  max: number
}

type ChartPredictionProps = {
  title: string
  date: string
  data?: Database["public"]["Tables"]["predictions"]["Row"][]
  min?: number
  max?: number
  label: string
}
export function ChartPrediction({ title, date, data, max, min, label }: ChartPredictionProps) {
  const chartData = useMemo((): ProcessedChartData => {
    if (!data)
      return {
        data: [],
        min: 0,
        max: 30,
      }

    const processedData = data.map((item) => ({
      date: item.target_time,
      predicted_value: item.predicted_value,
      actual_value: item.actual_value,
    }))

    const min_predicted_value = Math.min(...processedData.map((item) => item.predicted_value))
    const max_predicted_value = Math.max(...processedData.map((item) => item.predicted_value))
    const min_actual_value = Math.min(
      ...processedData.filter((item) => item.actual_value !== null).map((item) => item.actual_value!),
    )
    const max_actual_value = Math.max(
      ...processedData.filter((item) => item.actual_value !== null).map((item) => item.actual_value!),
    )

    const min = Math.min(min_predicted_value, min_actual_value)
    const max = Math.max(max_predicted_value, max_actual_value)

    return {
      data: processedData,
      min,
      max,
    }
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData.data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => format(new Date(value), "HH:mm")}
            />
            <YAxis axisLine={false} tickLine={false} hide domain={[min ?? 20, max ?? 30]} />
            {/* <ChartTooltip
              content={
                <ChartTooltipContent
                  className={`w-[160px]`}
                  labelFormatter={(value: string, payload) => {
                    const date = new Date(payload[0].payload.date)

                    return isDate(date) ? format(date, "p PP") : "Loading..."
                  }}
                />
              }
            /> */}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  labelFormatter={(value: string, payload) => {
                    const date = new Date(payload[0].payload.date)

                    return isDate(date) ? format(date, "p PP") : "Loading..."
                  }}
                  formatter={(value, name, item, index) => (
                    <>
                      <div
                        className="bg-(--color-bg) h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={
                          {
                            "--color-bg": `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label || name}
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        {value}
                        <span className="text-muted-foreground font-normal">{label}</span>
                      </div>
                      {/* Add this after the last item */}
                      {index === 1 && (
                        <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                          Prediction Error
                          <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                            {Math.abs(item.payload.actual_value - item.payload.predicted_value).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
              }
              cursor={false}
              defaultIndex={1}
            />

            <Line
              dataKey="predicted_value"
              type="monotone"
              stroke="var(--color-predicted_value)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="actual_value"
              type="monotone"
              stroke="var(--color-actual_value)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        {/* <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div> */}
      </CardFooter>
    </Card>
  )
}
