import TSupabaseClient from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"

type UseGetUser = {
  supabase: TSupabaseClient
}

const useGetUser = ({ supabase }: UseGetUser) =>
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        return user
      } catch (error) {
        console.error("Error fetching user:", error)
        throw error
      }
    },
  })

export default useGetUser
