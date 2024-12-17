"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useGetUser } from "@/hooks/auth/use-get-user";
import { createClient } from "@/utils/supabase/client";
import { buttonVariants } from "../ui/button";
import { LoaderIcon, LogInIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { logout } from "@/app/auth/actions";

export default function UserData() {
  const supabase = createClient();
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
          <DropdownMenuItem asChild>
            <Link href="/dashboard/account">
              <SettingsIcon />
              Account
            </Link>
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
    <Link href="/auth/sign-in" className={cn(buttonVariants())}>
      Sign in <LogInIcon />
    </Link>
  );
}
