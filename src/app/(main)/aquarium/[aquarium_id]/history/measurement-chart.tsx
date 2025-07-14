"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Database } from "@/types/database"
import { format } from "date-fns"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const description = "An interactive area chart"

const chartConfig = {
  room_temperature: {
    label: "Room",
    color: "var(--chart-1)",
  },
  water_temperature: {
    label: "Water",
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
}

export default function MeasurementChart({ param, data, title }: Props) {
  const chartData = React.useMemo(() => {
    if (!data)
      return {
        data: [],
        min: 20,
        max: 32,
      }

    switch (param) {
      case "water_temperature":
        const tempData = data.map((item) => ({
          date: item.created_at,
          water_temperature: item.water_temperature ? item.water_temperature : 0,
        }))

        const min = Math.min(...tempData.map((item) => item.water_temperature!))
        const max = Math.max(...tempData.map((item) => item.water_temperature!))

        return {
          data: tempData,
          min,
          max,
        }

      case "room_temperature":
        const roomTempData = data.map((item) => ({
          date: item.created_at,
          room_temperature: item.room_temperature ? item.room_temperature : 0,
        }))
        const roomMin = Math.min(...roomTempData.map((item) => item.room_temperature!))
        const roomMax = Math.max(...roomTempData.map((item) => item.room_temperature!))

        return {
          data: roomTempData,
          min: roomMin,
          max: roomMax,
        }

      case "ph":
        const phData = data.map((item) => ({
          date: item.created_at,
          ph: item.ph ? item.ph : 0,
        }))

        const phMin = Math.min(...phData.map((item) => item.ph!))
        const phMax = Math.max(...phData.map((item) => item.ph!))

        return {
          data: phData,
          min: phMin,
          max: phMax,
        }

      case "do":
        const doData = data.map((item) => ({
          date: item.created_at,
          do: item.do ? item.do : 0,
        }))
        const doMin = Math.min(...doData.map((item) => item.do!))
        const doMax = Math.max(...doData.map((item) => item.do!))

        return {
          data: doData,
          min: doMin,
          max: doMax,
        }

      default:
        return {
          data: [],
          min: 0,
          max: 14,
        }
    }
  }, [data, param])

  return (
    <Card className="gap-2 pb-4">
      <CardHeader>
        <CardTitle className="capitalize">{title}</CardTitle>
        <CardDescription>An interactive area chart showing the {title.toLowerCase()} over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="-mx-5">
          <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-[2000px]">
            <BarChart accessibilityLayer data={chartData.data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => format(value, "HH:mm")}
              />
              <YAxis axisLine={false} tickLine={false} hide domain={[chartData.min - 1, chartData.max + 1]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent className="w-[160px]" labelFormatter={(value) => format(value, "p PP")} />
                }
              />
              <Bar dataKey={param} fill={`var(--color-${param})`} barSize={20} />
            </BarChart>
          </ChartContainer>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
