"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Clock, Calendar, Mail, MessageSquare } from "lucide-react"
import { MessageRenderer } from "@/components/message-renderer"
import { cn } from "@/lib/utils"

interface AIReplicaResponseProps {
  response: {
    success: boolean
    response?: string
    error?: string
    mentionedUser?: string
    userSchedule?: any[]
  }
  className?: string
}

export function AIReplicaResponse({ response, className }: AIReplicaResponseProps) {
  if (!response.success) {
    return (
      <div className={cn("flex items-start space-x-3", className)}>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-red-600">
            <Bot className="h-4 w-4 text-white" />
          </AvatarFallback>
        </Avatar>
        <div className="bg-red-900/20 border border-red-700 rounded-lg px-3 py-2 max-w-[70%]">
          <p className="text-sm text-red-300">
            {response.error || "Failed to get AI replica response"}
          </p>
        </div>
      </div>
    )
  }

  const mentionedUser = response.mentionedUser || "Unknown"
  const userInitials = mentionedUser.split('@')[0].substring(0, 2).toUpperCase()

  return (
    <div className={cn("space-y-3", className)}>
      {/* AI Replica Response */}
      <div className="flex items-start space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500">
            <Bot className="h-5 w-5 text-white" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-purple-400">
              {mentionedUser.split('@')[0]}-AI
            </span>
            <span className="text-xs text-gray-400">• AI Replica</span>
          </div>
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-2xl px-4 py-3">
            <MessageRenderer content={response.response || "No response available"} />
          </div>
        </div>
      </div>

      {/* User Schedule Context */}
      {response.userSchedule && response.userSchedule.length > 0 && (
        <div className="ml-13">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">
                  {mentionedUser.split('@')[0]}'s Schedule Today
                </span>
              </div>
              <div className="space-y-2">
                {response.userSchedule.slice(0, 3).map((event, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-300">
                      {event.start.toLocaleTimeString()} - {event.title}
                    </span>
                  </div>
                ))}
                {response.userSchedule.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{response.userSchedule.length - 3} more meetings
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
