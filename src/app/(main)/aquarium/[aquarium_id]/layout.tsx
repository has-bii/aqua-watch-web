"use client"

import React, { use } from "react"
import AquariumWSProvider from "@/providers/aquarium-ws-provider"
import useSupabase from "@/lib/supabase/client"
import Header from "./header"

type Props = {
  params: Promise<{ aquarium_id: string }>
  children: React.ReactNode
}

export default function AquariumDetailLayout({ children, params }: Props) {
  const { aquarium_id } = use(params)
  const supabase = useSupabase()

  return (
    <div className="flex min-h-dvh w-full flex-col gap-6 py-6">
      <Header supabase={supabase} aquarium_id={aquarium_id} />
      <AquariumWSProvider aquarium_id={aquarium_id}>{children}</AquariumWSProvider>
    </div>
  )
}
