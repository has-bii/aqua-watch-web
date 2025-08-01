import TSupabaseClient from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

type useGetHistoryProps = {
  supabase: TSupabaseClient
  aquarium_id: string
  query: {
    fromDate?: Date
    untilDate?: Date
    limit?: number
  }
}

export default function useGetHistory({ supabase, aquarium_id, query }: useGetHistoryProps) {
  return useQuery({
    queryKey: ["history", aquarium_id, query],
    queryFn: async () => {
      const { fromDate, limit, untilDate } = query

      const queryBuilder = supabase
        .from("measurements")
        .select("*")
        .eq("env_id", aquarium_id)
        .order("created_at", { ascending: false })

      if (fromDate) {
        queryBuilder.gte("created_at", fromDate.toISOString())
      }

      if (untilDate) {
        queryBuilder.lte("created_at", untilDate.toISOString())
      }

      if (limit) {
        queryBuilder.limit(limit)
      }

      const { data, error } = await queryBuilder

      if (error) {
        toast.error(`Failed to fetch history: ${error.message}`)
        throw new Error(`Error fetching history: ${error.message}`)
      }

      return data
    },
  })
}
