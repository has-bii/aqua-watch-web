"use client";

import Figure from "@/components/figure/figure";
import { FigureChart } from "@/components/figure/figure-chart";
import { updateDataset, useGetDataset } from "@/hooks/dataset";
import { TDataset } from "@/types/model";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
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

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          <Figure
            title="Temperature"
            figure={`${measurements?.temp.toPrecision(4)}°C`}
            Icon={ThermometerIcon}
            isLoading={isLoading}
          />
          <Figure
            title="pH Level"
            figure="7.2"
            Icon={TestTubeIcon}
            isLoading={isLoading}
          />
          <Figure
            title="Oxygen"
            figure="8 mg/L"
            Icon={WavesIcon}
            isLoading={isLoading}
          />
          <Figure
            title="Clarity"
            figure="98%"
            Icon={DropletIcon}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-2">
          <FigureChart />
        </div>
      </div>
    </>
  );
}
