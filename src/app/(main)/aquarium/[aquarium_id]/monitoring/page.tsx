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
    // <div className="grid h-max w-full grid-cols-1 grid-rows-2 gap-2 overflow-y-auto rounded-2xl lg:h-full">
    //   <div className="grid h-full w-full grid-cols-1 content-stretch gap-2 lg:grid-cols-6">
    //     <div className="lg:col-span-2">
    //       <DeviceStatus supabase={supabase} aquarium_id={aquarium_id} />
    //     </div>

    //     <Forecasting aquarium_id={aquarium_id} supabase={supabase} />

    //     <WaterParameters aquarium_id={aquarium_id} supabase={supabase} />
    //   </div>
    //   <div className="grid grid-cols-1 content-stretch gap-2 lg:grid-cols-2">
    //     <div className="bg-background border-border h-full w-full rounded-xl border"></div>
    //     <div className="bg-background border-border h-full w-full rounded-xl border"></div>
    //   </div>
    // </div>
    <div className="h-[calc(100dvh_-_8.5rem)] w-full">
      <div className="flex h-full w-full flex-row gap-4">
        <div className="h-full w-1/3">
          <DeviceStatus supabase={supabase} aquarium_id={aquarium_id} />
        </div>
        <div className="flex h-full w-2/3 flex-1 flex-col gap-4">
          <WaterParameters aquarium_id={aquarium_id} supabase={supabase} />

          <Forecasting aquarium_id={aquarium_id} supabase={supabase} />

          <FeedSection aquarium_id={aquarium_id} supabase={supabase} />

          <WaterChangeSection aquarium_id={aquarium_id} supabase={supabase} />
        </div>
      </div>
    </div>
  )
}
