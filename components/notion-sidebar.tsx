"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
  Settings,
  FileText,
  Users,
  Sparkles,
  Home,
  Clock,
  Star,
  Trash2,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AIAssistant } from "@/components/ai-assistant"
import { ThemeToggle } from "@/components/theme-toggle"

interface Pod {
  id: number
  name: string
  icon: string
  isExpanded?: boolean
  children?: { name: string; href: string; icon: any }[]
}

export function NotionSidebar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [expandedPods, setExpandedPods] = useState<number[]>([1])
  
  const isPremiumUser = true
  const userEmail = "yf80804@gmail.com"

  const pods: Pod[] = [
    {
      id: 1,
      name: "Trice",
      icon: "🚀",
      isExpanded: true,
      children: [
        { name: "Overview", href: "/dashboard/pods/1", icon: Home },
        { name: "Team Members", href: "/dashboard/pods/1/members", icon: Users },
        { name: "Recent Activity", href: "/dashboard/pods/1/activity", icon: Clock },
      ]
    },
    {
      id: 2,
      name: "Zyroz",
      icon: "📊",
      children: [
        { name: "Overview", href: "/dashboard/pods/2", icon: Home },
        { name: "Team Members", href: "/dashboard/pods/2/members", icon: Users },
        { name: "Recent Activity", href: "/dashboard/pods/2/activity", icon: Clock },
      ]
    },
    {
      id: 3,
      name: "Deeproot",
      icon: "🌳",
      children: [
        { name: "Overview", href: "/dashboard/pods/3", icon: Home },
        { name: "Team Members", href: "/dashboard/pods/3/members", icon: Users },
        { name: "Recent Activity", href: "/dashboard/pods/3/activity", icon: Clock },
      ]
    }
  ]

  const togglePod = (podId: number) => {
    setExpandedPods(prev =>
      prev.includes(podId)
        ? prev.filter(id => id !== podId)
        : [...prev, podId]
    )
  }

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md hover:bg-accent"
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 h-screen glass-strong border-r border-sidebar-border flex flex-col transition-transform duration-200 lg:translate-x-0 rounded-r-3xl overflow-hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black dark:bg-white rounded-md flex items-center justify-center text-white dark:text-black text-xs font-bold">
                  W
                </div>
                <span className="font-semibold text-sidebar-foreground">WACE</span>
              </div>
              <ThemeToggle />
            </div>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 glass-button border-0 focus-visible:ring-1 rounded-full"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-3">
              <Link href="/dashboard">
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl glass-button transition-all",
                    pathname === "/dashboard" && "glass-card"
                  )}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </button>
              </Link>

              {isPremiumUser && (
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl glass-button transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI Assistant</span>
                  <span className="ml-auto text-xs bg-black dark:bg-white text-white dark:text-black px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                </button>
              )}

              <Link href="/explore">
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl glass-button transition-all",
                    pathname === "/explore" && "glass-card"
                  )}
                >
                  <Search className="h-4 w-4" />
                  <span>Explore</span>
                </button>
              </Link>

              <Link href="/settings">
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl glass-button transition-all",
                    pathname === "/settings" && "glass-card"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </Link>

              <div className="h-px bg-border my-4" />

              <div className="flex items-center justify-between px-2 py-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pods</span>
                <Link href="/dashboard/pods/create">
                  <button className="hover:bg-sidebar-accent rounded p-0.5">
                    <Plus className="h-4 w-4" />
                  </button>
                </Link>
              </div>

              {pods.map((pod) => (
                <div key={pod.id} className="space-y-2">
                  <button
                    onClick={() => togglePod(pod.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl glass-button transition-all group"
                  >
                    {expandedPods.includes(pod.id) ? (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className="text-base">{pod.icon}</span>
                    <span className="flex-1 text-left">{pod.name}</span>
                  </button>

                  {expandedPods.includes(pod.id) && pod.children && (
                    <div className="ml-4 space-y-1 mt-2">
                      {pod.children.map((child) => (
                        <Link key={child.href} href={child.href}>
                          <button
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl glass-button transition-all",
                              pathname === child.href && "glass-card"
                            )}
                          >
                            <child.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{child.name}</span>
                          </button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="h-px bg-border my-4" />

              <Link href="/favorites">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl glass-button transition-all">
                  <Star className="h-4 w-4" />
                  <span>Favorites</span>
                </button>
              </Link>

              <Link href="/trash">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl glass-button transition-all">
                  <Trash2 className="h-4 w-4" />
                  <span>Trash</span>
                </button>
              </Link>
            </div>
          </ScrollArea>

          <div className="p-5 border-t border-sidebar-border mt-auto">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-sidebar-accent cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold">
                Y
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">YF808</div>
                <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        userEmail={userEmail}
      />
    </>
  )
}
