"use client"

import useSupabase from "@/lib/supabase/client"
import React, { use } from "react"
import DeviceStatus from "./device-status"
import WaterParameters from "./water-paramaters"
import Forecasting from "./forecasting"
import FeedSection from "./feeding-section"
import WaterChangeSection from "./water-change-section"

type Props = {
  params: Promise<{ aquarium_id: string }>
}

export default function AquariumDetail({ params }: Props) {
  const { aquarium_id } = use(params)
  const supabase = useSupabase()

  return (
    <div className="grid h-full w-full grid-cols-1 gap-2 lg:grid-cols-3">
      <div className="gradient flex flex-col rounded-xl p-3 lg:h-full">
        <DeviceStatus supabase={supabase} aquarium_id={aquarium_id} />
      </div>

      <div className="flex flex-col gap-2">
        <Forecasting aquarium_id={aquarium_id} supabase={supabase} />
      </div>

      <WaterParameters aquarium_id={aquarium_id} supabase={supabase} />

      <div className="grid gap-2 lg:col-span-3 lg:grid-cols-2">
        <FeedSection aquarium_id={aquarium_id} supabase={supabase} />

        <WaterChangeSection aquarium_id={aquarium_id} supabase={supabase} />
      </div>
    </div>
  )
}
