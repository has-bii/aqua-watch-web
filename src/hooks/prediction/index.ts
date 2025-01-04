import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type TPrediction = {
  data: {
    predictions: { timestamp: string; temperature: number }[];
    averages: { time: number; avg_temp: number; normalize: number }[];
    accuracy: {
      mse: number;
      r2: number;
    };
  };
};

export const useGetPrediction = (env_id: string) =>
  useQuery({
    queryKey: ["prediction", env_id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const res = await fetch(`/api/get-prediction?env_id=${env_id}`);

        if (!res.ok) throw new Error();

        return (await res.json()) as TPrediction;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("An error occurred while getting predictions");
      }
    },
  });
