import TSupabaseClient from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

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
        toast.error(`Failed to load user data: ${error instanceof Error ? error.message : "Unknown error"}`)
        throw error
      }
    },
  })

export default useGetUser
