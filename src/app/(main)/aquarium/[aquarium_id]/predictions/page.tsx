"use client"

import useGetAquariumById from "@/hooks/aquariums/use-get-aquarium-by-id"
import useGetPredictions from "@/hooks/predictions/use-get-predictions"
import useSupabase from "@/lib/supabase/client"
import { format, subHours } from "date-fns"
import { Undo2Icon } from "lucide-react"
import Link from "next/link"
import React from "react"
import { ChartPrediction } from "./chart-prediction"

type Props = {
  params: Promise<{ aquarium_id: string }>
}

export default function PredictionsPage({ params }: Props) {
  const { aquarium_id } = React.use(params)
  const supabase = useSupabase()
  const { data: aquarium } = useGetAquariumById({ supabase, aquarium_id })
  const [date] = React.useState<Date>(subHours(new Date(), 3))
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
    <>
      {/* Header */}
      <div className="bg-background border-border mb-4 flex w-full flex-col gap-3 border-b p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Title */}
          <h1 className="text-lg font-bold">{aquarium ? aquarium.name : "Loading..."}</h1>

          <Link href="/" className="p-1">
            <Undo2Icon strokeWidth={2} size={22} />
          </Link>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm">
          View the predictions for your aquarium&apos;s measurements based on historical data.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-4 p-4">
        {/* <div className=""></div> */}

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
    </>
  )
}
