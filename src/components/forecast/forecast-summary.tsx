"use client";

import React from "react";
import { useGetPrediction } from "@/hooks/prediction";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Skeleton } from "../ui/skeleton";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetEnvironmentById } from "@/hooks/environment";
import { createClient } from "@/utils/supabase/client";
import { differenceInCalendarDays } from "date-fns";
import Anomaly from "../anomaly/anomaly";
import { Button } from "../ui/button";

type Props = {
  env_id: string;
};

export default function ForecastSummary({ env_id }: Props) {
  const supabase = createClient();
  const { data: predictions } = useGetPrediction(env_id);
  const { data: dataEnvironment } = useGetEnvironmentById(supabase, env_id);

  const accuracyStyle = React.useCallback((acc: number) => {
    if (acc > 80) return { bg: "bg-green-400/20", indicator: "bg-green-400" };
    else if (acc > 50)
      return { bg: "bg-yellow-400/20", indicator: "bg-yellow-400" };
    return { bg: "bg-red-400/20", indicator: "bg-red-400" };
  }, []);

  const errorRateStyle = React.useCallback((acc: number) => {
    if (acc < 20) return { bg: "bg-green-400/20", indicator: "bg-green-400" };
    else if (acc < 40)
      return { bg: "bg-yellow-400/20", indicator: "bg-yellow-400" };
    return { bg: "bg-red-400/20", indicator: "bg-red-400" };
  }, []);

  const uptime = React.useMemo((): string => {
    if (dataEnvironment === undefined) return "Loading...";

    const { created_at } = dataEnvironment;
    const current_date = new Date();

    return `${differenceInCalendarDays(current_date, created_at)} days`;
  }, [dataEnvironment]);

  if (predictions) {
    const {
      data: { accuracy, anomalies },
    } = predictions;

    return (
      <>
        {/* Accuracy */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Overall Accuracy</CardTitle>
            <CardDescription>
              Higher accuracy means better results
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <span className="text-2xl font-semibold">{`${(accuracy.r2 * 100).toFixed(0)}%`}</span>
            <Progress
              value={100 * accuracy.r2}
              className={accuracyStyle(100 * accuracy.r2).bg}
              indicatorClassname={accuracyStyle(100 * accuracy.r2).indicator}
            />
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Error Rate</CardTitle>
            <CardDescription>
              Lower error rate means better results
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <span className="text-2xl font-semibold">{`${(accuracy.mse * 100).toFixed(0)}%`}</span>
            <Progress
              value={100 * accuracy.mse}
              className={errorRateStyle(100 * accuracy.mse).bg}
              indicatorClassname={errorRateStyle(100 * accuracy.mse).indicator}
            />
          </CardContent>
        </Card>

        {/* Anomalies */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Anomalies</CardTitle>
            <CardDescription>
              Anomalies are unusual patterns detected by the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto flex items-center gap-2">
            <p className="text-2xl font-semibold">{`${anomalies.length} detected`}</p>
            <TriangleAlert
              className={cn(anomalies.length !== 0 && "text-red-400")}
            />
            <Anomaly data={anomalies}>
              <Button size="sm" className="ml-auto" variant="secondary">
                Review
              </Button>
            </Anomaly>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Device Uptime</CardTitle>
            <CardDescription>
              Showing how long the device has been running without
              interruptions.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto flex items-center gap-2">
            <p className="text-xl font-semibold">{uptime}</p>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full" />
      ))}
    </>
  );
}
