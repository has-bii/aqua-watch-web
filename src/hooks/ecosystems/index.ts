import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetEcosystems = (supabase: TSupabaseClient) =>
  useQuery({
    queryKey: ["ecosystems"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ecosystems").select("*");

      if (error) {
        toast.error("Failed to get ecosystems");
        throw error;
      }

      return data;
    },
  });
