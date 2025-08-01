import useGetAquariumById from "@/hooks/aquariums/use-get-aquarium-by-id"
import TSupabaseClient from "@/lib/supabase"
import deviceUptimeFormatter from "@/utils/device-uptime-formatter"
import { CloudOffIcon, FishIcon, Loader2 } from "lucide-react"
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
    <div className="text-primary-foreground flex w-full flex-col items-center gap-1 p-4">
      <div className="flex flex-row items-center gap-6">
        {/* Icon */}
        <div>
          {aquarium === undefined ? (
            <Loader2 className="size-36 animate-spin" />
          ) : aquarium.is_online ? (
            <FishIcon className="size-36" strokeWidth={1.5} />
          ) : (
            <CloudOffIcon className="size-36" strokeWidth={1.5} />
          )}
        </div>

        {/* Status */}
        <div className="text-left">
          <p className="text-4xl font-semibold">{aquarium ? (aquarium.is_online ? "Online" : "Offline") : "Loading"}</p>
          <p className="text-xs font-light">Device Status</p>
        </div>
      </div>

      <div className="mt-4 flex w-full flex-col gap-2">
        <Card title="Device Uptime" value={deviceUptimeFormatter(data?.uptime)} />
        <Card
          title={aquarium === undefined ? "Loading" : aquarium.is_online ? "Online At" : "Last Offline At"}
          value={
            aquarium === undefined
              ? "Loading"
              : aquarium.is_online
                ? format(new Date(aquarium.online_at || new Date()), "p PP")
                : format(new Date(aquarium.last_online_at || new Date()), "p PP")
          }
        />
      </div>
    </div>
  )
})

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="text-primary-foreground flex w-full items-center justify-between rounded-xl bg-black/10 p-4 text-sm">
      <p className="font-light">{title}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

export default DeviceStatus
