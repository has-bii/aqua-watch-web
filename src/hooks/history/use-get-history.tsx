import TSupabaseClient from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { endOfDay, startOfDay } from "date-fns"
import { toast } from "sonner"

type useGetHistoryProps = {
  supabase: TSupabaseClient
  aquarium_id: string
  query: {
    fromDate: Date
  }
}

export default function useGetHistory({ supabase, aquarium_id, query }: useGetHistoryProps) {
  return useQuery({
    queryKey: ["history", aquarium_id, query],
    queryFn: async () => {
      const { fromDate } = query

      // Format dates to ISO strings
      const from = startOfDay(fromDate).toISOString()
      const until = endOfDay(fromDate).toISOString()

      // Fetch history data from Supabase
      const { data, error } = await supabase
        .from("measurements")
        .select("*")
        .eq("env_id", aquarium_id)
        .order("created_at", { ascending: false })
        .gte("created_at", from)
        .lte("created_at", until)

      if (error) {
        toast.error(`Failed to fetch history: ${error.message}`)
        throw new Error(`Error fetching history: ${error.message}`)
      }

      return data
    },
  })
}
