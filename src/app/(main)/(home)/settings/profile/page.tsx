"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useGetUser from "@/hooks/use-get-user"
import useSupabase from "@/lib/supabase/client"
import React from "react"
import ChangeName from "./change-name"
import ChangeEmail from "./change-email"

export default function ProfilePage() {
  const supabase = useSupabase()
  const { data } = useGetUser({ supabase })

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your profile settings, including your name, email, and profile picture.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <ChangeName supabase={supabase} full_name={data?.user_metadata.full_name} />
        <ChangeEmail supabase={supabase} email={data?.email} />
      </CardContent>
    </Card>
  )
}
