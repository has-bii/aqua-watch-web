"use client"

import useGetAquariums from "@/hooks/aquariums/use-get-aquariums"
import TSupabaseClient from "@/lib/supabase"
import useSupabase from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { memo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { intlFormatDistance } from "date-fns"

export default function Home() {
  const supabase = useSupabase()

  return (
    <div className="bg-background h-dvh w-screen overflow-hidden p-4 lg:p-6">
      <div className="container mx-auto flex h-full max-w-7xl flex-1 flex-col gap-2">
        <div className="h-16 w-full">
          <div className="flex w-full flex-col">
            <h1 className="text-3xl font-medium">Aquarium List</h1>
            <p className="text-muted-foreground">View and manage your aquariums.</p>
          </div>
        </div>

        <div className="bg-muted h-[calc(100%_-_4.5rem)] w-full overflow-hidden rounded-3xl border">
          <AquariumList supabase={supabase} />
        </div>
      </div>
    </div>
  )
}

type Props = {
  supabase: TSupabaseClient
}

const AquariumList = memo(function AquariumList({ supabase }: Props) {
  const { data, isLoading, error } = useGetAquariums({ supabase })
  const router = useRouter()

  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-red-500">Error loading aquariums: {error.message}</p>
      </div>
    )

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Loading aquariums... Please wait.</p>
      </div>
    )

  if (data && data.length !== 0)
    return (
      <ScrollArea className="h-full w-full rounded-xl p-3">
        <div className="grid h-full w-full grid-cols-2 gap-2 lg:grid-cols-4">
          {data.map((aquarium) => (
            <div
              key={aquarium.id}
              className={cn(
                "flex aspect-video flex-col rounded-2xl bg-gradient-to-br from-green-950 from-0% to-emerald-800 to-80% px-4",
                !aquarium.is_online && "grayscale-75",
                "transition-all duration-200 ease-in-out hover:cursor-pointer hover:brightness-110",
              )}
              role="button"
              onClick={() => router.push(`/aquarium/${aquarium.id}/monitoring`)}
            >
              <div className="flex items-center justify-between gap-2 rounded py-4">
                <p className="text-primary-foreground truncate text-base font-light lg:text-lg">{aquarium.name}</p>

                <Link href="/" className="bg-background rounded-full p-1.5">
                  <ArrowUpRight className="text-green-950" size={16} />
                </Link>
              </div>

              <div className="text-primary-foreground mt-auto space-y-1 whitespace-nowrap py-3">
                <p className="text-3xl font-medium">{aquarium.is_online ? "Online" : "Offline"}</p>
                <p className="truncate text-sm font-light text-emerald-200">
                  {aquarium.online_at
                    ? `Online ${intlFormatDistance(aquarium.online_at, new Date())}`
                    : aquarium.last_online_at
                      ? `Last online ${intlFormatDistance(aquarium.last_online_at, new Date())}`
                      : "No data available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    )

  if (data && data.length === 0)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">No aquariums found. Please add one.</p>
      </div>
    )
})
