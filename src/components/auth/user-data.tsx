"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useGetUser, useLogout } from "@/hooks/auth/use-get-user";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { LoaderIcon, LogInIcon, LogOutIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";

export default function UserData() {
  const supabase = createClient();
  const query = useQueryClient();
  const { mutate: logout } = useLogout({ supabase, query });
  const { data, isLoading } = useGetUser(supabase);

  if (isLoading) return <LoaderIcon className="animate-spin" />;

  if (data)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              {(data.user_metadata?.full_name as string | undefined)
                ?.split(" ")
                .map((c) => c[0].toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {data.user_metadata?.full_name?.split(" ")[0]}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => logout()}
          >
            <LogOutIcon /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

  return (
    <Button>
      Sign in <LogInIcon />
    </Button>
  );
}
