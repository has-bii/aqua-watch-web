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
    <div className={cn("text-foreground flex w-full flex-row items-center justify-between gap-2", className)}>
      {/* Aquarium name */}
      <h1 className="w-fit truncate text-xl font-semibold">{aquariumName}</h1>

      {/* Back navigation */}
      <Link href="/" className="bg-muted border-border rounded-xl border p-1.5">
        <ArrowLeftIcon strokeWidth={2} className="size-6" />
      </Link>
    </div>
  )
})

export default Header
