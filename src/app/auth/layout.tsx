import React from "react"

type Props = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-background flex min-h-dvh w-screen flex-col items-center justify-center p-8">{children}</div>
  )
}
