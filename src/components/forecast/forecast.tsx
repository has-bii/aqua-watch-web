import { useGetPrediction } from "@/hooks/prediction";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type Props = {
  env_id: string;
};

type Option = "temperature" | "pH Level";

export default function Forecast({ env_id }: Props) {
  const { data: predictions, error } = useGetPrediction(env_id);
  const [selected, setSelected] = React.useState<Option>("temperature");

  const data = React.useMemo(() => {
    if (predictions === undefined) return undefined;

    if (selected === "temperature")
      return predictions.data.averages.map((avg) => ({
        data: avg.avg_temp,
        time: avg.time,
        normalize: `${(avg.normalize * 100).toFixed(0)}%`,
      }));

    return predictions.data.averages.map((avg) => ({
      data: avg.avg_temp,
      time: avg.time,
      normalize: `${(avg.normalize * 100).toFixed(0)}%`,
    }));
  }, [predictions, selected]);

  const parse_hour = React.useCallback((hour: number): string => {
    const current = new Date();
    const parsed = new Date(
      Date.UTC(
        current.getFullYear(),
        current.getMonth(),
        current.getDay(),
        hour,
      ),
    );

    return `${parsed.getHours().toString()} ${parsed.getHours() < 12 ? "AM" : "PM"}`;
  }, []);

  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-destructive bg-destructive/10 px-3 py-4 text-destructive">
        {error.message}
      </div>
    );

  if (data)
    return (
      <div className="flex h-full w-full flex-col gap-6">
        {/* Header */}
        <div className="inline-flex w-full items-center justify-between">
          <h2 className="text-lg font-medium">Next Hours</h2>
          <Select
            value={selected}
            onValueChange={(v) => setSelected(v as Option)}
          >
            <SelectTrigger className="w-[180px] bg-background capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="capitalize">
              {["temperature", "pH Level"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <Carousel className="h-full w-full">
          <CarouselContent className="h-full w-full">
            {data.map(({ data: d, time, normalize }) => (
              <CarouselItem
                key={time}
                className="flex h-full w-full basis-1/5 flex-col gap-2 pl-4"
              >
                <div className="relative flex h-full w-full flex-col justify-end overflow-hidden rounded-lg bg-sky-200">
                  <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-white">
                    {`${d}°C`}
                  </span>
                  <div
                    style={{ height: normalize }}
                    className="wave w-full rounded-t-lg bg-sky-400"
                  />
                </div>
                <div className="px-2 text-center text-muted-foreground">
                  {parse_hour(time)}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );

  return (
    <div className="flex h-full w-full gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-full flex-1 rounded-xl" />
      ))}
    </div>
  );
}
