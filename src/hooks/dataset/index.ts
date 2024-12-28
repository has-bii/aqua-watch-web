import { TDataset } from "@/types/model";
import { TSupabaseClient } from "@/utils/supabase/server";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetDataset = (supabase: TSupabaseClient, env_id: string) =>
  useQuery({
    queryKey: ["dataset", env_id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dataset")
        .select("*")
        .eq("env_id", env_id)
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        toast.error("Failed to get measurements");
        throw error;
      }

      return data[0];
    },
  });

export const updateDataset = (
  query: QueryClient,
  env_id: string,
  data: TDataset,
) => query.setQueryData(["dataset", env_id], () => data);
