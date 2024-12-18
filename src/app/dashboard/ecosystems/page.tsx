"use client";

import Environment from "@/components/environment/environment";
import EnvironmentAdd from "@/components/environment/environment-add";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEcosystems } from "@/hooks/ecosystems";
import { useGetEnvironments } from "@/hooks/environment";
import { createClient } from "@/utils/supabase/client";
import { PlusIcon } from "lucide-react";
import React from "react";

export default function AllEcosystems() {
  const supabase = createClient();
  const { data: ecosystems } = useGetEcosystems(supabase);
  const { data: environments } = useGetEnvironments(supabase);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="inline-flex items-center gap-4">
        <Button size="sm">New Ecosytem</Button>
        <Button size="sm" variant="secondary">
          New Aquarium
        </Button>
      </div>

      {ecosystems === undefined || environments === undefined ? (
        <Skeleton className="h-44 w-full" />
      ) : (
        <>
          {/* No ecosystems */}
          <div className="space-y-3">
            <span className="font-medium">No Ecosystem</span>
            {environments
              .filter((env) => !env.ecosystem_slug)
              .map((environment) => (
                <Environment key={environment.id} data={environment} />
              ))}
          </div>
          {ecosystems.map((ecosystem) => {
            const filtered = environments.filter(
              (env) => env.ecosystem_slug === ecosystem.slug,
            );
            const isEmpty = filtered.length === 0;

            return (
              <div key={ecosystem.id} className="space-y-2">
                <span className="font-medium">{ecosystem.name}</span>
                {isEmpty ? (
                  <div className="flex h-32 w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed">
                    <span className="font-medium">No aquarium/pond</span>
                    <span className="text-sm text-muted-foreground">
                      Get started by creating a new aquarium/pond
                    </span>
                    <EnvironmentAdd ecosystem_slug={ecosystem.slug}>
                      <Button className="mt-2" size="sm">
                        <PlusIcon />
                        New Aquarium/Pond
                      </Button>
                    </EnvironmentAdd>
                  </div>
                ) : (
                  filtered.map((environment) => (
                    <Environment key={environment.id} data={environment} />
                  ))
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
