"use client"

import DatePicker from "@/components/ui/datepicker"
import { Label } from "@/components/ui/label"
import useGetAquariumById from "@/hooks/aquariums/use-get-aquarium-by-id"
import useGetHistory from "@/hooks/history/use-get-history"
import useSupabase from "@/lib/supabase/client"
import { Undo2Icon } from "lucide-react"
import Link from "next/link"
import React, { use } from "react"
import MeasurementChart from "./measurement-chart"

type Props = {
  params: Promise<{ aquarium_id: string }>
}

export default function HistoryPage({ params }: Props) {
  const { aquarium_id } = use(params)
  const supabase = useSupabase()
  const { data: aquarium } = useGetAquariumById({ supabase, aquarium_id })

  const [fromDate, setFromDate] = React.useState<Date | undefined>(new Date())

  const { data: measurements } = useGetHistory({
    supabase,
    aquarium_id,
    query: {
      fromDate: fromDate || new Date(),
    },
  })

  return (
    <>
      {/* Header */}
      <div className="bg-background mb-4 flex w-full flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1">
            <Undo2Icon strokeWidth={2} size={22} />
          </Link>

          {/* Title */}
          <h1 className="text-lg font-bold">{aquarium ? aquarium.name : "Loading..."}</h1>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm">View the history of your aquarium&apos;s measurements.</p>
      </div>

      {/* Main Content */}
      <div className="space-y-4 p-4">
        {/* Filter */}
        <div className="flex-1 space-y-1.5">
          <Label>Selected Date</Label>
          <DatePicker date={fromDate} setDate={setFromDate} disabled={(date) => date > new Date()} />
        </div>

        {/* Water Temperature */}
        <MeasurementChart data={measurements} param="water_temperature" title="Water Temperature" unit="°C" />

        {/* Room Temperature */}
        <MeasurementChart data={measurements} param="room_temperature" title="Room Temperature" unit="°C" />

        {/* pH */}
        <MeasurementChart data={measurements} param="ph" title="pH Level" unit="pH" />

        {/* Dissolved Oxygen */}
        <MeasurementChart data={measurements} param="do" title="Dissolved Oxygen" unit="mg/L" />

        {/* Turbidity */}
        <MeasurementChart data={measurements} param="turbidity" title="Turbidity" unit="%" />

        {/* Flow Rate */}
        <MeasurementChart data={measurements} param="flow_rate" title="Flow Rate" unit="mL/min" />
      </div>
    </>
  )
}
