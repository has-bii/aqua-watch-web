"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { useGetEcosystems } from "@/hooks/ecosystems";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetEnvironments } from "@/hooks/environment";
import { cn } from "@/lib/utils";

type Props = {
  ecosystem_slug: string;
  id?: string;
};

export default function SelectedEcosystem({ ecosystem_slug, id }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const { data: ecosystems } = useGetEcosystems(supabase);
  const { data: environments } = useGetEnvironments(supabase);

  const currentEcosystem = React.useMemo(() => {
    if (ecosystems === undefined) return undefined;

    if (ecosystem_slug === "no-ecosystem") return "No Ecosystem";

    return ecosystems.find((e) => ecosystem_slug === e.slug)?.name;
  }, [ecosystems, ecosystem_slug]);

  const currentEnvironments = React.useMemo(() => {
    if (id === undefined || environments === undefined) return undefined;

    return environments.find((env) => env.id === id)?.name;
  }, [id, environments]);

  if (ecosystems)
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              {currentEcosystem} <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Current Ecosystem</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={ecosystem_slug}
              onValueChange={(v) => {
                router.push(`/dashboard/${v}`);
              }}
            >
              <DropdownMenuRadioItem value="no-ecosystem">
                No Ecosystem
              </DropdownMenuRadioItem>
              {ecosystems.map((ecosystem) => (
                <DropdownMenuRadioItem
                  key={ecosystem.id}
                  value={ecosystem.slug}
                >
                  {ecosystem.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <span
          className={
            id !== undefined ? "block text-sm text-muted-foreground" : "hidden"
          }
        >
          /
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(id === undefined ? "hidden" : "")}
            >
              {currentEnvironments} <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Current Aquarium/Pond</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={id}
              onValueChange={(v) => {
                router.push(`/dashboard/${ecosystem_slug}/${v}`);
              }}
            >
              {environments
                ?.filter((e) => {
                  if (
                    ecosystem_slug === "no-ecosystem" &&
                    e.ecosystem_slug === null
                  )
                    return true;

                  return e.ecosystem_slug === ecosystem_slug;
                })
                .map((env) => (
                  <DropdownMenuRadioItem key={env.id} value={env.id}>
                    {env.name}
                  </DropdownMenuRadioItem>
                ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );

  return <Skeleton className="h-6 w-20" />;
}
