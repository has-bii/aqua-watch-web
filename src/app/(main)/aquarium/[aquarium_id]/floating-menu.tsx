import { cn } from "@/lib/utils"
import { BellIcon, ChartNetworkIcon, ChartSplineIcon, LucideIcon, SettingsIcon, SquareActivityIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useCallback } from "react"

type Props = {
  aquarium_id: string
}

const menus: { name: string; icon: LucideIcon; href: string }[] = [
  {
    name: "Monitoring",
    icon: SquareActivityIcon,
    href: "/aquarium/[aquarium_id]/monitoring",
  },
  {
    name: "History",
    icon: ChartSplineIcon,
    href: "/aquarium/[aquarium_id]/history",
  },
  {
    name: "Predictions",
    icon: ChartNetworkIcon,
    href: "/aquarium/[aquarium_id]/predictions",
  },
  {
    name: "Alerts",
    icon: BellIcon,
    href: "/aquarium/[aquarium_id]/alerts",
  },
  {
    name: "Settings",
    icon: SettingsIcon,
    href: "/aquarium/[aquarium_id]/settings",
  },
]

export default function FloatingMenu({ aquarium_id }: Props) {
  const pathname = usePathname()

  const isActive = useCallback(
    (href: string) => {
      return pathname === href.replace("[aquarium_id]", aquarium_id)
    },
    [aquarium_id, pathname],
  )

  return (
    <div className="flex h-20 w-full">
      <div className="bg-muted border-border mx-auto flex w-fit flex-row gap-2 overflow-hidden rounded-3xl border px-3 py-2.5">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            href={menu.href.replace("[aquarium_id]", aquarium_id)}
            className={cn(
              "bg-background flex aspect-square w-16 items-center justify-center rounded-2xl",
              isActive(menu.href) && "gradient text-primary-foreground",
            )}
          >
            <menu.icon className="size-7" />
          </Link>
        ))}
      </div>
    </div>
  )
}
