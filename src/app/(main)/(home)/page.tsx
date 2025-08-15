"use client"

import useGetAquariums from "@/hooks/aquariums/use-get-aquariums"
import useSupabase from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { buttonVariants } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

export default function Home() {
  const supabase = useSupabase()
  const { data: aquariums } = useGetAquariums({ supabase })

  return (
    <div className="grid w-full grid-cols-4 gap-4">
      {!aquariums
        ? Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="h-fit w-full">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="aspect-video w-full" />
              </CardContent>
            </Card>
          ))
        : aquariums.map((aquarium) => (
            <Card key={aquarium.id} className="h-fit w-full">
              <CardHeader>
                <CardTitle>{aquarium.name}</CardTitle>
                <CardDescription>{aquarium.desc || "No description available."}</CardDescription>
                <CardAction>
                  <Link href={`/aquarium/${aquarium.id}/monitoring`} className={cn(buttonVariants({ size: "sm" }))}>
                    Details <ArrowUpRight />
                  </Link>
                </CardAction>
              </CardHeader>
              <CardContent className="flex">
                <div className="mt-auto space-y-0.5">
                  <p className="text-2xl font-medium">{aquarium.is_online ? "Online" : "Offline"}</p>
                  <p className="text-muted-foreground text-sm font-light">
                    {aquarium.online_at ? `Online ${formatDistanceToNow(aquarium.online_at)}` : "No online data"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
    </div>
  )
}
