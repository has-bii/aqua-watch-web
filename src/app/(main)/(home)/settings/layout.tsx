"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BellRingIcon, LockIcon, LucideIcon, UserPenIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

type Props = {
  children: React.ReactNode
}

type MenuItem = {
  label: string
  href: string
  icon: LucideIcon
}

const menus: MenuItem[] = [
  { label: "Profile", href: "/settings/profile", icon: UserPenIcon },
  { label: "Security", href: "/settings/security", icon: LockIcon },
  { label: "Notifications", href: "/settings/notifications", icon: BellRingIcon },
]

export default function SettingsLayout({ children }: Props) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-1 flex-row gap-6">
      <Card className="h-fit w-1/5">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {menus.map((menu) => {
            const isActive = pathname.startsWith(menu.href)

            return (
              <Link
                key={menu.label}
                href={menu.href}
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
