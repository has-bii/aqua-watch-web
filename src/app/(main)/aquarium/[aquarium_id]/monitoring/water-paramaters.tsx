import useAquariumRealtime from "@/hooks/aquariums/use-aquarium-realtime"
import useGetHistory from "@/hooks/history/use-get-history"
import TSupabaseClient from "@/lib/supabase"
import { AquariumData } from "@/types/aquarium-data"
import { DropletIcon, GlassWaterIcon, LucideIcon, ThermometerIcon, WavesIcon, WindIcon } from "lucide-react"
import React, { useMemo } from "react"
import { ParameterChart } from "./parameter-chart"
import { Database } from "@/types/database"

interface Parameter {
  name: string
  param: keyof AquariumData
  label: string
  icon: LucideIcon
}

const parameters: Array<Parameter> = [
  { name: "Water Temperature", param: "water_temperature", label: "°C", icon: ThermometerIcon },
  { name: "pH Level", param: "ph", label: "", icon: DropletIcon },
  { name: "Dissolved Oxygen", param: "do", label: "mg/L", icon: WindIcon },
  { name: "Turbidity", param: "turbidity", label: "%", icon: GlassWaterIcon },
  { name: "Water Flow", param: "flow_rate", label: "mL/min", icon: WavesIcon },
]

type WaterParametersProps = {
  aquarium_id: string
  supabase: TSupabaseClient
}

const WaterParameters = React.memo(function WaterParameters({ aquarium_id, supabase }: WaterParametersProps) {
  const { data: measurement } = useAquariumRealtime()
  const { data: history } = useGetHistory({ supabase, aquarium_id, query: { limit: 288 } })

  return (
    <div className="w-full space-y-2">
      {/* Header */}
      <div className="space-y-0.5">
        <h2 className="text-lg font-bold">Current Water Quality Measurement</h2>
      </div>

      <div className="grid w-full grid-cols-5 gap-2">
        {parameters.map((parameter) => (
          <WaterParameter
            key={parameter.param}
            value={measurement?.[parameter.param].toFixed(2) ?? "Loading"}
            history={history}
            {...parameter}
          />
        ))}
      </div>
    </div>
  )
})

export default WaterParameters

type History = Database["public"]["Tables"]["measurements"]["Row"]

function WaterParameter({
  icon: Icon,
  label,
  name,
  value,
  param,
  history,
}: Parameter & { value: string; history?: History[] }) {
  const chartData = useMemo(() => {
    return (
      history?.map((h) => {
        const value = h[param as keyof History] as number | null

        return {
          date: h.created_at,
          [param]: (value ?? 0) as number,
        }
      }) ?? []
    )
  }, [history, param])

  return (
    <div className="bg-background border-border flex h-full w-full flex-col overflow-hidden rounded-xl border pt-3">
      {/* Header */}
      <div className="text-muted-foreground flex flex-row items-center gap-2 px-3 text-sm">
        <Icon className="h-4 w-4" />
        <p>{name}</p>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 px-3 pt-6 lg:pt-3">
        <p className="text-2xl font-bold">
          {value}
          {label}
        </p>
      </div>

      <ParameterChart param={param} data={chartData} />
    </div>
  )
}
