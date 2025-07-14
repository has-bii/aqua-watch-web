import TSupabaseClient from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"

type UseGetAquariums = {
  supabase: TSupabaseClient
}

const useGetAquariums = ({ supabase }: UseGetAquariums) =>
  useQuery({
    queryKey: ["aquariums"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("aquarium")
          .select("*")
          .order("is_online", { ascending: false })
          .order("created_at", { ascending: false })

        if (error) throw error

        return data
      } catch (error) {
        console.error("Failed to fetch aquariums:", error)
        throw new Error(error instanceof Error ? error.message : "Failed to fetch aquariums")
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

export default useGetAquariums
