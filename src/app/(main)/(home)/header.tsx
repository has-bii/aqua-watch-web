"use client"

import { FishSymbolIcon } from "lucide-react"
import Link from "next/link"
import React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import UserHeader from "@/components/user-header"

export default function Header() {
  const pathname = usePathname()

  return (
    <nav className="border-border backdrop-blur-xs h-16 w-full rounded-2xl border bg-transparent px-6 shadow-sm">
      <div className="flex h-full items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <FishSymbolIcon strokeWidth={1.5} />
          <span className="text-sm font-medium text-gray-900">Aqua Watch</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Link href="/" className={cn("text-sm hover:text-gray-900", pathname === "/" && "font-medium text-gray-900")}>
            Home
          </Link>
          <Link
            href="/settings/profile"
            className={cn(
              "text-sm hover:text-gray-900",
              pathname.startsWith("/settings") && "font-medium text-gray-900",
            )}
          >
            Settings
          </Link>
        </div>

        {/* User Profile */}
        <UserHeader />
      </div>
    </nav>
  )
}
