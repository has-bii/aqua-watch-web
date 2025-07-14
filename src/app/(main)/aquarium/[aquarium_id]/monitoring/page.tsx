"use client"

import useSupabase from "@/lib/supabase/client"
import React, { use } from "react"
import Header from "./header"
import useAquariumRealtime from "@/hooks/aquariums/use-aquarium-realtime"
import DeviceStatus from "./device-status"
import WaterParameters from "./water-paramaters"
import FeedSection from "./feeding-section"
import WaterChangeSection from "./water-change-section"

type Props = {
  params: Promise<{ aquarium_id: string }>
}

export default function AquariumDetail({ params }: Props) {
  const { aquarium_id } = use(params)
  const supabase = useSupabase()
  const { data: measurement } = useAquariumRealtime({ aquarium_id })

  return (
    <>
      <div className="gradient flex flex-col rounded-b-3xl p-4">
        {/* Header */}
        <Header supabase={supabase} aquarium_id={aquarium_id} />

        <DeviceStatus data={measurement} supabase={supabase} aquarium_id={aquarium_id} />
      </div>

      {/* Main Content */}
      <div className="mt-8 space-y-6 px-6">
        <WaterParameters data={measurement} />

        <FeedSection aquarium_id={aquarium_id} supabase={supabase} />

        <WaterChangeSection aquarium_id={aquarium_id} supabase={supabase} />
      </div>
    </>
  )
}
