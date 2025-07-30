"use client"

import React, { use } from "react"
import FloatingMenu from "./floating-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

type Props = {
  params: Promise<{ aquarium_id: string }>
  children: React.ReactNode
}

export default function AquariumDetailLayout({ children, params }: Props) {
  const { aquarium_id } = use(params)

  return (
    <div className="bg-background h-dvh w-screen overflow-hidden p-4 lg:p-6">
      <div className="container mx-auto flex h-full max-w-7xl flex-1 flex-col gap-3">
        {/* Main */}
        <div className="bg-muted h-full w-full flex-1 overflow-hidden rounded-3xl border">
          <ScrollArea className="h-full w-full rounded-xl p-3">{children}</ScrollArea>
        </div>

        {/* Menu */}
        <FloatingMenu aquarium_id={aquarium_id} />
      </div>
    </div>
  )
}
