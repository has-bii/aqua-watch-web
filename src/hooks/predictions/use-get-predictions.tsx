import TSupabaseClient from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Database } from "@/types/database"

type TARGET_PARAMETER = Database["public"]["Enums"]["sensor_type"]

type useGetPredictions = {
  supabase: TSupabaseClient
  aquarium_id: string
  query: {
    fromDate: Date
    target_parameter: TARGET_PARAMETER
  }
}

export default function useGetPredictions({ supabase, aquarium_id, query }: useGetPredictions) {
  return useQuery({
    queryKey: ["predictions", aquarium_id, query],
    queryFn: async () => {
      const { fromDate, target_parameter } = query

      // Fetch history data from Supabase
      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("aquarium_id", aquarium_id)
        .eq("target_parameter", target_parameter)
        .order("target_time", { ascending: true })
        .gte("target_time", fromDate.toISOString())

      if (error) {
        toast.error(`Failed to fetch predictions: ${error.message}`)
        throw new Error(`Error fetching predictions: ${error.message}`)
      }

      return data
    },
  })
}
