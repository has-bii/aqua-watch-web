import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import useAquariumRealtime from "@/hooks/aquariums/use-aquarium-realtime"
import useGetPredictions from "@/hooks/predictions/use-get-predictions"
import TSupabaseClient from "@/lib/supabase"
import { Database } from "@/types/database"
import { format } from "date-fns"
import { DropletIcon, LucideIcon, ThermometerIcon } from "lucide-react"
import React from "react"

type Props = {
  aquarium_id: string
  supabase: TSupabaseClient
}

export default function Forecasting({ aquarium_id, supabase }: Props) {
  const [fromDate] = React.useState<Date>(new Date())
  const { data } = useAquariumRealtime()
  const { data: predWaterTemp } = useGetPredictions({
    supabase,
    aquarium_id,
    query: {
      fromDate,
      target_parameter: "water_temperature",
    },
  })
  const { data: predPH } = useGetPredictions({
    supabase,
    aquarium_id,
    query: {
      fromDate,
      target_parameter: "ph",
    },
  })

  return (
    <>
      <ForecastingCard
        title="Water Temperature"
        Icon={ThermometerIcon}
        current={data?.water_temperature}
        predictions={predWaterTemp}
        label="°C"
      />

      <ForecastingCard
        title="pH Level"
        Icon={DropletIcon}
        current={data?.ph}
        label=""
        predictions={predPH}
        precision={2}
      />
    </>
  )
}

type ForecastingCardProps = {
  title: string
  current: number | undefined
  predictions?: Database["public"]["Tables"]["predictions"]["Row"][]
  label?: string
  Icon: LucideIcon
  precision?: number
}

function ForecastingCard({ title, current, predictions, label, Icon, precision }: ForecastingCardProps) {
  return (
    <div className="bg-background border-border flex h-full w-full flex-col gap-4 overflow-hidden rounded-2xl border py-3">
      {/* Header */}
      <div className="text-muted-foreground flex flex-row items-center gap-2 px-3">
        <Icon className="size-4" />
        <h2 className="text-sm">{title}</h2>
      </div>

      <div className="px-3">
        <p className="text-2xl font-bold">
          {current?.toFixed(2) ?? "Loading"}
          {label}
        </p>
      </div>

      {/* Content */}
      <div className="mt-auto w-full px-3">
        <ScrollArea className="h-full w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 py-2">
            {predictions === undefined ? (
              <div>hehe</div>
            ) : (
              predictions.map((prediction, index) => (
                <div key={index} className="flex flex-col items-center gap-1 text-center">
                  <div className="text-muted-foreground text-xs">{format(prediction.target_time, "h a")}</div>
                  <div className="text-sm font-semibold">
                    {prediction.predicted_value.toFixed(precision ?? 1)}
                    {label}
                  </div>
                </div>
              ))
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
