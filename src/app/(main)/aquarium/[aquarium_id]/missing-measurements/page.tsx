"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useGetMissingMeasurement from "@/hooks/missing-measurement/use-get-missing-measurements"
import useSupabase from "@/lib/supabase/client"
import React from "react"
import { DataTable } from "./data-table"
import { columns } from "./columns"

type Props = {
  params: Promise<{ aquarium_id: string }>
}

export default function MissingMeasurementsPage({ params }: Props) {
  const { aquarium_id } = React.use(params)
  const supabase = useSupabase()
  const { data } = useGetMissingMeasurement({ supabase, aquarium_id })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Measurements</CardTitle>
        <CardDescription>This page will display measurements that are missing from your aquarium data.</CardDescription>
      </CardHeader>

      <CardContent>
        <DataTable columns={columns} data={data ?? []} />
      </CardContent>
    </Card>
  )
}
