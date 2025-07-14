"use client"

import React, { use } from "react"
import FloatingMenu from "./floating-menu"

type Props = {
  params: Promise<{ aquarium_id: string }>
  children: React.ReactNode
}

export default function AquariumDetailLayout({ children, params }: Props) {
  const { aquarium_id } = use(params)

  return (
    <div className="flex min-h-dvh w-screen flex-1 flex-col bg-neutral-100">
      {children}
      <FloatingMenu aquarium_id={aquarium_id} />
    </div>
  )
}
