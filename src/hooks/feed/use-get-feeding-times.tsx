import TSupabaseClient from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { startOfDay } from "date-fns"

type useGetFeedingTimes = {
  supabase: TSupabaseClient
  aquarium_id: string
}

const useGetFeedingTimes = ({ supabase, aquarium_id }: useGetFeedingTimes) => {
  return useQuery({
    queryKey: ["feeding-times", aquarium_id],
    queryFn: async () => {
      const todayTimestamp = startOfDay(new Date()).toISOString()

      const { data, error } = await supabase
        .from("feeding_times")
        .select("*")
        .eq("aquarium_id", aquarium_id)
        .gte("created_at", todayTimestamp)

      if (error) throw new Error(error.message)

      return data
    },
  })
}

export default useGetFeedingTimes
