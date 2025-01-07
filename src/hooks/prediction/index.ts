import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export type TPrediction = {
  data: {
    predictions: Array<{
      timestamp: string;
      temperature: number;
    }>;
    averages: Array<{
      time: number;
      normalize: number;
      avg_temp: number;
    }>;
    accuracy: {
      mse: number;
      r2: number;
    };
    min: number;
    max: number;
    anomalies: Array<{
      start_time: string;
      end_time: string;
      data: Array<{
        id: number;
        temp: number;
        date_time: string;
      }>;
    }>;
  };
  count: number;
};

export const useGetPrediction = (env_id: string) =>
  useQuery({
    queryKey: ["prediction", env_id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const res = await fetch(`/api/get-prediction?env_id=${env_id}`);

        if (!res.ok) throw new Error();

        const body = (await res.json()) as TPrediction;

        return body?.data !== undefined ? body : null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("An error occurred while getting predictions");
      }
    },
  });
