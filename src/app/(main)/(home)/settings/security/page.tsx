"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useSupabase from "@/lib/supabase/client"
import React from "react"
import ChangePassword from "./change-password"

export default function SecurityPage() {
  const supabase = useSupabase()
  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          You can change your password here. Make sure to choose a strong password that you haven&apos;t used before.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChangePassword supabase={supabase} />
      </CardContent>
    </Card>
  )
}
