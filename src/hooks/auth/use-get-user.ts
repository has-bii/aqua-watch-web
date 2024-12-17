import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (supabase: TSupabaseClient) =>
  useQuery({
    queryKey: ["user-session"],
    retry: false,
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      return user;
    },
  });
