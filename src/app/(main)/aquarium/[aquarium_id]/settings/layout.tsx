"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon, SettingsIcon, SlidersHorizontalIcon, WrenchIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { use } from "react"

type Props = {
  children: React.ReactNode
  params: Promise<{ aquarium_id: string }>
}

type MenuItem = {
  label: string
  href: string
  icon: LucideIcon
}

const menus: MenuItem[] = [
  { label: "General", href: "/aquarium/[aquarium_id]/settings/general", icon: SettingsIcon },
  { label: "Prediction", href: "/aquarium/[aquarium_id]/settings/prediction", icon: SlidersHorizontalIcon },
  { label: "Anomaly", href: "/aquarium/[aquarium_id]/settings/anomaly", icon: WrenchIcon },
]

export default function AquariumSettingsLayout({ children, params }: Props) {
  const { aquarium_id } = use(params)
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-1 flex-row gap-6">
      <Card className="h-fit w-1/5">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {menus.map((menu) => {
            const isActive = pathname === menu.href.replace("[aquarium_id]", aquarium_id)

            return (
              <Link
                key={menu.label}
                href={menu.href.replace("[aquarium_id]", aquarium_id)}
                className={cn("hover:bg-muted flex items-center gap-2 rounded-md px-3 py-2", isActive && "bg-muted")}
              >
                <menu.icon className="text-muted-foreground size-4" />
                <span className={cn("text-sm", isActive && "font-medium text-gray-900")}>{menu.label}</span>
              </Link>
            )
          })}
        </CardContent>
      </Card>
      <div className="flex-1">{children}</div>
    </div>
  )
}
