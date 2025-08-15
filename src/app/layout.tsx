import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import Provider from "@/providers/provider"
import Squares from "@/components/ui/squares"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Aqua Watch - Real-time Water Quality Monitoring",
  description: "Aqua Watch is a web application that provides real-time water quality monitoring and alerts.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="relative flex h-dvh w-full items-center justify-center overflow-hidden">
          <div className="fixed inset-0 -z-10">
            <Squares speed={0.1} squareSize={40} direction="diagonal" borderColor="#f3f4f6" hoverFillColor="#000" />
          </div>

          <div className="relative flex h-full w-full flex-col items-center justify-center">
            <div className="container mx-auto h-full w-full">
              <Provider>{children}</Provider>
            </div>
          </div>
        </main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
