"use client"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Compass, Home, ShoppingBag, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DashboardSidebar() {
  const pathname = usePathname()

  const userPods = [
    { id: 1, name: "Trice", avatar: "/tech-startup-logo.png", isActive: true },
    { id: 2, name: "Zyroz", avatar: "/marketing-team-logo.png", isActive: false },
    { id: 3, name: "Deeproot", avatar: "/product-development-logo.jpg", isActive: false },
  ]

  return (
    <TooltipProvider>
      <div className="w-[72px] bg-[#000917] border-r border-gray-700 backdrop-blur-sm flex flex-col items-center py-3">
        {/* WACE Logo */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200 flex items-center justify-center group cursor-pointer hover:bg-gray-700/50 shadow-sm">
            <Image src="/logo.png" alt="WACE" width={40} height={40} className="rounded-sm" />
          </div>
        </div>

        {/* Separator */}
        <div className="w-8 h-[2px] bg-gray-700 rounded-full mb-4" />

        {/* Navigation Icons */}
        <div className="space-y-3 mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200 hover:bg-gray-700/50 flex items-center justify-center cursor-pointer shadow-sm">
                <Link href="/dashboard">
                  <Home className="h-5 w-5 text-gray-300 hover:text-white" />
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Dashboard</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200 hover:bg-gray-700/50 flex items-center justify-center cursor-pointer shadow-sm">
                <Link href="/dashboard/pods/create">
                  <Plus className="h-5 w-5 text-gray-300 hover:text-white" />
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Create Pod</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200 hover:bg-gray-700/50 flex items-center justify-center cursor-pointer shadow-sm">
                <Link href="/explore">
                  <Compass className="h-5 w-5 text-gray-300 hover:text-white" />
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Explore Pods</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Separator */}
        <div className="w-8 h-[2px] bg-gray-700 rounded-full mb-4" />

        {/* Pod Avatars */}
        <ScrollArea className="flex-1 w-full">
          <div className="flex flex-col items-center space-y-3 px-3">
            {userPods.map((pod) => (
              <Tooltip key={pod.id}>
                <TooltipTrigger asChild>
                  <div className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200 hover:bg-gray-700/50 flex items-center justify-center cursor-pointer shadow-sm relative overflow-hidden">
                    <Link href={`/dashboard/pods/${pod.id}`}>
                      <div className="w-12 h-12 rounded-2xl overflow-hidden">
                        <Avatar className="w-12 h-12 rounded-2xl">
                          <AvatarImage src={pod.avatar || "/placeholder.svg"} className="w-full h-full object-cover rounded-2xl" />
                          <AvatarFallback className="bg-blue-600 text-white w-full h-full flex items-center justify-center rounded-2xl">
                            {pod.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {/* Active indicator */}
                      {pod.isActive && (
                        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                      )}
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{pod.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </ScrollArea>

        {/* Bottom Navigation */}
        <div className="space-y-3 mt-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200 hover:bg-gray-700/50 flex items-center justify-center cursor-pointer shadow-sm">
                <Link href="/shop">
                  <ShoppingBag className="h-5 w-5 text-gray-300 hover:text-white" />
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Shop</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200 hover:bg-gray-700/50 flex items-center justify-center cursor-pointer shadow-sm">
                <Link href="/settings">
                  <Settings className="h-5 w-5 text-gray-300 hover:text-white" />
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* User Avatar */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-12 h-12 rounded-full hover:rounded-full transition-all duration-200 hover:bg-gray-700/50 flex items-center justify-center cursor-pointer shadow-sm overflow-hidden">
                <Link href="/settings">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Avatar className="w-12 h-12 rounded-full">
                      <AvatarImage src="/diverse-user-avatars.png" className="w-full h-full object-cover rounded-full" />
                      <AvatarFallback className="bg-blue-600 text-white w-full h-full flex items-center justify-center rounded-full">JD</AvatarFallback>
                    </Avatar>
                  </div>
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Profile Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
