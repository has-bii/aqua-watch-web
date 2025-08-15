"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useGetAquariumById from "@/hooks/aquariums/use-get-aquarium-by-id"
import useSupabase from "@/lib/supabase/client"
import React, { use } from "react"
import ChangeAquariumNameDesc from "./change-aquarium-name-desc"

type Props = {
  params: Promise<{ aquarium_id: string }>
}

export default function GeneralPage({ params }: Props) {
  const { aquarium_id } = use(params)
  const supabase = useSupabase()
  const { data: aquarium } = useGetAquariumById({ supabase, aquarium_id })

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage general settings for your aquarium, including name and description.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <ChangeAquariumNameDesc
          aquarium_id={aquarium_id}
          supabase={supabase}
          name={aquarium?.name}
          desc={aquarium?.desc}
        />
      </CardContent>
    </Card>
  )
}
