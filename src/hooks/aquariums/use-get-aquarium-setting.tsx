import TSupabaseClient from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

type UseGetAquariumById = {
  supabase: TSupabaseClient
  aquarium_id: string
}

const useGetAquariumSetting = ({ supabase, aquarium_id }: UseGetAquariumById) =>
  useQuery({
    queryKey: ["aquarium-setting", aquarium_id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("aquarium_settings")
          .select("*")
          .eq("aquarium_id", aquarium_id)
          .single()

        if (error) throw error

        return data
      } catch (error) {
        console.error("Failed to fetch aquarium setting:", error)
        toast.error("Failed to fetch aquarium setting. Please try again.")
        throw new Error(error instanceof Error ? error.message : "Failed to fetch aquarium setting")
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

export default useGetAquariumSetting
