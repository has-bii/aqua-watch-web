import { Button } from "@/components/ui/button"
import useGetFeedingTimes from "@/hooks/feed/use-get-feeding-times"
import TSupabaseClient from "@/lib/supabase"
import { memo, useMemo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Database } from "@/types/database"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type FeedSectionProps = {
  aquarium_id: string
  supabase: TSupabaseClient
}

type FeedingTimes = Database["public"]["Tables"]["feeding_times"]["Row"]

const FeedSection = memo(function FeedSection(props: FeedSectionProps) {
  const { data } = useGetFeedingTimes(props)
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data: dataMutation, error: errorMutation } = await props.supabase
        .from("feeding_times")
        .insert({
          aquarium_id: props.aquarium_id,
          fed_at: new Date().toISOString(),
        })
        .select("*")
        .single()

      if (errorMutation) throw errorMutation

      return dataMutation
    },
    onSuccess: (data) => {
      // Invalidate the feed times query to refresh the data
      queryClient.setQueryData<FeedingTimes[]>(["feeding-times", props.aquarium_id], (oldData) =>
        oldData ? [data, ...oldData] : [data],
      )

      toast.success("Successfully fed the aquarium!")
    },
    onError: (error) => {
      toast.error(`Failed to feed the aquarium: ${error.message}`)
    },
  })

  // Today's feed count
  const todayFeedCount = useMemo(() => {
    if (!data) return "Loading..."

    const count = data.length

    return count > 0 ? `Fed today: ${count} times` : "No feedings today"
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feed</CardTitle>
      </CardHeader>

      <CardContent className="space-y-1">
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm font-medium">{todayFeedCount}</p>

          {/* Feed handler */}
          <Button size="sm" onClick={() => mutate()} disabled={isPending}>
            {isPending ? "Feeding..." : "Feed Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

export default FeedSection
