"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("gray")
    } else if (theme === "gray") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const getIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />
    if (theme === "gray") return <Monitor className="h-4 w-4" />
    return <Moon className="h-4 w-4" />
  }

  return (
    <Button variant="ghost" size="icon" onClick={cycleTheme} className="w-9 h-9 rounded-xl">
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
