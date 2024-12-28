import { Database } from "@/types/database";
import { TEnvironemnt } from "@/types/model";
import { TSupabaseClient } from "@/utils/supabase/server";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
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

export const useGetEnvironmentById = (supabase: TSupabaseClient, id: string) =>
  useQuery({
    queryKey: ["environment", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("environment")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error(error.message);
        throw error;
      }

      return data;
    },
  });

export const useGetEnvironmentBySlug = (
  supabase: TSupabaseClient,
  env_slug: string,
) =>
  useQuery({
    queryKey: ["environments", env_slug],
    queryFn: async () => {
      const query = supabase.from("environment").select("*");

      if (env_slug === "no-ecosystem") query.is("ecosystem_slug", null);
      else query.eq("ecosystem_slug", env_slug);

      const { error, data } = await query;

      if (error) {
        toast.error("Failed to get ecosystems");
        throw error;
      }

      return data;
    },
  });

type UseAddEnvironment = {
  query: QueryClient;
  supabase: TSupabaseClient;
  onSucces?: () => void;
};

export const useAddEnvironment = ({
  query,
  supabase,
  onSucces,
}: UseAddEnvironment) =>
  useMutation({
    mutationFn: async (
      payload: Database["public"]["Tables"]["environment"]["Insert"],
    ) => {
      const { data, error } = await supabase
        .from("environment")
        .insert(payload)
        .select("*")
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    onSuccess: (data) => {
      toast.success(`${data.name} has been created`);
      query.setQueryData<TEnvironemnt[]>(["environments"], (prev) =>
        prev ? [...prev, data] : [data],
      );
      if (onSucces) onSucces();
    },
    onError: (error) => toast.error(error.message),
  });
