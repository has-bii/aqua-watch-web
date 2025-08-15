"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useSupabase from "@/lib/supabase/client"
import React from "react"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import useGetAnomaly from "@/hooks/anomaly/use-get-anomaly"

type Props = {
  params: Promise<{ aquarium_id: string }>
}

export default function AnomalyPage({ params }: Props) {
  const { aquarium_id } = React.use(params)
  const supabase = useSupabase()
  const { data } = useGetAnomaly({ supabase, aquarium_id })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly Detection</CardTitle>
        <CardDescription>
          This page will display anomalies detected in your aquarium data, such as unexpected changes in water quality
          or equipment performance.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <DataTable columns={columns} data={data ?? []} />
      </CardContent>
    </Card>
  )
}
