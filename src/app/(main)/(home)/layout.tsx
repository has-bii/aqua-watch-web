"use client"

import React from "react"
import Header from "./header"

type Props = {
  children: React.ReactNode
}

export default function HomeLayout({ children }: Props) {
  return (
    <div className="flex min-h-dvh w-full flex-col gap-6 py-6">
      <Header />

      {children}
    </div>
  )
}
