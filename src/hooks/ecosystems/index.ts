import { Database } from "@/types/database";
import { TEcosystem } from "@/types/model";
import { TSupabaseClient } from "@/utils/supabase/server";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
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

type useAddEcosystem = {
  query: QueryClient;
  supabase: TSupabaseClient;
  onSucces?: () => void;
};

export const useAddEcosystem = ({
  query,
  supabase,
  onSucces,
}: useAddEcosystem) =>
  useMutation({
    mutationFn: async (
      payload: Database["public"]["Tables"]["ecosystems"]["Insert"],
    ) => {
      const { data, error } = await supabase
        .from("ecosystems")
        .insert(payload)
        .select("*")
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    onSuccess: (data) => {
      toast.success(`${data.name} has been created`);
      query.setQueryData<TEcosystem[]>(["ecosystems"], (prev) =>
        prev ? [...prev, data] : [data],
      );
      if (onSucces) onSucces();
    },
    onError: (error) => toast.error(error.message),
  });
