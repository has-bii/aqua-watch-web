"use client"

import useSupabase from "@/lib/supabase/client"
import React, { use } from "react"
import Header from "./header"
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

  return (
    <>
      <div className="gradient flex flex-col rounded-xl p-3">
        {/* Header */}
        <Header supabase={supabase} aquarium_id={aquarium_id} />

        <DeviceStatus supabase={supabase} aquarium_id={aquarium_id} />
      </div>

      {/* Main Content */}
      <div className="mt-4 space-y-6">
        <WaterParameters />

        <FeedSection aquarium_id={aquarium_id} supabase={supabase} />

        <WaterChangeSection aquarium_id={aquarium_id} supabase={supabase} />
      </div>
    </>
  )
}
