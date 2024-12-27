"use client";

import DashboardContent from "@/components/dashboard/dashboard-content";
import DashboardTop from "@/components/dashboard/dashboard-top";
import Environment from "@/components/environment/environment";
import EnvironmentAdd from "@/components/environment/environment-add";
import SelectedEcosystem from "@/components/top-navigation/selected-ecosystem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEnvironmentBySlug } from "@/hooks/environment";
import { createClient } from "@/utils/supabase/client";
import { PlusIcon } from "lucide-react";
import React, { use } from "react";

type Props = {
  params: Promise<{ ecosystem_slug: string }>;
};

export default function Page({ params }: Props) {
  const { ecosystem_slug } = use(params);
  const supabase = createClient();
  const { data: environments } = useGetEnvironmentBySlug(
    supabase,
    ecosystem_slug,
  );

  return (
    <>
      <DashboardTop>
        <SelectedEcosystem params={params} />
      </DashboardTop>

      <DashboardContent>
        <div className="flex h-full w-full flex-1 flex-col gap-4">
          {environments === undefined ? (
            <Skeleton className="h-44 w-full" />
          ) : (
            <>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2">
                  <span className="font-medium">All Aquariums/Ponds</span>
                  <EnvironmentAdd>
                    <Button size="sm">New Aquarium/Pond</Button>
                  </EnvironmentAdd>
                </div>
                {environments.length !== 0 ? (
                  environments.map((environment) => (
                    <Environment key={environment.id} data={environment} />
                  ))
                ) : (
                  <div className="flex h-32 w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed">
                    <span className="font-medium">No aquarium/pond</span>
                    <span className="text-sm text-muted-foreground">
                      Get started by creating a new aquarium/pond
                    </span>
                    <EnvironmentAdd>
                      <Button className="mt-2" size="sm">
                        <PlusIcon />
                        New Aquarium/Pond
                      </Button>
                    </EnvironmentAdd>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DashboardContent>
    </>
  );
}
