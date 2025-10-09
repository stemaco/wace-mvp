"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/contexts/auth-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} themes={["light", "gray", "dark"]}>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}
