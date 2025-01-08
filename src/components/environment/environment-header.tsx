"use client";

import { useGetEnvironmentById } from "@/hooks/environment";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { H2 } from "../typography";
import { Badge } from "../ui/badge";
import { dateFormat } from "@/lib/date-helper";
import { Skeleton } from "../ui/skeleton";
import { usePathname } from "next/navigation";

type Props = {
  id: string;
  ecosystem_slug: string;
};

const tabs: string[] = ["overview", "history", "settings"];

export default function EnvironmentHeader({ id, ecosystem_slug }: Props) {
  const pathname = usePathname();
  const supabase = createClient();
  const { data: dataEnvironment } = useGetEnvironmentById(supabase, id);

  const pagePathname = React.useMemo(
    () => pathname.split("/").pop(),
    [pathname],
  );

  if (dataEnvironment)
    return (
      //
      <div className="flex w-full flex-col border-b border-border px-4">
        <div className="flex w-full items-start gap-4 py-8">
          {/* Back Navigation */}
          <Link
            href={`/dashboard/${ecosystem_slug}`}
            className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
          >
            <ChevronLeft />
          </Link>

          <div className="flex flex-1 flex-col gap-4 lg:flex-row">
            <div className="space-y-1">
              <H2>{dataEnvironment?.name}</H2>
              <Badge variant="default">{dataEnvironment?.env_type}</Badge>
            </div>

            <div className="flex flex-col gap-2 lg:ml-auto lg:flex-row lg:items-center lg:gap-6">
              <div className="inline-flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="active">Active</Badge>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Created on
                </span>
                <span className="text-sm">
                  {dateFormat(dataEnvironment.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-10 flex items-center gap-4">
          {tabs.map((tab) => (
            <Link
              key={tab}
              href={`/dashboard/${ecosystem_slug}/${id}/${tab}`}
              className={cn(
                "border-primary px-3 py-2 text-sm capitalize",
                pagePathname === tab ? "border-b-2" : "text-muted-foreground",
              )}
            >
              {tab}
            </Link>
          ))}
        </div>
      </div>
    );

  return (
    //
    <div className="flex w-full flex-col border-b border-border px-4">
      <div className="flex w-full items-start gap-4 py-8">
        {/* Back Navigation */}
        <Link
          href={`/dashboard/${ecosystem_slug}`}
          className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
        >
          <ChevronLeft />
        </Link>

        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          <div className="space-y-1">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-6 w-20" />
          </div>

          <div className="inline-flex items-center gap-2 lg:ml-auto">
            <div className="inline-flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Created on</span>
              <span className="text-sm">
                <Skeleton className="h-4 w-20" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-10 flex items-center gap-4">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={`/dashboard/${ecosystem_slug}/${id}/${tab}`}
            className={cn(
              "border-primary px-3 py-2 text-sm capitalize",
              pathname?.startsWith(`/dashboard/${ecosystem_slug}/${id}/${tab}`)
                ? "border-b-2"
                : "text-muted-foreground",
            )}
          >
            {tab}
          </Link>
        ))}
      </div>
    </div>
  );
}
