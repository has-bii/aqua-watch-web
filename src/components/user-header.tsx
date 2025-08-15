import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import useGetUser from "@/hooks/use-get-user"
import useSupabase from "@/lib/supabase/client"

export default function UserHeader() {
  const supabase = useSupabase()
  const { data: user } = useGetUser({ supabase })

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>
          {user?.user_metadata.full_name
            ? user.user_metadata.full_name
                .split(" ")
                .map((name: string) => name[0].toUpperCase())
                .join("")
            : "US"}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm">{user?.user_metadata.full_name ?? "Loading..."}</span>
    </div>
  )
}
