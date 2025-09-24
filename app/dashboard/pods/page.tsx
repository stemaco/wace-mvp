"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Plus, Search, Users, MessageSquare, MoreHorizontal, Filter } from "lucide-react"
import Link from "next/link"

export default function PodsPage() {
  const pods = [
    {
      id: 1,
      name: "TechStartup Pod",
      description: "Building the next big SaaS platform with AI integration",
      members: 4,
      messages: 127,
      lastActivity: "2 hours ago",
      status: "active",
      privacy: "private",
    },
    {
      id: 2,
      name: "Marketing Team",
      description: "Growth and user acquisition strategies for Q1 2025",
      members: 3,
      messages: 89,
      lastActivity: "1 day ago",
      status: "active",
      privacy: "public",
    },
    {
      id: 3,
      name: "Product Development",
      description: "Feature planning and development roadmap",
      members: 6,
      messages: 203,
      lastActivity: "3 hours ago",
      status: "active",
      privacy: "unlisted",
    },
    {
      id: 4,
      name: "Design System",
      description: "Creating a unified design language and component library",
      members: 2,
      messages: 45,
      lastActivity: "1 week ago",
      status: "inactive",
      privacy: "private",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Your Pods</h1>
              <p className="text-muted-foreground">Manage and organize your project workspaces</p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard/pods/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Pod
              </Link>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search pods..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Pods Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pods.map((pod) => (
              <Card key={pod.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{pod.name}</CardTitle>
                      <CardDescription className="mt-1">{pod.description}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Badge
                      variant={pod.status === "active" ? "default" : "secondary"}
                      className={pod.status === "active" ? "bg-green-500/20 text-green-400" : ""}
                    >
                      {pod.status}
                    </Badge>
                    <Badge variant="outline">{pod.privacy}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{pod.members} members</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{pod.messages} messages</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Last activity: {pod.lastActivity}</span>
                      <Button asChild size="sm">
                        <Link href={`/dashboard/pods/${pod.id}`}>Open</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
