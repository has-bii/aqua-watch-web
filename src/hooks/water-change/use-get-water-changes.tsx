import TSupabaseClient from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"

type useGetWaterChangesProps = {
  aquarium_id: string
  supabase: TSupabaseClient
}

const useGetWaterChanges = ({ aquarium_id, supabase }: useGetWaterChangesProps) => {
  return useQuery({
    queryKey: ["water-changes", aquarium_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("water_changing_times")
        .select("*")
        .eq("aquarium_id", aquarium_id)
        .order("changed_at", { ascending: false })
        .limit(5)

      if (error) throw error

      return data
    },
  })
}

export default useGetWaterChanges
