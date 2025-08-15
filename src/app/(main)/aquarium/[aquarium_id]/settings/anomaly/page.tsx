"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useGetAquariumSetting from "@/hooks/aquariums/use-get-aquarium-setting"
import useSupabase from "@/lib/supabase/client"
import React, { use } from "react"
import SettingAquariumAnomaly from "./setting-aquarium-anomaly"

type Props = {
  params: Promise<{ aquarium_id: string }>
}

export default function SettingAnomalyPage({ params }: Props) {
  const { aquarium_id } = use(params)
  const supabase = useSupabase()
  const { data: setting } = useGetAquariumSetting({ supabase, aquarium_id })
  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Anomaly Settings</CardTitle>
        <CardDescription>
          Manage anomaly detection settings for your aquarium, including contamination rate and parameters.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <SettingAquariumAnomaly
          aquarium_id={aquarium_id}
          supabase={supabase}
          anomaly_parameters={setting?.anomaly_parameters}
          contamination_rate={setting?.contamination_rate}
        />
      </CardContent>
    </Card>
  )
}
