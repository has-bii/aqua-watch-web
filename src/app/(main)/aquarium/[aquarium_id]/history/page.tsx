"use client"

import useGetHistory from "@/hooks/history/use-get-history"
import useSupabase from "@/lib/supabase/client"
import React, { use } from "react"
import MeasurementChart from "./measurement-chart"
import { ScrollArea } from "@/components/ui/scroll-area"
import { startOfToday } from "date-fns"
import FilterDateTime from "./filter-datetime"

type Props = {
  params: Promise<{ aquarium_id: string }>
}

export default function HistoryPage({ params }: Props) {
  const { aquarium_id } = use(params)
  const supabase = useSupabase()
  const [fromDate, setFromDate] = React.useState<Date>(startOfToday())
  const [untilDate, setUntilDate] = React.useState<Date>(new Date())
  const { data: measurements } = useGetHistory({
    supabase,
    aquarium_id,
    query: {
      fromDate: fromDate,
      untilDate: untilDate,
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
            <FilterDateTime label="From Date" date={fromDate} setDate={setFromDate} />
            <FilterDateTime label="Until Date" date={untilDate} setDate={setUntilDate} />
          </div>
        </div>

        {/* Water Temperature */}
        <MeasurementChart data={measurements} param="water_temperature" title="Water Temperature" unit="°C" />

        {/* pH */}
        <MeasurementChart data={measurements} param="ph" title="pH Level" unit="pH" />

        {/* Dissolved Oxygen */}
        <MeasurementChart data={measurements} param="do" title="Dissolved Oxygen" unit="mg/L" />

        {/* Turbidity */}
        <MeasurementChart data={measurements} param="turbidity" title="Turbidity" unit="%" />

        {/* Flow Rate */}
        <MeasurementChart data={measurements} param="flow_rate" title="Flow Rate" unit="mL/min" />
      </div>
    </ScrollArea>
  )
}
