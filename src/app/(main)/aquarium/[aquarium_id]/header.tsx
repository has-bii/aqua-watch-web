import UserHeader from "@/components/user-header"
import TSupabaseClient from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { FishSymbolIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { memo } from "react"

type HeaderProps = {
  supabase: TSupabaseClient
  aquarium_id: string
}

const menuItems = [
  { label: "Monitoring", href: "/aquarium/[aquarium_id]/monitoring" },
  { label: "History", href: "/aquarium/[aquarium_id]/history" },
  { label: "Prediction", href: "/aquarium/[aquarium_id]/prediction" },
  { label: "Anomaly", href: "/aquarium/[aquarium_id]/anomaly" },
  { label: "Missing Measurements", href: "/aquarium/[aquarium_id]/missing-measurements" },
  { label: "Settings", href: "/aquarium/[aquarium_id]/settings/general" },
]

const Header = memo(function Header({ ...props }: HeaderProps) {
  const pathname = usePathname()

  return (
    <nav className="border-border backdrop-blur-xs h-16 w-full rounded-2xl border bg-transparent px-6 shadow-sm">
      <div className="flex h-full items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <FishSymbolIcon strokeWidth={1.5} />
          <span className="text-sm font-medium text-gray-900">Aqua Watch</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href.replace("[aquarium_id]", props.aquarium_id)}
              className={cn(
                "text-sm hover:text-gray-900",
                pathname === item.href.replace("[aquarium_id]", props.aquarium_id) && "font-medium text-gray-900",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Profile */}
        <UserHeader />
      </div>
    </nav>
  )
})

export default Header
