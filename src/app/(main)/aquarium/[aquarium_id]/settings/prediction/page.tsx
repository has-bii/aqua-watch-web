"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useGetAquariumSetting from "@/hooks/aquariums/use-get-aquarium-setting"
import useSupabase from "@/lib/supabase/client"
import React, { use } from "react"
import SettingAquariumPrediction from "./setting-aquarium-prediction"

type Props = {
  params: Promise<{ aquarium_id: string }>
}

export default function SettingPredictionPage({ params }: Props) {
  const { aquarium_id } = use(params)
  const supabase = useSupabase()
  const { data: setting } = useGetAquariumSetting({ supabase, aquarium_id })
  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Prediction Settings</CardTitle>
        <CardDescription>
          Manage prediction settings for your aquarium, including prediction models and parameters.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <SettingAquariumPrediction
          aquarium_id={aquarium_id}
          supabase={supabase}
          prediction_parameters={setting?.prediction_parameters}
          train_ph_model_days={setting?.train_ph_model_days}
          train_temp_model_days={setting?.train_temp_model_days}
        />
      </CardContent>
    </Card>
  )
}
