import { TSupabaseClient } from "@/utils/supabase/server";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

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

type TUseLogout = {
  supabase: TSupabaseClient;
  query: QueryClient;
};

export const useLogout = ({ query, supabase }: TUseLogout) =>
  useMutation({
    mutationFn: async () => await supabase.auth.signOut(),
    onSuccess: () => query.invalidateQueries({ queryKey: ["user-session"] }),
  });
