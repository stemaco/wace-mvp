"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Sparkles } from "lucide-react"

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export function AIAssistant({ isOpen, onClose, userEmail }: AIAssistantProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[#0a0f1c] z-50 flex">
      <div className="w-80 bg-[#0f1419] border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Chat History</h2>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-[#0a0f1c] border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-white font-semibold">AI Assistant</h1>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">AI Assistant</h2>
            <p className="text-gray-400">Welcome to your AI assistant!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
