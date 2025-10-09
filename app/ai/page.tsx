"use client"

import { useState } from "react"
import { Bot, Send, Mic, MoreVertical, Calendar, Mail, HardDrive, Volume2, Plus, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ProtectedRoute } from "@/components/protected-route"

// Mock chat history
const chatHistory = [
  { id: "1", title: "Marketing Strategy", date: "Today", preview: "Help me create a marketing plan..." },
  { id: "2", title: "Product Roadmap", date: "Yesterday", preview: "What features should I prioritize..." },
  { id: "3", title: "Investor Pitch", date: "2 days ago", preview: "Review my pitch deck..." },
  { id: "4", title: "Team Hiring", date: "1 week ago", preview: "How do I find the right co-founder..." },
]

const notifications = [
  {
    id: "1",
    type: "request",
    title: "Meeting Request from DesignCo",
    message:
      "DesignCo requested a meeting @6pm tomorrow. You don't have anything planned on your calendar. Please confirm your participation.",
    time: "10 mins ago",
  },
  {
    id: "2",
    type: "confirmation",
    title: "Document Sent Successfully",
    message: "I have sent the founders agreement doc to sam@gmail.com",
    time: "2 hours ago",
  },
  {
    id: "3",
    type: "reminder",
    title: "Upcoming Meeting",
    message: "Your meeting with AI Venture is scheduled for 8pm today",
    time: "3 hours ago",
  },
  {
    id: "4",
    type: "confirmation",
    title: "Task Completed",
    message: "I've scheduled the investor pitch for next Tuesday at 2pm",
    time: "5 hours ago",
  },
]

const mockMessages = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your personal AI assistant. I can help you schedule meetings, send emails, manage your calendar, and much more. How can I assist you today?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    role: "user",
    content: "Please schedule a meeting in AI Venture at 8pm and send the agenda to all team members",
    timestamp: "10:31 AM",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "I've scheduled a meeting in the AI Venture pod for 8pm today. I'll now send the meeting agenda to all 7 team members. Would you like me to include any specific topics in the agenda?",
    timestamp: "10:31 AM",
  },
]

export default function AIAssistantPage() {
  const [activeChat, setActiveChat] = useState("1")
  const [message, setMessage] = useState("")
  const [assistantName, setAssistantName] = useState("Jinx")
  const [tone, setTone] = useState("mentor")
  const [showChatHistory, setShowChatHistory] = useState(false)

  return (
    <ProtectedRoute>
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.6_0.2_290)] flex items-center justify-center relative">
            <Bot className="w-6 h-6 text-white" />
            <Badge className="absolute -top-1 -right-1 h-5 px-1.5 text-[10px] font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              PRO
            </Badge>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Personal Assistant</h1>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <div className="border-b border-border px-8">
          <TabsList className="bg-transparent h-12">
            <TabsTrigger value="chat" className="gap-2">
              <span>💬</span> Chat
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <span>🔔</span> Notifications
            </TabsTrigger>
            <TabsTrigger value="personalization" className="gap-2">
              <span>🎨</span> Personalization
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex m-0">
          {showChatHistory && (
            <aside className="w-64 border-r border-border bg-card/30 flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <Button className="flex-1 justify-start gap-2 bg-transparent" variant="outline">
                  <Plus className="w-4 h-4" />
                  New Chat
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChatHistory(false)}
                  className="ml-2 rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {chatHistory.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChat(chat.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl transition-colors group",
                        activeChat === chat.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{chat.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{chat.preview}</p>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{chat.date}</p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </aside>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {!showChatHistory && (
              <div className="p-4 border-b border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChatHistory(true)}
                  className="rounded-xl bg-transparent"
                >
                  <MoreVertical className="w-4 h-4 mr-2" />
                  Chat History
                </Button>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                {mockMessages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                    {msg.role === "assistant" && (
                      <Avatar className="w-8 h-8 rounded-xl">
                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-[oklch(0.6_0.2_290)]/20 text-primary">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-3",
                        msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border",
                      )}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-2",
                          msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                    {msg.role === "user" && (
                      <Avatar className="w-8 h-8 rounded-xl">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-[oklch(0.6_0.2_290)]/20 text-primary">
                          JD
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border p-6 bg-card/50 backdrop-blur-sm">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="pr-12 h-12 rounded-2xl bg-background"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          // Handle send
                        }
                      }}
                    />
                    <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-10 w-10 rounded-xl">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button size="icon" className="h-12 w-12 rounded-2xl">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="flex-1 m-0 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="rounded-2xl border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          notification.type === "reminder" && "bg-blue-500/10 text-blue-500",
                          notification.type === "confirmation" && "bg-green-500/10 text-green-500",
                          notification.type === "request" && "bg-purple-500/10 text-purple-500",
                        )}
                      >
                        {notification.type === "reminder" && <Calendar className="w-5 h-5" />}
                        {notification.type === "confirmation" && <span className="text-lg">✓</span>}
                        {notification.type === "request" && <span className="text-lg">?</span>}
                      </div>
                      <div>
                        <CardTitle className="text-base">{notification.title}</CardTitle>
                        <CardDescription className="mt-1">{notification.message}</CardDescription>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </CardHeader>
                {notification.type === "request" && (
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button size="sm" className="rounded-xl">
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Personalization Tab */}
        <TabsContent value="personalization" className="flex-1 m-0 p-8 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Assistant Name */}
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>Assistant Name</CardTitle>
                <CardDescription>Customize what you call your AI assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="Enter assistant name"
                  className="rounded-xl"
                />
              </CardContent>
            </Card>

            {/* Tone Selection */}
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>Assistant Tone</CardTitle>
                <CardDescription>Choose how your assistant communicates with you</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={tone} onValueChange={setTone} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="formal" id="formal" />
                    <Label htmlFor="formal" className="flex-1 cursor-pointer">
                      <div className="font-medium">Formal</div>
                      <div className="text-sm text-muted-foreground">Professional and business-like</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="fun" id="fun" />
                    <Label htmlFor="fun" className="flex-1 cursor-pointer">
                      <div className="font-medium">Fun</div>
                      <div className="text-sm text-muted-foreground">Casual and friendly</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="mentor" id="mentor" />
                    <Label htmlFor="mentor" className="flex-1 cursor-pointer">
                      <div className="font-medium">Mentor</div>
                      <div className="text-sm text-muted-foreground">Supportive and guiding</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Integrations */}
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>Connected Integrations</CardTitle>
                <CardDescription>Connect external services to enhance your assistant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <HardDrive className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium">Google Drive</div>
                      <div className="text-sm text-muted-foreground">Access your files</div>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">Manage your inbox</div>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium">Calendar</div>
                      <div className="text-sm text-muted-foreground">Schedule and reminders</div>
                    </div>
                  </div>
                  <Switch />
                </div>

                <Button variant="outline" className="w-full rounded-xl bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Integration
                </Button>
              </CardContent>
            </Card>

            {/* Voice Settings */}
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>Voice Settings</CardTitle>
                <CardDescription>Configure voice input and output preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Voice Responses</div>
                      <div className="text-sm text-muted-foreground">Enable text-to-speech</div>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Voice Input</div>
                      <div className="text-sm text-muted-foreground">Enable speech-to-text</div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </ProtectedRoute>
  )
}
