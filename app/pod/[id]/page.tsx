"use client"

import type React from "react"

import { useState } from "react"
import {
  MessageSquare,
  Target,
  Lightbulb,
  CalendarIcon,
  FileText,
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  Users,
  X,
  Upload,
  Plus,
  ChevronDown,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Clock,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProtectedRoute } from "@/components/protected-route"
import { Calendar } from "@/components/ui/calendar"

type TabType = "chat" | "goals" | "strategies" | "calendar" | "documents" | "feedback" | "meetings"

const tabs = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "goals", label: "Goals", icon: Target },
  { id: "strategies", label: "Strategies", icon: Lightbulb },
  { id: "calendar", label: "Calendar", icon: CalendarIcon },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "feedback", label: "Feedback", icon: MessageCircle },
  { id: "meetings", label: "Meetings", icon: Video },
]

const chatMessages = [
  {
    id: "1",
    user: "Sarah Chen",
    avatar: "/investor-avatar-1.png",
    message: "Hey team! Just reviewed the latest prototype. Looking great!",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: "2",
    user: "You",
    avatar: "/diverse-user-avatars.png",
    message: "Thanks Sarah! We've been working hard on the UI improvements.",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: "3",
    user: "Alex Rodriguez",
    avatar: "/freelancer-avatar-1.png",
    message: "I'll have the backend API ready by tomorrow. @Jinx can you help with the documentation?",
    time: "10:35 AM",
    isOwn: false,
  },
  {
    id: "4",
    user: "Jinx AI",
    avatar: "/ai-robot-assistant.png",
    message:
      "Of course! I'll generate comprehensive API documentation based on your endpoints. Should be ready in a few minutes.",
    time: "10:35 AM",
    isOwn: false,
    isAI: true,
  },
]

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Founder",
    avatar: "/investor-avatar-1.png",
    online: true,
    email: "sarah@techstartup.com",
  },
  {
    name: "Alex Rodriguez",
    role: "Developer",
    avatar: "/freelancer-avatar-1.png",
    online: true,
    email: "alex@techstartup.com",
  },
  {
    name: "Emma Wilson",
    role: "Designer",
    avatar: "/freelancer-avatar-2.png",
    online: false,
    email: "emma@techstartup.com",
  },
  { name: "You", role: "Co-founder", avatar: "/diverse-user-avatars.png", online: true, email: "you@techstartup.com" },
]

const goals = [
  { id: "1", title: "Launch MVP", status: "in-progress", dueDate: "Dec 15" },
  { id: "2", title: "Secure seed funding", status: "in-progress", dueDate: "Jan 30" },
  { id: "3", title: "Reach 1000 users", status: "not-started", dueDate: "Feb 28" },
  { id: "4", title: "Build marketing website", status: "done", dueDate: "Nov 20" },
]

const strategies = [
  {
    id: "1",
    title: "Go-to-Market Strategy",
    description: "Focus on B2B SaaS companies with 10-50 employees",
    tags: ["Marketing", "Sales"],
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    title: "Product Roadmap Q1 2025",
    description: "Key features: AI integration, mobile app, analytics dashboard",
    tags: ["Product", "Development"],
    lastUpdated: "1 week ago",
  },
  {
    id: "3",
    title: "Fundraising Approach",
    description: "Target angel investors and early-stage VCs in the Bay Area",
    tags: ["Funding", "Finance"],
    lastUpdated: "3 days ago",
  },
]

const documents = [
  { id: "1", name: "Business Plan 2025.pdf", size: "2.4 MB", type: "PDF", uploadedBy: "Sarah Chen", date: "Dec 1" },
  { id: "2", name: "Pitch Deck v3.pptx", size: "8.1 MB", type: "PPTX", uploadedBy: "You", date: "Nov 28" },
  {
    id: "3",
    name: "Financial Projections.xlsx",
    size: "1.2 MB",
    type: "XLSX",
    uploadedBy: "Alex Rodriguez",
    date: "Nov 25",
  },
  { id: "4", name: "Brand Guidelines.pdf", size: "5.6 MB", type: "PDF", uploadedBy: "Emma Wilson", date: "Nov 20" },
]

const feedbackItems = [
  {
    id: "1",
    author: "Anonymous",
    content: "The onboarding flow is confusing. Consider adding a tutorial.",
    reactions: 12,
    date: "2 days ago",
  },
  {
    id: "2",
    author: "Sarah Chen",
    content: "Love the new dashboard design! Much cleaner than before.",
    reactions: 8,
    date: "3 days ago",
  },
  {
    id: "3",
    author: "Anonymous",
    content: "Mobile app needs better performance optimization.",
    reactions: 15,
    date: "1 week ago",
  },
]

const upcomingMeetings = [
  {
    id: "1",
    title: "Team Standup",
    time: "Today, 2:00 PM",
    duration: "30 min",
    host: "Sarah Chen",
    participants: 5,
    meetingLink: "https://meet.wace.io/techstartup-standup",
    type: "video",
  },
  {
    id: "2",
    title: "Investor Pitch Practice",
    time: "Tomorrow, 10:00 AM",
    duration: "1 hour",
    host: "You",
    participants: 3,
    meetingLink: "https://meet.wace.io/techstartup-pitch",
    type: "video",
  },
  {
    id: "3",
    title: "Product Design Review",
    time: "Dec 18, 3:00 PM",
    duration: "45 min",
    host: "Alex Rodriguez",
    participants: 4,
    meetingLink: "https://meet.wace.io/techstartup-design",
    type: "video",
  },
]

const pastMeetings = [
  {
    id: "1",
    title: "Sprint Planning",
    date: "Dec 10, 2024",
    duration: "1 hour",
    participants: 6,
    recording: true,
  },
  {
    id: "2",
    title: "Weekly Sync",
    date: "Dec 8, 2024",
    duration: "30 min",
    participants: 5,
    recording: true,
  },
  {
    id: "3",
    title: "Strategy Discussion",
    date: "Dec 5, 2024",
    duration: "45 min",
    participants: 4,
    recording: false,
  },
]

const calendarEvents = [
  { id: "1", title: "Team Standup", date: new Date(2025, 0, 10, 10, 0), type: "meeting" },
  { id: "2", title: "Investor Pitch", date: new Date(2025, 0, 12, 14, 0), type: "important" },
  { id: "3", title: "Product Demo", date: new Date(2025, 0, 15, 15, 30), type: "meeting" },
  { id: "4", title: "Sprint Planning", date: new Date(2025, 0, 17, 9, 0), type: "meeting" },
]

export default function PodWorkspacePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<TabType>("chat")
  const [message, setMessage] = useState("")

  const [showMembersDrawer, setShowMembersDrawer] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showAddGoalModal, setShowAddGoalModal] = useState(false)
  const [showAddStrategyModal, setShowAddStrategyModal] = useState(false)
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [showUploadFileModal, setShowUploadFileModal] = useState(false)
  const [showAddFeedbackModal, setShowAddFeedbackModal] = useState(false)
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false)
  const [showJoinMeetingModal, setShowJoinMeetingModal] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<typeof upcomingMeetings[0] | null>(null)
  const [showMentionSuggestion, setShowMentionSuggestion] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessage(value)

    if (value.endsWith("@") || value.includes("@j") || value.includes("@J")) {
      setShowMentionSuggestion(true)
    } else {
      setShowMentionSuggestion(false)
    }
  }

  const insertJinxMention = () => {
    setMessage(message.replace(/@j?$/i, "@Jinx "))
    setShowMentionSuggestion(false)
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 rounded-2xl">
              <AvatarImage src="/tech-startup-logo.png" alt="TechStartup" />
              <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary/20 to-[oklch(0.6_0.2_290)]/20 text-primary">
                TS
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">TechStartup</h1>
              <p className="text-sm text-muted-foreground">5 members online</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowMembersDrawer(!showMembersDrawer)}
              className="rounded-xl"
            >
              <Users className="w-5 h-5" />
            </Button>
            <Button onClick={() => setShowInviteModal(true)} className="rounded-xl bg-primary hover:bg-primary/90">
              Invite Members
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        <aside className="w-64 border-r border-border bg-card/50 p-4 overflow-y-auto">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn("w-full justify-start rounded-xl", isActive && "bg-primary text-primary-foreground")}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="flex flex-col h-full">
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-3", msg.isOwn && "flex-row-reverse")}>
                    <Avatar className="w-10 h-10 rounded-xl">
                      <AvatarImage src={msg.avatar || "/placeholder.svg"} alt={msg.user} />
                      <AvatarFallback className="rounded-xl">{msg.user.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className={cn("flex-1 max-w-lg", msg.isOwn && "flex flex-col items-end")}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{msg.user}</span>
                        {msg.isAI && (
                          <Badge className="rounded-lg bg-gradient-to-r from-primary to-[oklch(0.6_0.2_290)] text-white text-xs">
                            AI
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <div
                        className={cn(
                          "rounded-2xl p-4",
                          msg.isOwn
                            ? "bg-primary text-primary-foreground"
                            : msg.isAI
                              ? "bg-gradient-to-br from-primary/10 to-[oklch(0.6_0.2_290)]/10 border border-primary/20"
                              : "bg-muted",
                        )}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {showMentionSuggestion && (
                <div className="absolute bottom-24 left-6 z-10">
                  <button
                    onClick={insertJinxMention}
                    className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg hover:bg-muted transition-colors"
                  >
                    <Avatar className="w-6 h-6 rounded-md">
                      <AvatarImage src="/ai-robot-assistant.png" alt="Jinx" />
                      <AvatarFallback className="rounded-md text-xs">AI</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Jinx AI</span>
                  </button>
                </div>
              )}

              {/* Message Input */}
              <div className="border-t border-border p-4 bg-card/50">
                <div className="flex gap-3">
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Type a message... (@Jinx for AI help)"
                    value={message}
                    onChange={handleMessageChange}
                    className="flex-1 rounded-xl border-border"
                  />
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button size="icon" className="rounded-xl bg-primary hover:bg-primary/90">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Startup Goals</h2>
                <Button onClick={() => setShowAddGoalModal(true)} className="rounded-xl bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </div>
              <div className="grid gap-4">
                {goals.map((goal) => (
                  <Card key={goal.id} className="rounded-2xl border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground">Due: {goal.dueDate}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-xl bg-transparent">
                              <span className="capitalize">{goal.status.replace("-", " ")}</span>
                              <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem className="rounded-lg">Not Started</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg">In Progress</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg">Done</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Strategies Tab */}
          {activeTab === "strategies" && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Strategies & Notes</h2>
                <Button
                  onClick={() => setShowAddStrategyModal(true)}
                  className="rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Strategy
                </Button>
              </div>
              <div className="grid gap-4">
                {strategies.map((strategy) => (
                  <Card
                    key={strategy.id}
                    className="rounded-2xl border-border hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{strategy.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{strategy.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {strategy.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="rounded-lg">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">Updated {strategy.lastUpdated}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === "calendar" && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Team Calendar</h2>
                <Button
                  onClick={() => setShowAddEventModal(true)}
                  className="rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>
              <div className="grid md:grid-cols-[1fr_300px] gap-6">
                <Card className="rounded-2xl border-border">
                  <CardContent className="p-6">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-xl" />
                  </CardContent>
                </Card>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Upcoming Events</h3>
                  {calendarEvents.map((event) => (
                    <Card key={event.id} className="rounded-xl border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.date.toLocaleDateString()} at{" "}
                              {event.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Documents & Resources</h2>
                <Button
                  onClick={() => setShowUploadFileModal(true)}
                  className="rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </div>
              <Card className="rounded-2xl border-border">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-[oklch(0.6_0.2_290)]/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{doc.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {doc.size} • Uploaded by {doc.uploadedBy} • {doc.date}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Team Feedback</h2>
                <Button
                  onClick={() => setShowAddFeedbackModal(true)}
                  className="rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feedback
                </Button>
              </div>
              <div className="grid gap-4">
                {feedbackItems.map((feedback) => (
                  <Card key={feedback.id} className="rounded-2xl border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 rounded-xl">
                            <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-[oklch(0.6_0.2_290)]/20 text-primary">
                              {feedback.author === "Anonymous" ? "?" : feedback.author.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{feedback.author}</p>
                            <p className="text-xs text-muted-foreground">{feedback.date}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="rounded-lg">
                          {feedback.reactions} reactions
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed">{feedback.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Meetings Tab Content */}
          {activeTab === "meetings" && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Meetings</h2>
                <Button
                  onClick={() => setShowScheduleMeetingModal(true)}
                  className="rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>

              {/* Upcoming Meetings */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Upcoming Meetings</h3>
                  <div className="grid gap-4">
                    {upcomingMeetings.map((meeting) => (
                      <Card key={meeting.id} className="rounded-2xl border-border hover:border-primary/50 transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                                <Video className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg mb-1">{meeting.title}</h4>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {meeting.time}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {meeting.participants} participants
                                  </div>
                                  <Badge variant="secondary" className="rounded-lg">
                                    {meeting.duration}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Hosted by {meeting.host}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                                onClick={() => {
                                  navigator.clipboard.writeText(meeting.meetingLink)
                                }}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="rounded-xl bg-primary hover:bg-primary/90"
                                onClick={() => {
                                  setSelectedMeeting(meeting)
                                  setShowJoinMeetingModal(true)
                                }}
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Join
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Past Meetings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Past Meetings</h3>
                  <div className="grid gap-4">
                    {pastMeetings.map((meeting) => (
                      <Card key={meeting.id} className="rounded-2xl border-border">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                <Video className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{meeting.title}</h4>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <span>{meeting.date}</span>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {meeting.participants} participants
                                  </div>
                                  <Badge variant="secondary" className="rounded-lg">
                                    {meeting.duration}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {meeting.recording && (
                              <Button variant="outline" size="sm" className="rounded-xl ml-4">
                                View Recording
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {showMembersDrawer && (
            <div className="absolute top-0 right-0 h-full w-80 bg-card border-l border-border shadow-xl z-20 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Team Members</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMembersDrawer(false)}
                    className="rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="relative">
                        <Avatar className="w-10 h-10 rounded-xl">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback className="rounded-xl">{member.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        {member.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Invite Members Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
            <DialogDescription>Send invitations to new team members via email</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="colleague@example.com" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal note to your invitation..."
                className="rounded-xl"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={() => setShowInviteModal(false)} className="rounded-xl bg-primary">
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Goal Modal */}
      <Dialog open={showAddGoalModal} onOpenChange={setShowAddGoalModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>Create a new goal for your startup</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input id="goal-title" placeholder="e.g., Launch MVP" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-status">Status</Label>
              <Select defaultValue="not-started">
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-date">Due Date</Label>
              <Input id="goal-date" type="date" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-description">Description (Optional)</Label>
              <Textarea
                id="goal-description"
                placeholder="Add details about this goal..."
                className="rounded-xl"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGoalModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={() => setShowAddGoalModal(false)} className="rounded-xl bg-primary">
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Strategy Modal */}
      <Dialog open={showAddStrategyModal} onOpenChange={setShowAddStrategyModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create New Strategy</DialogTitle>
            <DialogDescription>Document a new strategy or brainstorming note</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="strategy-title">Strategy Title</Label>
              <Input id="strategy-title" placeholder="e.g., Go-to-Market Strategy" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strategy-description">Description</Label>
              <Textarea
                id="strategy-description"
                placeholder="Describe your strategy in detail..."
                className="rounded-xl"
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strategy-tags">Tags (comma-separated)</Label>
              <Input id="strategy-tags" placeholder="e.g., Marketing, Sales, Product" className="rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStrategyModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={() => setShowAddStrategyModal(false)} className="rounded-xl bg-primary">
              Create Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Modal */}
      <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add Calendar Event</DialogTitle>
            <DialogDescription>Schedule a new meeting or event</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input id="event-title" placeholder="e.g., Team Standup" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Date</Label>
                <Input id="event-date" type="date" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time">Time</Label>
                <Input id="event-time" type="time" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select defaultValue="meeting">
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Description (Optional)</Label>
              <Textarea id="event-description" placeholder="Add event details..." className="rounded-xl" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEventModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={() => setShowAddEventModal(false)} className="rounded-xl bg-primary">
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload File Modal */}
      <Dialog open={showUploadFileModal} onOpenChange={setShowUploadFileModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a file to share with your team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>File</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, PPTX (max 10MB)</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-description">Description (Optional)</Label>
              <Textarea
                id="file-description"
                placeholder="Add a description for this file..."
                className="rounded-xl"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadFileModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={() => setShowUploadFileModal(false)} className="rounded-xl bg-primary">
              Upload File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Feedback Modal */}
      <Dialog open={showAddFeedbackModal} onOpenChange={setShowAddFeedbackModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
            <DialogDescription>Share your thoughts and suggestions with the team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-content">Feedback</Label>
              <Textarea id="feedback-content" placeholder="Share your feedback..." className="rounded-xl" rows={5} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="anonymous" className="rounded" />
              <Label htmlFor="anonymous" className="text-sm font-normal cursor-pointer">
                Submit anonymously
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFeedbackModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={() => setShowAddFeedbackModal(false)} className="rounded-xl bg-primary">
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Modal */}
      <Dialog open={showScheduleMeetingModal} onOpenChange={setShowScheduleMeetingModal}>
        <DialogContent className="rounded-2xl max-w-xl">
          <DialogHeader>
            <DialogTitle>Schedule a Meeting</DialogTitle>
            <DialogDescription>Create a new video/audio meeting for your team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-title">Meeting Title</Label>
              <Input id="meeting-title" placeholder="e.g., Weekly Team Sync" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-date">Date</Label>
                <Input id="meeting-date" type="date" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-time">Time</Label>
                <Input id="meeting-time" type="time" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-duration">Duration</Label>
              <Select>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-description">Description (Optional)</Label>
              <Textarea
                id="meeting-description"
                placeholder="Add meeting agenda or notes..."
                className="rounded-xl"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Meeting Type</Label>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 rounded-xl">
                  <Video className="w-4 h-4 mr-2" />
                  Video Call
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl">
                  <Mic className="w-4 h-4 mr-2" />
                  Audio Only
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleMeetingModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={() => setShowScheduleMeetingModal(false)} className="rounded-xl bg-primary">
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Meeting Modal (Video Call Interface) */}
      <Dialog open={showJoinMeetingModal} onOpenChange={setShowJoinMeetingModal}>
        <DialogContent className="rounded-2xl max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedMeeting?.title}</DialogTitle>
            <DialogDescription>
              Hosted by {selectedMeeting?.host} • {selectedMeeting?.participants} participants
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Video Display Area */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Avatar className="w-32 h-32 rounded-3xl mx-auto border-4 border-primary/50">
                    <AvatarFallback className="rounded-3xl bg-gradient-to-br from-primary/20 to-[oklch(0.6_0.2_290)]/20 text-primary text-4xl">
                      YOU
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <p className="font-semibold text-lg">You</p>
                    <p className="text-sm text-gray-400">Waiting for others to join...</p>
                  </div>
                </div>
              </div>

              {/* Other Participants Grid (shown when people join) */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-24 h-24 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center"
                  >
                    <Avatar className="w-16 h-16 rounded-xl">
                      <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-[oklch(0.6_0.2_290)]/20 text-primary">
                        U{i}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                      "rounded-xl w-14 h-14",
                      isMuted ? "bg-red-500/20 border-red-500 text-red-500" : "bg-white/10 border-white/20 text-white",
                    )}
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                      "rounded-xl w-14 h-14",
                      isVideoOff
                        ? "bg-red-500/20 border-red-500 text-red-500"
                        : "bg-white/10 border-white/20 text-white",
                    )}
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-xl w-14 h-14 bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => {
                      setShowJoinMeetingModal(false)
                      setIsMuted(false)
                      setIsVideoOff(false)
                    }}
                  >
                    <PhoneOff className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Meeting Info */}
            <Card className="rounded-xl border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Meeting Link</p>
                      <p className="text-xs text-muted-foreground">{selectedMeeting?.meetingLink}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMeeting?.meetingLink || "")
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  )
}
