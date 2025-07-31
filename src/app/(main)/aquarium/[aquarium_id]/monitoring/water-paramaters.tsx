import useAquariumRealtime from "@/hooks/aquariums/use-aquarium-realtime"
import { AquariumData } from "@/types/aquarium-data"
import {
  DropletIcon,
  GlassWaterIcon,
  LucideIcon,
  SunSnowIcon,
  ThermometerIcon,
  WavesIcon,
  WindIcon,
} from "lucide-react"
import React from "react"

const parameters: {
  param: keyof AquariumData
  label: string
  icon: LucideIcon
}[] = [
  {
    param: "water_temperature",
    label: "°C",
    icon: ThermometerIcon,
  },
  { param: "room_temperature", label: "°C", icon: SunSnowIcon },
  { param: "ph", label: "pH", icon: DropletIcon },
  { param: "do", label: "mg/L", icon: WindIcon },
  { param: "turbidity", label: "%", icon: GlassWaterIcon },
  { param: "flow_rate", label: "mL/min", icon: WavesIcon },
]

const WaterParameters = React.memo(function WaterParameters() {
  const { data: measurement } = useAquariumRealtime()

  return (
    <div className="grid grid-cols-2 gap-4">
      {parameters.map((param) => (
        <div
          key={param.param}
          className="text-foreground bg-background border-border flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl p-4 shadow"
        >
          {/* Icon */}
          <param.icon className="size-16" />

          {/* Value */}
          <p className="truncate whitespace-nowrap text-2xl font-black">
            {measurement?.[param.param].toFixed(2) || "Loading"} {param.label}
          </p>
        </div>
      ))}
    </div>
  )
})

export default WaterParameters
