import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetEnvironments = (supabase: TSupabaseClient) =>
  useQuery({
    queryKey: ["environments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("environment").select("*");

      if (error) {
        toast.error("Failed to get ecosystems");
        throw error;
      }

      return data;
    },
  });
