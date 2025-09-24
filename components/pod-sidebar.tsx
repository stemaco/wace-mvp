"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Target,
  TrendingUp,
  FileText,
  Calendar,
  Video,
  Folder,
  MessageCircle,
  Settings,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type PodSection =
  | "chat"
  | "goals"
  | "strategy"
  | "documents"
  | "calendar"
  | "resources"
  | "feedback"

interface PodSidebarProps {
  podData: {
    id: number
    name: string
    description: string
    members: Array<{
      id: number
      name: string
      avatar: string
      status: "online" | "away" | "offline"
      role: string
    }>
    privacy: "public" | "private" | "unlisted"
  }
  activeSection: PodSection
  onSectionChange: (section: PodSection) => void
}

export function PodSidebar({ podData, activeSection, onSectionChange }: PodSidebarProps) {
  const sections = [
    { id: "chat" as const, icon: MessageSquare, label: "Chat", badge: "3" },
    { id: "goals" as const, icon: Target, label: "Goals" },
    { id: "strategy" as const, icon: TrendingUp, label: "Strategy" },
    { id: "documents" as const, icon: FileText, label: "Documents", badge: "12" },
    { id: "calendar" as const, icon: Calendar, label: "Calendar" },
    { id: "resources" as const, icon: Folder, label: "Resources" },
    { id: "feedback" as const, icon: MessageCircle, label: "Feedback" },
  ]

  return (
    <div className="w-64 bg-[#000917] border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div>
          <h2 className="font-semibold text-white truncate">{podData.name}</h2>
          <div className="flex items-center space-x-2 mt-1">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                podData.privacy === "public" && "bg-green-500/20 text-green-400 border-green-500/30",
                podData.privacy === "private" && "bg-red-500/20 text-red-400 border-red-500/30",
                podData.privacy === "unlisted" && "bg-blue-800/30 text-blue-300 border-blue-800/50",
              )}
            >
              {podData.privacy}
            </Badge>
            <span className="text-xs text-gray-400">{podData.members.length} members</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full justify-start text-gray-300 hover:bg-blue-800/30 hover:text-blue-300 transition-colors",
                activeSection === section.id && "bg-blue-800/30 text-blue-300 border border-blue-800/50",
              )}
            >
              <section.icon className="h-4 w-4 mr-3" />
              <span className="flex-1 text-left">{section.label}</span>
              {section.badge && (
                <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs bg-blue-800/30 text-blue-300 border-blue-800/50">
                  {section.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
