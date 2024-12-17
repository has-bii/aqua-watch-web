"use client";

import { useGetUser } from "@/hooks/auth/use-get-user";
import { createClient } from "@/utils/supabase/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronsUpDown } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function UserSidebar() {
  const supabase = createClient();
  const { data, isLoading } = useGetUser(supabase);

  if (data)
    return (
      <>
        <Avatar className="h-9 w-9 rounded-lg">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>
            {(data.user_metadata?.full_name as string | undefined)
              ?.split(" ")
              .map((c) => c[0].toUpperCase())
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col">
          <span className="font-medium">
            {data.user_metadata?.full_name?.split(" ")[0]}
          </span>
          <span className="max-w-36 truncate text-xs">{data.email}</span>
        </div>
        <ChevronsUpDown role="button" className="ml-auto" />
      </>
    );

  if (isLoading)
    return (
      <>
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-3/4 rounded-lg" />
          <Skeleton className="h-3 w-full rounded-lg" />
        </div>
      </>
    );
}
