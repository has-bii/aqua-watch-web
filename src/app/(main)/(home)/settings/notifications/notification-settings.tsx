import TSupabaseClient from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import React, { useCallback, useTransition } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { LinkIcon, SendIcon } from "lucide-react"

type Props = {
  supabase: TSupabaseClient
  user: User
}

type UserMetadata = {
  enable_notification?: boolean
  chat_id?: string
}

export default function NotificationSettings({ supabase, user }: Props) {
  const query = useQueryClient()
  const { enable_notification, chat_id } = user.user_metadata as UserMetadata
  const [isPending, startTransition] = useTransition()

  const handleToggle = useCallback(
    async (checked: boolean) => {
      const { error } = await supabase.auth.updateUser({
        data: { enable_notification: checked },
      })

      if (error) {
        toast.error("Failed to update notification settings. Please try again.")
        return
      }

      toast.success("Notification settings updated successfully!")
      query.invalidateQueries({
        queryKey: ["user"],
      })
    },
    [query, supabase],
  )

  const handleConnect = useCallback(() => {
    window.open(`https://t.me/aqua_watch_bot?link=${user.id}`, "_blank")
  }, [user.id])

  const handleTestNotification = useCallback(async () => {
    if (!chat_id) {
      toast.error("You need to connect your Telegram account first.")
      return
    }

    await supabase.from("alerts").insert({
      user_id: user.id,
      title: "Test Notification",
      message: "This is a test notification from Aqua Watch.",
      alert_timestamp: new Date().toISOString(),
      severity: "low",
    })

    toast.success("Test notification sent successfully!")
  }, [chat_id, supabase, user.id])

  return (
    <div className="w-xl space-y-4">
      <div className="space-y-1">
        <div className="flex w-full flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label htmlFor="enable_notification">Enable Notifications</Label>
            <p className="text-muted-foreground text-sm">
              Toggle to receive notifications for important updates and alerts.
            </p>
          </div>
          <Switch
            id="enable_notification"
            checked={!!enable_notification}
            onCheckedChange={(checked) => {
              startTransition(() => {
                handleToggle(checked)
              })
            }}
            disabled={isPending || !chat_id}
          />
        </div>
        {!chat_id && (
          <p className="text-muted-foreground text-xs">You need to setup Telegram first to enable notifications.</p>
        )}
      </div>

      <div className="flex w-full flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Setup Telegram Notifications</p>
          <p className="text-muted-foreground text-sm">
            Connect your Telegram account to receive notifications directly in your chat.
          </p>
        </div>

        {!chat_id ? (
          <Button size="sm" onClick={handleConnect}>
            <LinkIcon />
            <span>Connect</span>
          </Button>
        ) : (
          <Button size="sm" onClick={handleTestNotification}>
            <SendIcon />
            <span>Test</span>
          </Button>
        )}
      </div>
    </div>
  )
}
