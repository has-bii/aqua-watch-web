import useGetAquariumById from "@/hooks/aquariums/use-get-aquarium-by-id"
import TSupabaseClient from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { memo, useMemo } from "react"

type HeaderProps = {
  supabase: TSupabaseClient
  aquarium_id: string
  className?: string
}

const Header = memo(function Header({ className, ...props }: HeaderProps) {
  const { data, error, isLoading } = useGetAquariumById(props)

  const aquariumName = useMemo((): string => {
    if (isLoading) {
      return "Loading..."
    }

    if (error) {
      return error.message || "Error loading aquarium"
    }

    return data?.name || "No Name"
  }, [data, error, isLoading])

  return (
    <div className={cn("text-primary-foreground flex w-full flex-row items-center gap-2", className)}>
      {/* Back navigation */}
      <Link href="/" className="p-1">
        <ArrowLeftIcon strokeWidth={2} size={22} />
      </Link>

      {/* Aquarium name */}
      <div className="flex-1">
        <h1 className="truncate text-xl font-semibold">{aquariumName}</h1>
      </div>
    </div>
  )
})

export default Header
