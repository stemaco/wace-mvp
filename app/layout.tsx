"use client"

import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Sidebar } from "@/components/sidebar"
import { Suspense } from "react"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import * as React from "react"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show sidebar on landing page or auth pages
  const showSidebar = mounted && user && pathname !== "/" && pathname !== "/signin" && pathname !== "/signup"

  // Always render the same structure to avoid hydration mismatch
  return (
    <>
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? "pl-16 min-h-screen" : "min-h-screen"}>
        {!mounted || isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.6_0.2_290)] flex items-center justify-center text-white font-bold text-2xl mx-auto animate-pulse">
                W
              </div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <LayoutContent>{children}</LayoutContent>
          </Suspense>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
