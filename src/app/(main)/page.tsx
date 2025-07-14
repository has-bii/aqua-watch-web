"use client"

import { Skeleton } from "@/components/ui/skeleton"
import useGetAquariums from "@/hooks/aquariums/use-get-aquariums"
import useGetUser from "@/hooks/use-get-user"
import TSupabaseClient from "@/lib/supabase"
import useSupabase from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { memo } from "react"

export default function Home() {
  const supabase = useSupabase()

  return (
    <div className="flex min-h-dvh w-screen flex-col bg-white p-4">
      {/* Headers */}
      <div className="mb-6 w-full">
        <Header supabase={supabase} />
      </div>

      {/* Main Content */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <AquariumList supabase={supabase} />
      </div>
    </div>
  )
}

type Props = {
  supabase: TSupabaseClient
}

const Header = memo(function Header({ supabase }: Props) {
  const { data: user, isLoading, error } = useGetUser({ supabase })

  if (isLoading) return <Skeleton className="h-8 w-full" />

  if (user)
    return (
      <h1>
        <span className="text-muted-foreground text-sm">Welcome,</span>
        <br />
        <span className="text-xl font-bold">{user.user_metadata.full_name}!</span>
      </h1>
    )

  return <p className="text-red-500">{error?.message || "Failed to load user data"}</p>
})

const AquariumList = memo(function AquariumList({ supabase }: Props) {
  const { data, isLoading, error } = useGetAquariums({ supabase })
  const router = useRouter()

  if (isLoading)
    return Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="aspect-square w-full" />)

  if (data && data.length === 0)
    return (
      <div className="col-span-2 row-span-2 flex aspect-video items-center justify-center rounded-xl bg-gray-100 p-4">
        <p className="text-pretty text-center text-gray-500">No aquariums found. Please add one.</p>
      </div>
    )

  if (data && data.length > 0)
    return data.map((aquarium) => (
      <div
        key={aquarium.id}
        className={cn(
          "bg-linear-to-br from-primary/80 flex aspect-video flex-col rounded-xl to-violet-500 p-4 hover:cursor-pointer",
          aquarium.is_online ? "drop-shadow-violet-400/50 drop-shadow-lg" : "grayscale-100 shadow-lg",
        )}
        role="button"
        onClick={() => aquarium.is_online && router.push(`/aquarium/${aquarium.id}/monitoring`)}
      >
        <h2 className="text-primary-foreground truncate font-bold">{aquarium.name}</h2>

        <p className="text-primary-foreground mt-auto text-sm">{aquarium.is_online ? "Online" : "Offline"}</p>
      </div>
    ))

  return (
    <div className="col-span-2 row-span-2 flex aspect-video items-center justify-center rounded-xl bg-red-100 p-4">
      <p className="text-pretty text-center text-red-400">
        {error?.message || "Unexpected error occurred while getting aquariums."}
      </p>
    </div>
  )
})
