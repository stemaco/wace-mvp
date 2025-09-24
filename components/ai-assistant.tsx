"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Sparkles, X, Bot, User, MessageSquare, Plus, Mic, MicOff, Paperclip, X as XIcon, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { MessageRenderer } from "@/components/message-renderer"
import { FilePreview } from "@/components/file-preview"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AIReplicaResponse } from "@/components/ai-replica-response"
import { MentionParser } from "@/components/mention-parser"
import { parseAIMentions } from "@/lib/ai-replica-service"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  aiReplicaResponses?: any[]
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export function AIAssistant({ isOpen, onClose, userEmail }: AIAssistantProps) {
  const [currentSession, setCurrentSession] = useState<ChatSession>({
    id: "session_1",
    title: "New Chat",
    messages: [
      {
        id: "1",
        content: `Hello! I'm your personal AI assistant with full workspace integration. I have access to:

📅 **Google Calendar** - Your meetings and schedule
📧 **Gmail** - Your emails and communications  
👥 **Microsoft Teams** - Your team collaborations
🏢 **WACE Pods** - Your project teams and activities
• Use **@username-ai** to interact with team member AI replicas
• AI replicas respond based on their schedules and context

I can help you with:
• **Schedule Management** - Check your calendar, plan meetings, coordinate with team
• **Email Assistance** - Summarize emails, draft responses, prioritize messages
• **Team Collaboration** - Access Teams messages, coordinate with team members
• **Pod Management** - Ask about your pods, team members, recent activities
• **Cross-Platform Insights** - Get unified view of your workspace across all platforms
• **Meeting Coordination** - Schedule meetings, check availability, prepare for upcoming events
• **Web Search** - Get real-time information from the web for current events and topics
• **AI Replica Interactions** - Chat with team members' AI replicas using @username-ai mentions
• **Productivity Assistance** - General questions about your work and schedule

How can I assist you today?`,
        role: "assistant",
        timestamp: new Date()
      }
    ],
    timestamp: new Date()
  })

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "session_1",
      title: "New Chat",
      messages: [
        {
          id: "1",
          content: `Hello! I'm your personal AI assistant with full workspace integration. I have access to:

📅 **Google Calendar** - Your meetings and schedule
📧 **Gmail** - Your emails and communications  
👥 **Microsoft Teams** - Your team collaborations
🏢 **WACE Pods** - Your project teams and activities
• Use **@username-ai** to interact with team member AI replicas
• AI replicas respond based on their schedules and context

I can help you with:
• **Schedule Management** - Check your calendar, plan meetings, coordinate with team
• **Email Assistance** - Summarize emails, draft responses, prioritize messages
• **Team Collaboration** - Access Teams messages, coordinate with team members
• **Pod Management** - Ask about your pods, team members, recent activities
• **Cross-Platform Insights** - Get unified view of your workspace across all platforms
• **Meeting Coordination** - Schedule meetings, check availability, prepare for upcoming events
• **Web Search** - Get real-time information from the web for current events and topics
• **AI Replica Interactions** - Chat with team members' AI replicas using @username-ai mentions
• **Productivity Assistance** - General questions about your work and schedule

How can I assist you today?`,
          role: "assistant",
          timestamp: new Date()
        }
      ],
      timestamp: new Date()
    }
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isWebSearching, setIsWebSearching] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [recognitionRef, setRecognitionRef] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(prev => prev + (prev ? ' ' : '') + transcript)
        setIsListening(false)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      setRecognitionRef(recognition)
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentSession.messages])

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: "New Chat",
      messages: [
        {
          id: "1",
          content: `Hello! I'm your personal AI assistant with full workspace integration. I have access to:

📅 **Google Calendar** - Your meetings and schedule
📧 **Gmail** - Your emails and communications  
👥 **Microsoft Teams** - Your team collaborations
🏢 **WACE Pods** - Your project teams and activities
• Use **@username-ai** to interact with team member AI replicas
• AI replicas respond based on their schedules and context

I can help you with:
• **Schedule Management** - Check your calendar, plan meetings, coordinate with team
• **Email Assistance** - Summarize emails, draft responses, prioritize messages
• **Team Collaboration** - Access Teams messages, coordinate with team members
• **Pod Management** - Ask about your pods, team members, recent activities
• **Cross-Platform Insights** - Get unified view of your workspace across all platforms
• **Meeting Coordination** - Schedule meetings, check availability, prepare for upcoming events
• **Web Search** - Get real-time information from the web for current events and topics
• **AI Replica Interactions** - Chat with team members' AI replicas using @username-ai mentions
• **Productivity Assistance** - General questions about your work and schedule

How can I assist you today?`,
          role: "assistant",
          timestamp: new Date()
        }
      ],
      timestamp: new Date()
    }
    
    setCurrentSession(newSession)
    setChatSessions(prev => [newSession, ...prev])
  }

  const switchToSession = (session: ChatSession) => {
    setCurrentSession(session)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  // Get available AI replicas for the current pod
  const getAvailableAIReplicas = () => {
    // For demo purposes, return the AI replicas from the Trice pod
    return [
      { username: "john", name: "John's AI", personality: "Strategic, visionary, focuses on big picture" },
      { username: "sarah", name: "Sarah's AI", personality: "Technical, detail-oriented, problem solver" },
      { username: "mike", name: "Mike's AI", personality: "Creative, user-focused, design thinking" }
    ]
  }

  // Web search function
  const performWebSearch = async (query: string) => {
    setIsWebSearching(true)
    try {
      const response = await fetch("/api/web-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.results
      }
    } catch (error) {
      console.error("Web search error:", error)
    } finally {
      setIsWebSearching(false)
    }
    return []
  }

  const startListening = () => {
    if (recognitionRef && !isListening) {
      setIsListening(true)
      recognitionRef.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef && isListening) {
      recognitionRef.stop()
      setIsListening(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const messageContent = input.trim()
    const fileInfo = attachedFiles.length > 0 
      ? `\n\n**Attached Files:**\n${attachedFiles.map(f => `• ${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join('\n')}`
      : ''

    // Check for AI mentions
    const mentions = parseAIMentions(messageContent)
    let aiReplicaResponses: any[] = []

    // Process AI mentions if any
    if (mentions.length > 0) {
      try {
        const replicaResponse = await fetch("/api/ai/replica", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageContent,
            podId: "pod_trice_001", // For demo, using Trice pod
            userEmail
          })
        })

        if (replicaResponse.ok) {
          const replicaData = await replicaResponse.json()
          aiReplicaResponses = replicaData.aiResponses || []
        }
      } catch (error) {
        console.error("AI replica processing error:", error)
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent + fileInfo,
      role: "user",
      timestamp: new Date(),
      aiReplicaResponses
    }

    // Update current session with user message
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
    }
    setCurrentSession(updatedSession)
    setChatSessions(prev => prev.map(session => 
      session.id === currentSession.id ? updatedSession : session
    ))

    // Clear input and files
    setInput("")
    setAttachedFiles([])

    // Check if message contains web search keywords
    const webSearchKeywords = ['search', 'find', 'latest', 'news', 'current', 'recent', 'trends']
    const shouldSearchWeb = webSearchKeywords.some(keyword => 
      messageContent.toLowerCase().includes(keyword)
    )

    let webSearchResults: any[] = []
    if (shouldSearchWeb) {
      webSearchResults = await performWebSearch(messageContent)
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent + fileInfo,
          userEmail,
          webSearchResults
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: "assistant",
          timestamp: new Date()
        }

        const finalSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, assistantMessage],
        }
        setCurrentSession(finalSession)
        setChatSessions(prev => prev.map(session => 
          session.id === currentSession.id ? finalSession : session
        ))
      } else {
        throw new Error("Failed to get AI response")
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date()
      }

      const errorSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, errorMessage],
      }
      
      setCurrentSession(errorSession)
      setChatSessions(prev => prev.map(session => 
        session.id === currentSession.id ? errorSession : session
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[#0a0f1c] z-50 flex">
      {/* Sidebar - Chat History */}
      <div className="w-80 bg-[#0f1419] border-r border-gray-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Chat History</h2>
            <Button
              onClick={createNewChat}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Sessions List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => switchToSession(session)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors",
                  currentSession.id === session.id
                    ? "bg-blue-600/20 border border-blue-500/30"
                    : "hover:bg-gray-700/50"
                )}
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{session.title}</p>
                    <p className="text-xs text-gray-400">
                      {session.messages.length} messages
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
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

        {/* Messages Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6">
                {currentSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start space-x-4",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600">
                          <Bot className="h-5 w-5 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-3",
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-100 border border-gray-700"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <MessageRenderer content={message.content} />
                      ) : (
                        <div className="text-sm leading-relaxed">
                          <MentionParser text={message.content} />
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-600">
                          <User className="h-5 w-5 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {/* AI Replica Responses */}
                  {message.role === "user" && message.aiReplicaResponses && message.aiReplicaResponses.length > 0 && (
                    <div className="ml-13 space-y-3">
                      {message.aiReplicaResponses.map((response, index) => (
                        <AIReplicaResponse
                          key={index}
                          response={response}
                        />
                      ))}
                    </div>
                  )}
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600">
                        <Bot className="h-5 w-5 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-700">
          <div className="max-w-4xl mx-auto">
            {/* Attached Files Display */}
            {attachedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <FilePreview
                    key={index}
                    file={file}
                    onRemove={() => removeFile(index)}
                  />
                ))}
              </div>
            )}

            <div className="flex space-x-3">
              {/* File Upload Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={openFileDialog}
                      variant="ghost"
                      size="sm"
                      className="h-12 w-12 text-gray-400 hover:text-white hover:bg-gray-700"
                      disabled={isLoading}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add files</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Input Field */}
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isListening 
                    ? "Listening..." 
                    : isWebSearching 
                    ? "Searching the web..." 
                    : "Ask me anything about your workspace..."
                }
                disabled={isLoading}
                className={cn(
                  "flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 h-12 text-base",
                  isListening && "border-red-500 bg-red-900/10",
                  isWebSearching && "border-blue-500 bg-blue-900/10"
                )}
              />

              {/* Voice Input Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={isListening ? stopListening : startListening}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-12 w-12",
                        isListening 
                          ? "text-red-400 hover:text-red-300 hover:bg-red-900/20" 
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                      disabled={isLoading}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isListening ? "Stop listening" : "Start voice input"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Web Search Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => performWebSearch(input)}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-12 w-12",
                        isWebSearching 
                          ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/20" 
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                      disabled={isLoading || !input.trim()}
                    >
                      {isWebSearching ? (
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Globe className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search the web</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 h-12 px-6"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.md,.json,.csv,.xlsx,.pptx,.jpg,.jpeg,.png,.gif"
            />

            {/* Available AI Replicas Helper */}
            <div className="mt-2 text-xs text-gray-400">
              <span className="text-purple-400">💡 Tip:</span> Mention AI replicas with{" "}
              {getAvailableAIReplicas().map((replica, index) => (
                <span key={replica.username}>
                  <code className="bg-gray-700 px-1 py-0.5 rounded text-purple-300">
                    @{replica.username}-ai
                  </code>
                  {index < getAvailableAIReplicas().length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
