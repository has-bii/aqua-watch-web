import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { toast } from "sonner";

export const useGetHistory = (
  supabase: TSupabaseClient,
  env_id: string,
  date: Date,
) =>
  useQuery({
    queryKey: ["history", env_id, date],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const start_date = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
        0,
      );
      const end_date = addDays(start_date, 1);

      const { data, error } = await supabase
        .from("dataset")
        .select("*")
        .eq("env_id", env_id)
        .gte("created_at", start_date.toISOString())
        .lt("created_at", end_date.toISOString())
        .order("id", { ascending: true });

      if (error) {
        toast.error("Failed to get history");
        throw error;
      }

      return data;
    },
  });
