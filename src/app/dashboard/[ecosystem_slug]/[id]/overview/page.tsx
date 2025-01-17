"use client";

import Figure from "@/components/figure/figure";
import Forecast from "@/components/forecast/forecast";
import ForecastDetail from "@/components/forecast/forecast-detail";
import ForecastSummary from "@/components/forecast/forecast-summary";
import { updateDataset, useGetDataset } from "@/hooks/dataset";
import { TDataset } from "@/types/model";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { compareAsc } from "date-fns";
import {
  DropletIcon,
  TestTubeIcon,
  ThermometerIcon,
  WavesIcon,
} from "lucide-react";
import React from "react";

type Props = {
  params: Promise<{ ecosystem_slug: string; id: string }>;
};

export default function Overview({ params }: Props) {
  const { id: env_id } = React.use(params);
  const supabase = createClient();
  const { data: measurements, isLoading } = useGetDataset(supabase, env_id);
  const query = useQueryClient();

  React.useEffect(() => {
    const channel = supabase
      .channel("realtime measurement")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dataset" },
        (payload) => {
          updateDataset(query, env_id, payload.new as TDataset);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [env_id, query, supabase]);

  const sortedMeasurement = React.useMemo(() => {
    if (measurements === undefined) return [];

    const temp = [...measurements].sort((a, b) =>
      compareAsc(a.created_at, b.created_at),
    );

    return temp;
  }, [measurements]);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          <Figure
            title="Temperature"
            figure={`${measurements !== undefined ? (measurements.length !== 0 ? measurements[0].temp.toPrecision(4) : "Null") : "Null"}°C`}
            Icon={ThermometerIcon}
            isLoading={isLoading}
            recent={sortedMeasurement.map((d) => ({ data: d.temp }))}
          />
          <Figure
            title="pH Level"
            figure="Soon"
            Icon={TestTubeIcon}
            isLoading={isLoading}
            recent={[]}
          />
          <Figure
            title="Oxygen"
            figure="Soon"
            Icon={WavesIcon}
            isLoading={isLoading}
            recent={[]}
          />
          <Figure
            title="Clarity"
            figure="Soon"
            Icon={DropletIcon}
            isLoading={isLoading}
            recent={[]}
          />
        </div>

        <Forecast env_id={env_id} />
      </div>

      <div className="grid grid-cols-4 gap-6">
        <ForecastSummary env_id={env_id} />
      </div>

      <ForecastDetail env_id={env_id} />
    </div>
  );
}
