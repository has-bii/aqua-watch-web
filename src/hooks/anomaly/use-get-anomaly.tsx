import TSupabaseClient from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

type useGetHistoryProps = {
  supabase: TSupabaseClient
  aquarium_id: string
}

export default function useGetAnomaly({ supabase, aquarium_id }: useGetHistoryProps) {
  return useQuery({
    queryKey: ["anomaly", aquarium_id],
    queryFn: async () => {
      const queryBuilder = supabase
        .from("anomalies")
        .select("*")
        .eq("aquarium_id", aquarium_id)
        .order("created_at", { ascending: false })

      const { data, error } = await queryBuilder

      if (error) {
        toast.error(`Failed to fetch anomaly: ${error.message}`)
        throw new Error(`Error fetching anomaly: ${error.message}`)
      }

      return data
    },
  })
}
