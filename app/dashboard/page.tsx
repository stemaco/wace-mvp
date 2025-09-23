"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Plus,
  Compass,
  Bell,
  Users,
  MessageSquare,
  TrendingUp,
  ShoppingBag,
  MoreHorizontal,
  Bot,
  Zap,
  Target,
  X,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardPage() {
  const [activePods] = useState([
    {
      id: 1,
      name: "Ecowork",
      description: "Sustainable workspace solutions for remote teams",
      members: 4,
      lastActivity: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "Trice",
      description: "AI-powered project management and collaboration",
      members: 3,
      lastActivity: "1 day ago",
      status: "active",
    },
    {
      id: 3,
      name: "DeepRoot",
      description: "Deep learning research and development",
      members: 6,
      lastActivity: "3 hours ago",
      status: "active",
    },
  ])

  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications] = useState([
    {
      id: 1,
      type: "tip",
      title: "JINX AI Tip",
      message: "Try asking JINX to analyze your team's productivity patterns and suggest optimizations",
      time: "1 hour ago",
    },
    {
      id: 2,
      type: "invite",
      title: "Pod Invite",
      message: "Sarah invited you to join 'E-commerce Startup' Pod",
      time: "3 hours ago",
    },
    {
      id: 3,
      type: "update",
      title: "AI Shop Update",
      message: "New AI agents available in the Shop - Marketing Pro, Finance Expert, and Product Strategist",
      time: "1 day ago",
    },
  ])


  return (
    <div className="min-h-screen bg-[#000917] flex">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="border-b border-gray-700 p-4 bg-[#000917] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-300">Welcome back! Here's what's happening with your Pods.</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                  {notifications.length}
                </Badge>
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="absolute top-20 right-6 w-80 bg-gray-800/95 border border-gray-700 rounded-lg shadow-xl backdrop-blur-sm z-50">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        <span className="text-xs text-gray-400">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700">
              <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300 hover:bg-gray-700/50">
                View All Notifications
              </Button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-20 justify-start p-6 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200">
              <Link href="/dashboard/pods/create">
                <Plus className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Create New Pod</div>
                  <div className="text-sm opacity-90">Start a new project workspace</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-20 justify-start p-6 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200">
              <Link href="/explore">
                <Compass className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Explore Pods</div>
                  <div className="text-sm text-gray-300">Discover and join communities</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-20 justify-start p-6 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200">
              <Link href="/shop">
                <ShoppingBag className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">AI Shop</div>
                  <div className="text-sm text-gray-300">Browse AI agents and tools</div>
                </div>
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Active Pods */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Active Pods</CardTitle>
                      <CardDescription className="text-gray-300">Your current project workspaces</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="text-blue-400 hover:text-blue-300 hover:bg-gray-700/50">
                      <Link href="/dashboard/pods">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activePods.map((pod) => (
                    <div
                      key={pod.id}
                      className="flex items-center justify-between p-4 border border-gray-700/50 rounded-lg hover:bg-gray-700/30 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                          <Users className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{pod.name}</h3>
                          <p className="text-sm text-gray-300">{pod.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-400 flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {pod.members} members
                            </span>
                            <span className="text-xs text-gray-400">{pod.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                          {pod.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700/50">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div>
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Messages Today</span>
                    </div>
                    <span className="font-semibold text-white">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">Tasks Completed</span>
                    </div>
                    <span className="font-semibold text-white">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Active Pods</span>
                    </div>
                    <span className="font-semibold text-white">{activePods.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
