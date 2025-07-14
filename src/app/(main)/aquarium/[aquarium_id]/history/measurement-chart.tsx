"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Database } from "@/types/database"
import { format, isDate } from "date-fns"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const description = "An interactive area chart"

const chartConfig = {
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
} satisfies ChartConfig

type Data = Database["public"]["Tables"]["measurements"]["Row"]

type Props = {
  data: Data[] | undefined
  param: "water_temperature" | "room_temperature" | "ph" | "do"
  title: string
  unit: string
}

export default function MeasurementChart({ param, data, title, unit }: Props) {
  const chartData = React.useMemo(() => {
    if (!data)
      return {
        data: [],
        min: 20,
        max: 32,
      }

    const tempData = data.map((item) => ({
      date: item.created_at,
      [param]: item[param] ? item[param] : 0,
    }))

    const min = Math.floor(Math.min(...tempData.map((item) => item[param] as number)))
    const max = Math.ceil(Math.max(...tempData.map((item) => item[param] as number)))

    return {
      data: tempData,
      min,
      max,
    }
  }, [data, param])

  return (
    <Card className="gap-2 pb-4">
      <CardHeader>
        <CardTitle className="capitalize">
          {title} ({unit})
        </CardTitle>
        <CardDescription>An interactive area chart showing the {title.toLowerCase()} over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="-mx-5">
          <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-[2000px]">
            <BarChart accessibilityLayer data={chartData.data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => format(value, "HH:mm")}
              />
              <YAxis axisLine={false} tickLine={false} hide domain={[chartData.min, chartData.max]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[160px]"
                    labelFormatter={(value, payload) => {
                      console.log(payload[0])
                      return isDate(new Date(value)) ? format(value, "p PP") : "loading..."
                    }}
                  />
                }
              />
              <Bar dataKey={param} fill={`var(--color-${param})`} barSize={32} />
            </BarChart>
          </ChartContainer>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
