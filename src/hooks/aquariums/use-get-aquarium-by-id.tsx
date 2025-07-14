import TSupabaseClient from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"

type UseGetAquariumById = {
  supabase: TSupabaseClient
  aquarium_id: string
}

const useGetAquariumById = ({ supabase, aquarium_id }: UseGetAquariumById) =>
  useQuery({
    queryKey: ["aquarium", aquarium_id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("aquarium").select("*").eq("id", aquarium_id).single()

        if (error) throw error

        return data
      } catch (error) {
        console.error("Failed to fetch aquarium:", error)
        throw new Error(error instanceof Error ? error.message : "Failed to fetch aquarium")
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

export default useGetAquariumById
