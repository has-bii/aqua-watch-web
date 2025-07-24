import useGetAquariumById from "@/hooks/aquariums/use-get-aquarium-by-id"
import TSupabaseClient from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { Undo2Icon } from "lucide-react"
import Link from "next/link"
import { memo } from "react"

type HeaderProps = {
  supabase: TSupabaseClient
  aquarium_id: string
  className?: string
}

const Header = memo(function Header({ className, ...props }: HeaderProps) {
  const { data, error } = useGetAquariumById(props)

  return (
    <div className={cn("text-primary-foreground flex flex-row items-center gap-3", className)}>
      {/* Back navigation */}
      <Link href="/" className="p-1">
        <Undo2Icon strokeWidth={2} size={22} />
      </Link>

      {/* Aquarium name */}
      <div className="flex-1">
        {data ? (
          <h1 className="truncate text-lg font-bold">{data.name}</h1>
        ) : (
          <h1 className="truncate text-lg font-bold">{error?.message || "Loading..."}</h1>
        )}
      </div>
    </div>
  )
})

export default Header
