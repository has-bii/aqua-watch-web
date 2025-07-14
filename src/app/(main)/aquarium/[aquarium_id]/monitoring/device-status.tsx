import useGetAquariumById from "@/hooks/aquariums/use-get-aquarium-by-id"
import TSupabaseClient from "@/lib/supabase"
import { AquariumData } from "@/types/aquarium-data"
import deviceUptimeFormatter from "@/utils/device-uptime-formatter"
import { FishIcon, FishOffIcon, Loader2 } from "lucide-react"
import React from "react"
import { format } from "date-fns"

type Props = {
  data: AquariumData | null
  aquarium_id: string
  supabase: TSupabaseClient
}

export default function DeviceStatus({ aquarium_id, supabase, data }: Props) {
  const { data: aquarium } = useGetAquariumById({ supabase, aquarium_id })

  return (
    <div className="text-primary-foreground my-6 flex w-full flex-col items-center">
      <div className="grid w-4/5 grid-cols-2 items-center gap-6">
        {/* Icon */}
        {aquarium === undefined ? (
          <Loader2 className="size-36 animate-spin" />
        ) : aquarium.is_online ? (
          <FishIcon className="size-36" />
        ) : (
          <FishOffIcon className="size-36" />
        )}

        {/* Status */}
        <div className="flex flex-col text-right">
          <p className="text-5xl font-extrabold">
            {aquarium ? (aquarium.is_online ? "Online" : "Offline") : "Loading"}
          </p>
          <p className="text-sm">Device Status</p>
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
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="text-primary-foreground flex w-full items-center justify-between rounded-xl bg-black/10 p-4 text-sm">
      <p className="font-semibold">{title}</p>
      <p className="font-bold">{value}</p>
    </div>
  )
}
