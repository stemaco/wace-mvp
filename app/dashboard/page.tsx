"use client"

import Link from "next/link"
import { Bell, Compass, ShoppingBag, Bot, SettingsIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProtectedRoute } from "@/components/protected-route"

const quickAccessCards = [
  { icon: Compass, label: "Explore", href: "/explore", color: "from-blue-500 to-blue-600" },
  { icon: ShoppingBag, label: "Shop", href: "/shop", color: "from-purple-500 to-purple-600" },
  { icon: Bot, label: "AI Assistant", href: "/ai", color: "from-cyan-500 to-cyan-600" },
  { icon: SettingsIcon, label: "Settings", href: "/settings", color: "from-pink-500 to-pink-600" },
]

const myPods = [
  {
    id: "1",
    name: "TechStartup",
    tagline: "Building the future of AI",
    members: 5,
    avatar: "/tech-startup-logo.png",
  },
  {
    id: "2",
    name: "DesignCo",
    tagline: "Creative design solutions",
    members: 3,
    avatar: "/generic-company-logo.png",
  },
  {
    id: "3",
    name: "AIVenture",
    tagline: "Machine learning platform",
    members: 7,
    avatar: "/ai-venture-logo.jpg",
  },
]

const notifications = [
  { id: 1, text: "Team standup meeting starts in 30 minutes", time: "10 min ago", type: "meeting" },
  { id: 2, text: "Sarah commented on your marketing strategy document", time: "1 hour ago", type: "comment" },
  { id: 3, text: "New investor inquiry received for TechStartup pod", time: "2 hours ago", type: "inquiry" },
  { id: 4, text: "Your subscription will renew in 5 days", time: "3 hours ago", type: "billing" },
  { id: 5, text: "Goal 'Launch MVP' marked as complete by John", time: "5 hours ago", type: "goal" },
  { id: 6, text: "Weekly progress report is ready to review", time: "1 day ago", type: "report" },
  { id: 7, text: "New message in DesignCo pod chat", time: "1 day ago", type: "message" },
  { id: 8, text: "Reminder: Investor pitch preparation due Friday", time: "2 days ago", type: "reminder" },
]

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-balance">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-8">
        <Card className="mb-8 border border-border rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 rounded-2xl border-2 border-border">
                <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.6_0.2_290)] text-white text-xl">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-balance">Hey John</h2>
              </div>
              <Button className="rounded-xl bg-primary hover:bg-primary/90">Create New Pod</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Access */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickAccessCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <Link key={card.label} href={card.href}>
                      <Card className="rounded-2xl border-border hover:border-primary/50 transition-all cursor-pointer group">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{card.label}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">My Pods</h3>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  View All
                </Button>
              </div>
              <div className="grid gap-4">
                {myPods.map((pod) => (
                  <Link key={pod.id} href={`/pod/${pod.id}`}>
                    <Card className="rounded-2xl border-border hover:border-primary/50 transition-all cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16 rounded-2xl group-hover:scale-105 transition-all">
                            <AvatarImage src={pod.avatar || "/placeholder.svg"} alt={pod.name} />
                            <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary/20 to-[oklch(0.6_0.2_290)]/20 text-primary text-lg">
                              {pod.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-lg">{pod.name}</h4>
                                <p className="text-sm text-muted-foreground">{pod.tagline}</p>
                              </div>
                              <Badge variant="secondary" className="rounded-lg">
                                <Users className="w-3 h-3 mr-1" />
                                {pod.members}
                              </Badge>
                            </div>
                          </div>
                          <Button className="rounded-xl bg-transparent" variant="outline">
                            Open
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-pretty">{notification.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
