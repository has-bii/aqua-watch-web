import useGetAquariumById from "@/hooks/aquariums/use-get-aquarium-by-id"
import TSupabaseClient from "@/lib/supabase"
import deviceUptimeFormatter from "@/utils/device-uptime-formatter"
import { FishIcon, FishOffIcon, Loader2 } from "lucide-react"
import React from "react"
import { format } from "date-fns"
import useAquariumRealtime from "@/hooks/aquariums/use-aquarium-realtime"

type Props = {
  aquarium_id: string
  supabase: TSupabaseClient
}

const DeviceStatus = React.memo(function DeviceStatus({ aquarium_id, supabase }: Props) {
  const { data } = useAquariumRealtime()
  const { data: aquarium } = useGetAquariumById({ supabase, aquarium_id })

  return (
    <div className="text-primary-foreground my-6 flex w-full flex-col items-center">
      <div className="grid w-4/5 grid-cols-2 items-center gap-6">
        {/* Icon */}
        {aquarium === undefined ? (
          <Loader2 className="size-36 animate-spin" />
        ) : aquarium.is_online ? (
          <FishIcon className="size-36" strokeWidth={1.5} />
        ) : (
          <FishOffIcon className="size-36" strokeWidth={1.5} />
        )}

        {/* Status */}
        <div className="flex flex-col text-right">
          <p className="text-5xl font-semibold">{aquarium ? (aquarium.is_online ? "Online" : "Offline") : "Loading"}</p>
          <p className="text-sm font-light">Device Status</p>
        </div>
      </div>

      <div className="mt-4 w-4/5 space-y-4">
        <Card title="Device Uptime" value={deviceUptimeFormatter(data?.uptime)} />
        {aquarium && (
          <Card
            title={aquarium.online_at ? "Online at" : "Last Online at"}
            value={
              aquarium?.online_at
                ? format(aquarium.online_at, "p PP")
                : aquarium.last_online_at
                  ? format(aquarium.last_online_at, "p PP")
                  : ""
            }
          />
        )}
      </div>
    </div>
  )
})

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="text-primary-foreground flex w-full items-center justify-between rounded-xl bg-black/10 p-4 text-sm">
      <p className="font-semibold">{title}</p>
      <p className="font-bold">{value}</p>
    </div>
  )
}

export default DeviceStatus
