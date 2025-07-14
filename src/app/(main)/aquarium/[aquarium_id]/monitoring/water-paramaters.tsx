import { AquariumData } from "@/types/aquarium-data"
import { DropletIcon, LucideIcon, ThermometerIcon, WindIcon } from "lucide-react"
import React from "react"

type Props = {
  data: AquariumData | null
}

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
  { param: "room_temperature", label: "°C", icon: ThermometerIcon },
  { param: "ph", label: "pH", icon: DropletIcon },
  { param: "do", label: "mg/L", icon: WindIcon },
]

export default function WaterParameters({ data }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {parameters.map((param) => (
        <div
          key={param.param}
          className="text-foreground bg-background border-border flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl p-4 shadow"
        >
          {/* Icon */}
          <param.icon className="size-20" />

          {/* Value */}
          <p className="text-3xl font-black">{data?.[param.param].toFixed(2) || "Loading..."}</p>

          {/*  Label */}
          <p className="font-bold">{param.label}</p>
        </div>
      ))}
    </div>
  )
}
