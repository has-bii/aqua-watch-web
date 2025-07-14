import { Button } from "@/components/ui/button"
import useGetFeedingTimes from "@/hooks/feed/use-get-feeding-times"
import TSupabaseClient from "@/lib/supabase"
import { memo, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Database } from "@/types/database"
import { toast } from "sonner"

type FeedSectionProps = {
  aquarium_id: string
  supabase: TSupabaseClient
}

type FeedingTimes = Database["public"]["Tables"]["feeding_times"]["Row"]

const FeedSection = memo(function FeedSection(props: FeedSectionProps) {
  const { data, error } = useGetFeedingTimes(props)
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
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Feed</h2>

      <div className="flex w-full flex-row items-center justify-between rounded-xl bg-white px-4 py-3 shadow">
        <p className="text-muted-foreground text-sm font-medium">{todayFeedCount}</p>

        {/* Feed handler */}
        <Button size="sm" onClick={() => mutate()} disabled={isPending}>
          {isPending ? "Feeding..." : "Feed Now"}
        </Button>
      </div>

      <div className="flex w-full flex-row items-center justify-between rounded-xl bg-white px-4 py-3 shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="text-right">Fed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data === undefined ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center font-medium">
                  {error ? error.message : "Loading feed data..."}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center font-medium">
                  No feedings recorded yet
                </TableCell>
              </TableRow>
            ) : (
              data.map((feed, index) => (
                <TableRow key={feed.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="text-right">{format(feed.created_at, "p PP")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
})

export default FeedSection
