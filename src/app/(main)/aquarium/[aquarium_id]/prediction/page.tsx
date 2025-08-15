"use client"

import useGetPredictions from "@/hooks/predictions/use-get-predictions"
import useSupabase from "@/lib/supabase/client"
import { format, subHours } from "date-fns"
import React from "react"
import { ChartPrediction } from "./chart-prediction"
import { ScrollArea } from "@/components/ui/scroll-area"
import FilterDateTime from "../history/filter-datetime"

type Props = {
  params: Promise<{ aquarium_id: string }>
}

export default function PredictionsPage({ params }: Props) {
  const { aquarium_id } = React.use(params)
  const supabase = useSupabase()
  const [date, setDate] = React.useState<Date>(subHours(new Date(), 12))
  const { data: water_predictions } = useGetPredictions({
    supabase,
    aquarium_id,
    query: {
      fromDate: date,
      target_parameter: "water_temperature",
    },
  })
  const { data: ph_predictions } = useGetPredictions({
    supabase,
    aquarium_id,
    query: {
      fromDate: date,
      target_parameter: "ph",
    },
  })

  return (
    <ScrollArea className="h-[calc(100dvh_-_8.5rem)] w-full">
      <div className="space-y-4">
        <div className="flex w-full items-center justify-between">
          {/* Description */}
          <p className="text-muted-foreground text-sm">
            This page displays the historical measurements of your aquarium. You can select a date range to view
            specific data.
          </p>

          <div className="flex items-center gap-4">
            <FilterDateTime label="From Date" date={date} setDate={setDate} />
          </div>
        </div>

        <ChartPrediction
          title="Temperature Predictions"
          data={water_predictions}
          date={format(date, "p PP")}
          label="°C"
        />
        <ChartPrediction
          title="pH Level Predictions"
          data={ph_predictions}
          date={format(date, "p PP")}
          min={6}
          max={8}
          label=""
        />
      </div>
    </ScrollArea>
  )
}
