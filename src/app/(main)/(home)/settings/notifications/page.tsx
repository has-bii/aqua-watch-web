"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useGetUser from "@/hooks/use-get-user"
import useSupabase from "@/lib/supabase/client"
import React from "react"
import NotificationSettings from "./notification-settings"

export default function NotificationsPage() {
  const supabase = useSupabase()
  const { data: user } = useGetUser({ supabase })

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Notifications Settings</CardTitle>
        <CardDescription>
          Manage your notification preferences here. You can choose to receive notifications via telegram or no.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {user ? (
          <NotificationSettings supabase={supabase} user={user} />
        ) : (
          <p className="text-muted-foreground">Loading...</p>
        )}
      </CardContent>
    </Card>
  )
}
