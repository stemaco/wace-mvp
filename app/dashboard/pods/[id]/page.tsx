"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Send, Plus, Users, MoreHorizontal, Paperclip, Smile, Settings, UserPlus, Calendar, ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle, Target, Zap } from "lucide-react"
import { PodSidebar } from "@/components/pod-sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { cn } from "@/lib/utils"

type PodSection =
  | "chat"
  | "goals"
  | "strategy"
  | "documents"
  | "calendar"
  | "resources"
  | "feedback"

export default function PodWorkspacePage() {
  const params = useParams()
  const podId = params.id as string
  const [activeSection, setActiveSection] = useState<PodSection>("chat")
  const [message, setMessage] = useState("")
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      message: "Hey team! How's the project going?",
      sender: "You",
      timestamp: "2:30 PM",
      isCurrentUser: true,
      isAI: false,
    },
    {
      id: 2,
      message: "Great! We're making good progress on the frontend. The new components are looking clean.",
      sender: "Sarah Chen",
      timestamp: "2:31 PM",
      isCurrentUser: false,
      isAI: false,
    },
    {
      id: 3,
      message: "That's awesome! I've been working on the backend API endpoints. Should have them ready by tomorrow.",
      sender: "Mike Johnson",
      timestamp: "2:32 PM",
      isCurrentUser: false,
      isAI: false,
    },
    {
      id: 4,
      message: "Perfect! I can help with the API integration once you're done. Let me know if you need any assistance with the frontend components.",
      sender: "JINX",
      timestamp: "2:33 PM",
      isCurrentUser: false,
      isAI: true,
    },
    {
      id: 5,
      message: "Thanks JINX! That would be really helpful. I'll ping you once the endpoints are ready.",
      sender: "You",
      timestamp: "2:34 PM",
      isCurrentUser: true,
      isAI: false,
    },
    {
      id: 6,
      message: "Great work everyone! The project is on track. I've analyzed the current progress and everything looks good. Keep up the excellent work!",
      sender: "JINX",
      timestamp: "2:35 PM",
      isCurrentUser: false,
      isAI: true,
    },
  ])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high"
  })
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Launch MVP",
      description: "Complete and launch the minimum viable product",
      progress: 75,
      dueDate: "March 15, 2025",
      priority: "high" as "low" | "medium" | "high",
      status: "in-progress" as "planning" | "in-progress" | "completed",
      tasksRemaining: 3
    },
    {
      id: 2,
      title: "Secure Seed Funding",
      description: "Raise $500K seed round from investors",
      progress: 25,
      dueDate: "June 2025",
      priority: "high" as "low" | "medium" | "high",
      status: "planning" as "planning" | "in-progress" | "completed",
      tasksRemaining: 0
    }
  ])
  const [showAddStrategy, setShowAddStrategy] = useState(false)
  const [newStrategy, setNewStrategy] = useState({
    title: "",
    description: "",
    category: "market-analysis" as "market-analysis" | "business-model" | "competitive-analysis" | "financial-planning" | "product-strategy",
    priority: "medium" as "low" | "medium" | "high"
  })
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      title: "Market Analysis",
      description: "Competitive landscape and market opportunities",
      category: "market-analysis" as "market-analysis" | "business-model" | "competitive-analysis" | "financial-planning" | "product-strategy",
      priority: "high" as "low" | "medium" | "high",
      metrics: {
        marketSize: "$2.5B",
        growthRate: "15% YoY",
        competitors: "5 identified"
      }
    },
    {
      id: 2,
      title: "Business Model",
      description: "Revenue streams and pricing strategy",
      category: "business-model" as "market-analysis" | "business-model" | "competitive-analysis" | "financial-planning" | "product-strategy",
      priority: "high" as "low" | "medium" | "high",
      metrics: {
        primaryRevenue: "SaaS Subscriptions",
        targetARPU: "$49/month",
        breakEven: "500 customers"
      }
    }
  ])
  const [showUploadFile, setShowUploadFile] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [documents, setDocuments] = useState([
    { 
      id: 1, 
      name: "Business Plan v2.pdf", 
      size: "2.4 MB", 
      modified: "2 days ago", 
      type: "pdf",
      uploadedBy: "You",
      category: "Business Plan"
    },
    { 
      id: 2, 
      name: "User Research Findings.docx", 
      size: "1.8 MB", 
      modified: "1 week ago", 
      type: "doc",
      uploadedBy: "Sarah Chen",
      category: "Research"
    },
    { 
      id: 3, 
      name: "Wireframes_v3.fig", 
      size: "15.2 MB", 
      modified: "3 days ago", 
      type: "design",
      uploadedBy: "Mike Johnson",
      category: "Design"
    },
    { 
      id: 4, 
      name: "Financial Projections.xlsx", 
      size: "892 KB", 
      modified: "5 days ago", 
      type: "spreadsheet",
      uploadedBy: "Lisa Wang",
      category: "Financial"
    }
  ])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "meeting" as "meeting" | "work" | "deadline" | "milestone" | "other",
    priority: "medium" as "low" | "medium" | "high"
  })
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Team Standup",
      description: "Daily team sync meeting",
      date: "2024-01-15",
      time: "09:00",
      type: "meeting" as "meeting" | "work" | "deadline" | "milestone" | "other",
      priority: "high" as "low" | "medium" | "high",
      createdBy: "You"
    },
    {
      id: 2,
      title: "MVP Launch Deadline",
      description: "Final deadline for MVP launch",
      date: "2024-01-20",
      time: "17:00",
      type: "deadline" as "meeting" | "work" | "deadline" | "milestone" | "other",
      priority: "high" as "low" | "medium" | "high",
      createdBy: "Sarah Chen"
    },
    {
      id: 3,
      title: "User Research Analysis",
      description: "Complete user research analysis",
      date: "2024-01-18",
      time: "14:00",
      type: "work" as "meeting" | "work" | "deadline" | "milestone" | "other",
      priority: "medium" as "low" | "medium" | "high",
      createdBy: "Mike Johnson"
    }
  ])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showAddResource, setShowAddResource] = useState(false)
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    url: "",
    category: "video" as "video" | "link" | "document" | "audio" | "image",
    priority: "medium" as "low" | "medium" | "high"
  })
  const [selectedCategory, setSelectedCategory] = useState<"all" | "video" | "link" | "document" | "audio" | "image">("all")
  const [showAddFeedback, setShowAddFeedback] = useState(false)
  const [newFeedback, setNewFeedback] = useState({
    title: "",
    message: "",
    type: "suggestion" as "suggestion" | "bug" | "feature" | "complaint" | "praise",
    priority: "medium" as "low" | "medium" | "high",
    isAnonymous: false
  })
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      title: "Improve Chat Interface",
      message: "The chat interface could be more intuitive with better message threading and search functionality.",
      type: "suggestion" as "suggestion" | "bug" | "feature" | "complaint" | "praise",
      priority: "high" as "low" | "medium" | "high",
      isAnonymous: false,
      author: "You",
      date: "2024-01-15",
      status: "open" as "open" | "in-progress" | "resolved" | "closed"
    },
    {
      id: 2,
      title: "Calendar Sync Issue",
      message: "Calendar events are not syncing properly with external calendars. This is affecting our team's productivity.",
      type: "bug" as "suggestion" | "bug" | "feature" | "complaint" | "praise",
      priority: "high" as "low" | "medium" | "high",
      isAnonymous: false,
      author: "Sarah Chen",
      date: "2024-01-14",
      status: "in-progress" as "open" | "in-progress" | "resolved" | "closed"
    },
    {
      id: 3,
      title: "Great Team Collaboration",
      message: "The pod collaboration features are amazing! Really helps our team stay organized and productive.",
      type: "praise" as "suggestion" | "bug" | "feature" | "complaint" | "praise",
      priority: "low" as "low" | "medium" | "high",
      isAnonymous: true,
      author: "Anonymous",
      date: "2024-01-13",
      status: "resolved" as "open" | "in-progress" | "resolved" | "closed"
    },
    {
      id: 4,
      title: "Mobile App Request",
      message: "Would love to see a mobile app version of WACE for better accessibility on the go.",
      type: "feature" as "suggestion" | "bug" | "feature" | "complaint" | "praise",
      priority: "medium" as "low" | "medium" | "high",
      isAnonymous: false,
      author: "Mike Johnson",
      date: "2024-01-12",
      status: "open" as "open" | "in-progress" | "resolved" | "closed"
    }
  ])
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "React Tutorial Series",
      description: "Complete React.js tutorial for beginners",
      url: "https://youtube.com/watch?v=example1",
      category: "video" as "video" | "link" | "document" | "audio" | "image",
      priority: "high" as "low" | "medium" | "high",
      addedBy: "You",
      addedDate: "2024-01-10"
    },
    {
      id: 2,
      title: "Startup Funding Guide",
      description: "Comprehensive guide to startup funding",
      url: "https://example.com/funding-guide",
      category: "link" as "video" | "link" | "document" | "audio" | "image",
      priority: "high" as "low" | "medium" | "high",
      addedBy: "Sarah Chen",
      addedDate: "2024-01-12"
    },
    {
      id: 3,
      title: "Product Design Principles",
      description: "Audio podcast about design principles",
      url: "https://podcast.com/design-principles",
      category: "audio" as "video" | "link" | "document" | "audio" | "image",
      priority: "medium" as "low" | "medium" | "high",
      addedBy: "Mike Johnson",
      addedDate: "2024-01-14"
    },
    {
      id: 4,
      title: "Technical Documentation",
      description: "API documentation and technical specs",
      url: "https://docs.example.com/api",
      category: "document" as "video" | "link" | "document" | "audio" | "image",
      priority: "medium" as "low" | "medium" | "high",
      addedBy: "Lisa Wang",
      addedDate: "2024-01-16"
    },
    {
      id: 5,
      title: "UI Design Mockups",
      description: "High-quality UI design mockups",
      url: "https://dribbble.com/ui-mockups",
      category: "image" as "video" | "link" | "document" | "audio" | "image",
      priority: "low" as "low" | "medium" | "high",
      addedBy: "Mike Johnson",
      addedDate: "2024-01-18"
    }
  ])

  const handleAddGoal = () => {
    if (newGoal.title.trim()) {
      const goal = {
        id: Date.now(),
        title: newGoal.title,
        description: newGoal.description,
        progress: 0,
        dueDate: newGoal.dueDate,
        priority: newGoal.priority,
        status: "planning" as "planning" | "in-progress" | "completed",
        tasksRemaining: 0
      }
      setGoals([...goals, goal])
      setNewGoal({ title: "", description: "", dueDate: "", priority: "medium" })
      setShowAddGoal(false)
    }
  }

  const handleAddStrategy = () => {
    if (newStrategy.title.trim()) {
      const strategy = {
        id: Date.now(),
        title: newStrategy.title,
        description: newStrategy.description,
        category: newStrategy.category,
        priority: newStrategy.priority,
        metrics: {
          marketSize: "TBD",
          growthRate: "TBD",
          competitors: "TBD"
        }
      }
      setStrategies([...strategies, strategy])
      setNewStrategy({ title: "", description: "", category: "market-analysis", priority: "medium" })
      setShowAddStrategy(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadFile(file)
    }
  }

  const handleUploadDocument = () => {
    if (uploadFile) {
      const fileSize = (uploadFile.size / (1024 * 1024)).toFixed(1) + " MB"
      const fileType = uploadFile.name.split('.').pop()?.toLowerCase() || 'unknown'
      const category = getFileCategory(fileType)
      
      const document = {
        id: Date.now(),
        name: uploadFile.name,
        size: fileSize,
        modified: "Just now",
        type: fileType,
        uploadedBy: "You",
        category: category
      }
      
      setDocuments([...documents, document])
      setUploadFile(null)
      setShowUploadFile(false)
    }
  }

  const getFileCategory = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return 'Business Plan'
      case 'doc':
      case 'docx':
        return 'Document'
      case 'xlsx':
      case 'xls':
        return 'Financial'
      case 'fig':
      case 'sketch':
        return 'Design'
      case 'jpg':
      case 'png':
      case 'gif':
        return 'Image'
      default:
        return 'Other'
    }
  }

  const handleAddEvent = () => {
    if (newEvent.title.trim() && newEvent.date) {
      const event = {
        id: Date.now(),
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        type: newEvent.type,
        priority: newEvent.priority,
        createdBy: "You"
      }
      setEvents([...events, event])
      setNewEvent({ title: "", description: "", date: "", time: "", type: "meeting", priority: "medium" })
      setShowAddEvent(false)
    }
  }

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleAddResource = () => {
    if (newResource.title.trim() && newResource.url.trim()) {
      const resource = {
        id: Date.now(),
        title: newResource.title,
        description: newResource.description,
        url: newResource.url,
        category: newResource.category,
        priority: newResource.priority,
        addedBy: "You",
        addedDate: new Date().toISOString().split('T')[0]
      }
      setResources([...resources, resource])
      setNewResource({ title: "", description: "", url: "", category: "video", priority: "medium" })
      setShowAddResource(false)
    }
  }

  const handleAddFeedback = () => {
    if (newFeedback.title.trim() && newFeedback.message.trim()) {
      const feedback = {
        id: Date.now(),
        title: newFeedback.title,
        message: newFeedback.message,
        type: newFeedback.type,
        priority: newFeedback.priority,
        isAnonymous: newFeedback.isAnonymous,
        author: newFeedback.isAnonymous ? "Anonymous" : "You",
        date: new Date().toISOString().split('T')[0],
        status: "open" as "open" | "in-progress" | "resolved" | "closed"
      }
      setFeedbacks([...feedbacks, feedback])
      setNewFeedback({ title: "", message: "", type: "suggestion", priority: "medium", isAnonymous: false })
      setShowAddFeedback(false)
    }
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)
    
    // Check for @ mention
    const lastAtIndex = value.lastIndexOf('@')
    if (lastAtIndex !== -1) {
      const afterAt = value.substring(lastAtIndex + 1)
      const hasSpace = afterAt.includes(' ')
      
      if (!hasSpace && afterAt.length > 0) {
        setMentionQuery(afterAt.toLowerCase())
        setShowMentionDropdown(true)
      } else {
        setShowMentionDropdown(false)
      }
    } else {
      setShowMentionDropdown(false)
    }
  }

  const handleMentionSelect = (mention: string) => {
    const lastAtIndex = message.lastIndexOf('@')
    if (lastAtIndex !== -1) {
      const beforeAt = message.substring(0, lastAtIndex)
      const afterMention = message.substring(lastAtIndex + mentionQuery.length + 1)
      setMessage(beforeAt + '@' + mention + ' ' + afterMention)
    }
    setShowMentionDropdown(false)
    setMentionQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getPodData = (id: string) => {
    const pods = {
      "1": {
        id: 1,
        name: "TRICE Pod",
        description: "Building the next big SaaS platform with AI integration",
        members: [
          { id: 1, name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Founder" },
          { id: 2, name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "CTO" },
          { id: 3, name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", status: "away", role: "Designer" },
          { id: 4, name: "Lisa Wang", avatar: "/placeholder.svg?height=32&width=32", status: "offline", role: "Marketing" },
        ],
        privacy: "private" as const,
      },
      "2": {
        id: 2,
        name: "Trice Pod",
        description: "Innovative design solutions for modern businesses",
        members: [
          { id: 1, name: "Alex Rivera", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Lead Designer" },
          { id: 2, name: "Emma Thompson", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "UX Researcher" },
          { id: 3, name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", status: "away", role: "Frontend Developer" },
        ],
        privacy: "public" as const,
      },
      "3": {
        id: 3,
        name: "Zyroz Pod",
        description: "Advanced analytics and data science solutions",
        members: [
          { id: 1, name: "Maria Garcia", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Data Scientist" },
          { id: 2, name: "James Wilson", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "ML Engineer" },
          { id: 3, name: "Sophie Chen", avatar: "/placeholder.svg?height=32&width=32", status: "offline", role: "Analyst" },
        ],
        privacy: "unlisted" as const,
      },
      "4": {
        id: 4,
        name: "DeepRoot Pod",
        description: "Sustainable technology and environmental solutions",
        members: [
          { id: 1, name: "Elena Rodriguez", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Environmental Engineer" },
          { id: 2, name: "Tom Anderson", avatar: "/placeholder.svg?height=32&width=32", status: "away", role: "Sustainability Consultant" },
          { id: 3, name: "Nina Patel", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Project Manager" },
        ],
        privacy: "private" as const,
      }
    }
    
    return pods[id as keyof typeof pods] || pods["1"]
  }

  const podData = getPodData(podId)


  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        message: message.trim(),
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
        isAI: false,
      }
      
      setChatMessages(prev => [...prev, newMessage])
      setMessage("")
      setShowMentionDropdown(false)
      setMentionQuery("")
      
      // Check if message mentions JINX
      if (message.toLowerCase().includes('@jinx') || message.toLowerCase().includes('@j')) {
        // Simulate JINX response after a short delay
        setTimeout(() => {
          const jinxResponse = {
            id: Date.now() + 1,
            message: generateJinxResponse(message),
            sender: "JINX",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCurrentUser: false,
            isAI: true,
          }
          setChatMessages(prev => [...prev, jinxResponse])
        }, 1500)
      }
    }
  }

  const generateJinxResponse = (userMessage: string) => {
    const responses = [
      "I'm here to help! What specific assistance do you need?",
      "That's a great question! Let me think about the best approach for this.",
      "I can definitely help with that. Here's what I suggest...",
      "Thanks for mentioning me! I'm ready to assist with your request.",
      "I've analyzed your message and here's my recommendation:",
      "Great to hear from you! I'm here to support the team.",
      "I understand what you're asking. Let me provide some insights:",
      "That's an interesting point! Here's my perspective on this:",
      "I'm ready to help! What would you like me to focus on?",
      "Thanks for reaching out! I'm here to assist with any questions you have."
    ]
    
    // Simple keyword-based responses
    if (userMessage.toLowerCase().includes('help')) {
      return "I'm here to help! What specific assistance do you need?"
    } else if (userMessage.toLowerCase().includes('project')) {
      return "Great to hear about the project! I can help with planning, analysis, or any technical questions you might have."
    } else if (userMessage.toLowerCase().includes('code')) {
      return "I can help with code review, debugging, or suggesting best practices. What specific coding challenge are you facing?"
    } else if (userMessage.toLowerCase().includes('meeting')) {
      return "I can help schedule meetings, take notes, or prepare agendas. What meeting-related assistance do you need?"
    } else if (userMessage.toLowerCase().includes('deadline')) {
      return "I can help you track deadlines and create timelines. Let me know what deadlines you're working with."
    } else {
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const renderContent = () => {
    switch (activeSection) {
      case "chat":
        return (
          <div className="flex flex-col h-full">

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gray-700 text-white">
                        {msg.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-white">{msg.sender}</span>
                        {msg.isAI && (
                          <Badge className="bg-gradient-to-r from-blue-800 to-blue-700 text-white text-xs">
                            AI
                          </Badge>
                        )}
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          msg.isAI
                            ? "bg-blue-800 text-white"
                            : "bg-gray-800/50 text-white"
                        }`}
                      >
                        <p className="text-sm text-white">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-gray-700 p-4 bg-[#000917] relative">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="hover:bg-blue-800/30 hover:text-blue-300 text-gray-400">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Type a message... Use @ to mention JINX"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                    className="min-h-[40px] max-h-32 resize-none bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                  />
                  
                  {/* Mention Dropdown */}
                  {showMentionDropdown && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <div className="text-xs text-gray-400 mb-2">Mention someone:</div>
                        <div className="space-y-1">
                          {["jinx", "JINX"].filter(name => 
                            name.toLowerCase().includes(mentionQuery)
                          ).map((name) => (
                            <button
                              key={name}
                              onClick={() => handleMentionSelect(name)}
                              className="w-full text-left p-2 rounded hover:bg-blue-800/30 text-white flex items-center space-x-2"
                            >
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-800 to-blue-700 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">J</span>
                              </div>
                              <span className="text-sm">{name}</span>
                              <span className="text-xs text-gray-400">AI Assistant</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-blue-800/30 hover:text-blue-300 text-gray-400">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage} size="icon" className="bg-blue-800 hover:bg-blue-900 text-white">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )

      case "goals":
        return (
          <div className="p-6 space-y-6 bg-[#000917]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Goals & Milestones</h2>
                <p className="text-gray-300">Track your startup's key objectives and progress</p>
              </div>
              <Button 
                onClick={() => setShowAddGoal(true)}
                className="bg-blue-800 hover:bg-blue-900 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </div>

            {showAddGoal && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Add New Goal</CardTitle>
                  <CardDescription className="text-gray-300">Create a new goal for your pod</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="goal-title" className="text-white">Goal Title</Label>
                    <Input
                      id="goal-title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="Enter goal title..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-description" className="text-white">Description</Label>
                    <Textarea
                      id="goal-description"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                      placeholder="Describe your goal..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goal-due-date" className="text-white">Due Date</Label>
                      <Input
                        id="goal-due-date"
                        type="date"
                        value={newGoal.dueDate}
                        onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                        className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-priority" className="text-white">Priority</Label>
                      <Select value={newGoal.priority} onValueChange={(value: "low" | "medium" | "high") => setNewGoal({...newGoal, priority: value})}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                          <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                          <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleAddGoal}
                      className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                      Add Goal
                    </Button>
                    <Button 
                      onClick={() => setShowAddGoal(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="bg-gray-800/50 border-gray-700 hover:border-blue-800/50 transition-colors backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{goal.title}</CardTitle>
                      <Badge 
                        className={cn(
                          "text-xs",
                          goal.status === "in-progress" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                          goal.status === "planning" && "bg-gray-700/50 text-gray-300 border-gray-600",
                          goal.status === "completed" && "bg-green-500/20 text-green-400 border-green-500/30"
                        )}
                      >
                        {goal.status === "in-progress" ? "In Progress" : 
                         goal.status === "planning" ? "Planning" : "Completed"}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-300">{goal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-blue-300 font-medium">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-800 h-2 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{goal.dueDate ? `Due: ${goal.dueDate}` : "No due date"}</span>
                        <span>{goal.tasksRemaining} tasks remaining</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "strategy":
        return (
          <div className="p-6 space-y-6 bg-[#000917]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Strategy & Planning</h2>
                <p className="text-gray-300">Strategic decisions and business planning</p>
              </div>
              <Button 
                onClick={() => setShowAddStrategy(true)}
                className="bg-blue-800 hover:bg-blue-900 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Strategy Doc
              </Button>
            </div>

            {showAddStrategy && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Add New Strategy Document</CardTitle>
                  <CardDescription className="text-gray-300">Create a new strategy document for your pod</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="strategy-title" className="text-white">Strategy Title</Label>
                    <Input
                      id="strategy-title"
                      value={newStrategy.title}
                      onChange={(e) => setNewStrategy({...newStrategy, title: e.target.value})}
                      placeholder="Enter strategy title..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="strategy-description" className="text-white">Description</Label>
                    <Textarea
                      id="strategy-description"
                      value={newStrategy.description}
                      onChange={(e) => setNewStrategy({...newStrategy, description: e.target.value})}
                      placeholder="Describe your strategy..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="strategy-category" className="text-white">Category</Label>
                      <Select value={newStrategy.category} onValueChange={(value: "market-analysis" | "business-model" | "competitive-analysis" | "financial-planning" | "product-strategy") => setNewStrategy({...newStrategy, category: value})}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="market-analysis" className="text-white hover:bg-gray-700">Market Analysis</SelectItem>
                          <SelectItem value="business-model" className="text-white hover:bg-gray-700">Business Model</SelectItem>
                          <SelectItem value="competitive-analysis" className="text-white hover:bg-gray-700">Competitive Analysis</SelectItem>
                          <SelectItem value="financial-planning" className="text-white hover:bg-gray-700">Financial Planning</SelectItem>
                          <SelectItem value="product-strategy" className="text-white hover:bg-gray-700">Product Strategy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="strategy-priority" className="text-white">Priority</Label>
                      <Select value={newStrategy.priority} onValueChange={(value: "low" | "medium" | "high") => setNewStrategy({...newStrategy, priority: value})}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                          <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                          <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleAddStrategy}
                      className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                      Add Strategy
                    </Button>
                    <Button 
                      onClick={() => setShowAddStrategy(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="bg-gray-800/50 border-gray-700 hover:border-blue-800/50 transition-colors backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{strategy.title}</CardTitle>
                      <Badge 
                        className={cn(
                          "text-xs",
                          strategy.priority === "high" && "bg-red-500/20 text-red-400 border-red-500/30",
                          strategy.priority === "medium" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                          strategy.priority === "low" && "bg-green-500/20 text-green-400 border-green-500/30"
                        )}
                      >
                        {strategy.priority === "high" ? "High Priority" : 
                         strategy.priority === "medium" ? "Medium Priority" : "Low Priority"}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-300">{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {strategy.category === "market-analysis" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Market Size</span>
                            <span className="text-sm font-medium text-blue-300">{strategy.metrics.marketSize}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Growth Rate</span>
                            <span className="text-sm font-medium text-blue-300">{strategy.metrics.growthRate}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Key Competitors</span>
                            <span className="text-sm font-medium text-blue-300">{strategy.metrics.competitors}</span>
                          </div>
                        </>
                      )}
                      {strategy.category === "business-model" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Primary Revenue</span>
                            <span className="text-sm font-medium text-blue-300">{strategy.metrics.primaryRevenue}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Target ARPU</span>
                            <span className="text-sm font-medium text-blue-300">{strategy.metrics.targetARPU}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Break-even</span>
                            <span className="text-sm font-medium text-blue-300">{strategy.metrics.breakEven}</span>
                          </div>
                        </>
                      )}
                      {strategy.category !== "market-analysis" && strategy.category !== "business-model" && (
                        <div className="text-center py-4">
                          <p className="text-gray-400 text-sm">Strategy document created</p>
                          <p className="text-gray-500 text-xs">Details to be added</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "documents":
        return (
          <div className="p-6 space-y-6 bg-[#000917]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Documents</h2>
                <p className="text-gray-300">Shared files and documentation</p>
              </div>
              <Button 
                onClick={() => setShowUploadFile(true)}
                className="bg-blue-800 hover:bg-blue-900 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>

            {showUploadFile && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Upload Document</CardTitle>
                  <CardDescription className="text-gray-300">Upload a new document to your pod</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload" className="text-white">Choose File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileUpload}
                      className="bg-gray-700/50 border-gray-600 text-white file:bg-blue-800 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-blue-900"
                      accept=".pdf,.doc,.docx,.xlsx,.xls,.fig,.sketch,.jpg,.jpeg,.png,.gif"
                    />
                  </div>
                  {uploadFile && (
                    <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-300" />
                        <div>
                          <p className="text-white font-medium">{uploadFile.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(uploadFile.size / (1024 * 1024)).toFixed(1)} MB • {getFileCategory(uploadFile.name.split('.').pop() || '')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleUploadDocument}
                      disabled={!uploadFile}
                      className="bg-blue-800 hover:bg-blue-900 text-white disabled:bg-gray-700 disabled:text-gray-400"
                    >
                      Upload Document
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowUploadFile(false)
                        setUploadFile(null)
                      }}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="bg-gray-800/50 border-gray-700 hover:shadow-md hover:border-blue-800/50 transition-all cursor-pointer backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-800/30 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate text-white">{doc.name}</h3>
                        <p className="text-sm text-gray-400">
                          {doc.size} • Modified {doc.modified} • {doc.uploadedBy}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-blue-800/20 text-blue-300 border-blue-800/30"
                          >
                            {doc.category}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className="text-xs border-gray-600 text-gray-400"
                          >
                            {doc.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="hover:bg-blue-800/30 hover:text-blue-300 text-gray-400">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "calendar":
        return (
          <div className="p-6 space-y-6 bg-[#000917]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Calendar</h2>
                <p className="text-gray-300">Schedule meetings, deadlines, and milestones</p>
              </div>
              <Button 
                onClick={() => setShowAddEvent(true)}
                className="bg-blue-800 hover:bg-blue-900 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>

            {showAddEvent && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Add New Event</CardTitle>
                  <CardDescription className="text-gray-300">Schedule a new event for your pod</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="event-title" className="text-white">Event Title</Label>
                    <Input
                      id="event-title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="Enter event title..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-description" className="text-white">Description</Label>
                    <Textarea
                      id="event-description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Describe the event..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-date" className="text-white">Date</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none"
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-time" className="text-white">Time</Label>
                      <Input
                        id="event-time"
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-type" className="text-white">Event Type</Label>
                      <Select value={newEvent.type} onValueChange={(value: "meeting" | "work" | "deadline" | "milestone" | "other") => setNewEvent({...newEvent, type: value})}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="meeting" className="text-white hover:bg-gray-700">Meeting</SelectItem>
                          <SelectItem value="work" className="text-white hover:bg-gray-700">Work Assignment</SelectItem>
                          <SelectItem value="deadline" className="text-white hover:bg-gray-700">Deadline</SelectItem>
                          <SelectItem value="milestone" className="text-white hover:bg-gray-700">Milestone</SelectItem>
                          <SelectItem value="other" className="text-white hover:bg-gray-700">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="event-priority" className="text-white">Priority</Label>
                      <Select value={newEvent.priority} onValueChange={(value: "low" | "medium" | "high") => setNewEvent({...newEvent, priority: value})}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                          <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                          <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleAddEvent}
                      className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                      Add Event
                    </Button>
                    <Button 
                      onClick={() => setShowAddEvent(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{formatDate(currentDate)}</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 backdrop-blur-sm">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => {
                  if (day === null) {
                    return <div key={index} className="h-20"></div>
                  }
                  
                  const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const dayEvents = getEventsForDate(dateString)
                  
                  return (
                    <div key={day} className="h-20 border border-gray-700 rounded p-1 bg-gray-800/30 hover:bg-gray-700/30 transition-colors">
                      <div className="text-sm text-white font-medium mb-1">{day}</div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs p-1 rounded truncate",
                              event.type === "meeting" && "bg-blue-800/50 text-blue-200",
                              event.type === "work" && "bg-green-800/50 text-green-200",
                              event.type === "deadline" && "bg-red-800/50 text-red-200",
                              event.type === "milestone" && "bg-purple-800/50 text-purple-200",
                              event.type === "other" && "bg-gray-700/50 text-gray-200"
                            )}
                          >
                            {event.time && `${event.time} `}{event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map(event => (
                    <Card key={event.id} className="bg-gray-800/50 border-gray-700 hover:border-blue-800/50 transition-colors backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            event.type === "meeting" && "bg-blue-800/30",
                            event.type === "work" && "bg-green-800/30",
                            event.type === "deadline" && "bg-red-800/30",
                            event.type === "milestone" && "bg-purple-800/30",
                            event.type === "other" && "bg-gray-700/30"
                          )}>
                            {event.type === "meeting" && <Users className="h-4 w-4 text-blue-300" />}
                            {event.type === "work" && <Target className="h-4 w-4 text-green-300" />}
                            {event.type === "deadline" && <AlertCircle className="h-4 w-4 text-red-300" />}
                            {event.type === "milestone" && <CheckCircle className="h-4 w-4 text-purple-300" />}
                            {event.type === "other" && <Zap className="h-4 w-4 text-gray-300" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{event.title}</h4>
                            <p className="text-sm text-gray-400 truncate">{event.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                              {event.time && (
                                <div className="flex items-center space-x-1 text-xs text-gray-400">
                                  <Clock className="h-3 w-3" />
                                  <span>{event.time}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge 
                            className={cn(
                              "text-xs",
                              event.priority === "high" && "bg-red-500/20 text-red-400 border-red-500/30",
                              event.priority === "medium" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                              event.priority === "low" && "bg-green-500/20 text-green-400 border-green-500/30"
                            )}
                          >
                            {event.priority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        )

      case "resources":
        const filteredResources = selectedCategory === "all" 
          ? resources 
          : resources.filter(resource => resource.category === selectedCategory)

        return (
          <div className="p-6 space-y-6 bg-[#000917]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Resources</h2>
                <p className="text-gray-300">Videos, links, documents, audio, and images</p>
              </div>
              <Button 
                onClick={() => setShowAddResource(true)}
                className="bg-blue-800 hover:bg-blue-900 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>

            {showAddResource && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Add New Resource</CardTitle>
                  <CardDescription className="text-gray-300">Add a new resource to your pod</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="resource-title" className="text-white">Resource Title</Label>
                    <Input
                      id="resource-title"
                      value={newResource.title}
                      onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                      placeholder="Enter resource title..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="resource-description" className="text-white">Description</Label>
                    <Textarea
                      id="resource-description"
                      value={newResource.description}
                      onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                      placeholder="Describe the resource..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="resource-url" className="text-white">URL</Label>
                    <Input
                      id="resource-url"
                      value={newResource.url}
                      onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                      placeholder="https://example.com"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="resource-category" className="text-white">Category</Label>
                      <Select value={newResource.category} onValueChange={(value: "video" | "link" | "document" | "audio" | "image") => setNewResource({...newResource, category: value})}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="video" className="text-white hover:bg-gray-700">Video</SelectItem>
                          <SelectItem value="link" className="text-white hover:bg-gray-700">Link</SelectItem>
                          <SelectItem value="document" className="text-white hover:bg-gray-700">Document</SelectItem>
                          <SelectItem value="audio" className="text-white hover:bg-gray-700">Audio</SelectItem>
                          <SelectItem value="image" className="text-white hover:bg-gray-700">Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="resource-priority" className="text-white">Priority</Label>
                      <Select value={newResource.priority} onValueChange={(value: "low" | "medium" | "high") => setNewResource({...newResource, priority: value})}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                          <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                          <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleAddResource}
                      className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                      Add Resource
                    </Button>
                    <Button 
                      onClick={() => setShowAddResource(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "text-sm",
                  selectedCategory === "all" 
                    ? "bg-blue-800 hover:bg-blue-900 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-700/50"
                )}
              >
                All ({resources.length})
              </Button>
              <Button
                variant={selectedCategory === "video" ? "default" : "outline"}
                onClick={() => setSelectedCategory("video")}
                className={cn(
                  "text-sm",
                  selectedCategory === "video" 
                    ? "bg-red-800 hover:bg-red-900 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-700/50"
                )}
              >
                Videos ({resources.filter(r => r.category === "video").length})
              </Button>
              <Button
                variant={selectedCategory === "link" ? "default" : "outline"}
                onClick={() => setSelectedCategory("link")}
                className={cn(
                  "text-sm",
                  selectedCategory === "link" 
                    ? "bg-blue-800 hover:bg-blue-900 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-700/50"
                )}
              >
                Links ({resources.filter(r => r.category === "link").length})
              </Button>
              <Button
                variant={selectedCategory === "document" ? "default" : "outline"}
                onClick={() => setSelectedCategory("document")}
                className={cn(
                  "text-sm",
                  selectedCategory === "document" 
                    ? "bg-green-800 hover:bg-green-900 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-700/50"
                )}
              >
                Documents ({resources.filter(r => r.category === "document").length})
              </Button>
              <Button
                variant={selectedCategory === "audio" ? "default" : "outline"}
                onClick={() => setSelectedCategory("audio")}
                className={cn(
                  "text-sm",
                  selectedCategory === "audio" 
                    ? "bg-purple-800 hover:bg-purple-900 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-700/50"
                )}
              >
                Audio ({resources.filter(r => r.category === "audio").length})
              </Button>
              <Button
                variant={selectedCategory === "image" ? "default" : "outline"}
                onClick={() => setSelectedCategory("image")}
                className={cn(
                  "text-sm",
                  selectedCategory === "image" 
                    ? "bg-orange-800 hover:bg-orange-900 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-700/50"
                )}
              >
                Images ({resources.filter(r => r.category === "image").length})
              </Button>
            </div>

            {/* Resources Grid */}
            <div className="grid gap-4">
              {filteredResources.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No resources found in this category.</p>
                </div>
              ) : (
                filteredResources.map(resource => (
                  <Card key={resource.id} className="bg-gray-800/50 border-gray-700 hover:border-blue-800/50 transition-colors backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          resource.category === "video" && "bg-red-800/30",
                          resource.category === "link" && "bg-blue-800/30",
                          resource.category === "document" && "bg-green-800/30",
                          resource.category === "audio" && "bg-purple-800/30",
                          resource.category === "image" && "bg-orange-800/30"
                        )}>
                          {resource.category === "video" && <Users className="h-5 w-5 text-red-300" />}
                          {resource.category === "link" && <Target className="h-5 w-5 text-blue-300" />}
                          {resource.category === "document" && <FileText className="h-5 w-5 text-green-300" />}
                          {resource.category === "audio" && <Zap className="h-5 w-5 text-purple-300" />}
                          {resource.category === "image" && <FileText className="h-5 w-5 text-orange-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">{resource.title}</h3>
                          <p className="text-sm text-gray-400 truncate">{resource.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge 
                              className={cn(
                                "text-xs",
                                resource.priority === "high" && "bg-red-500/20 text-red-400 border-red-500/30",
                                resource.priority === "medium" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                                resource.priority === "low" && "bg-green-500/20 text-green-400 border-green-500/30"
                              )}
                            >
                              {resource.priority}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="text-xs border-gray-600 text-gray-400"
                            >
                              {resource.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{resource.addedBy}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-blue-800/30 hover:text-blue-300 text-gray-400">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )

      case "feedback":
        return (
          <div className="p-6 space-y-6 bg-[#000917]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Feedback</h2>
                <p className="text-gray-300">Share your thoughts, suggestions, and report issues</p>
              </div>
              <Button 
                onClick={() => setShowAddFeedback(true)}
                className="bg-blue-800 hover:bg-blue-900 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feedback
              </Button>
            </div>

            {showAddFeedback && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Add New Feedback</CardTitle>
                  <CardDescription className="text-gray-300">Share your feedback with the team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="feedback-title" className="text-white">Feedback Title</Label>
                    <Input
                      id="feedback-title"
                      value={newFeedback.title}
                      onChange={(e) => setNewFeedback({...newFeedback, title: e.target.value})}
                      placeholder="Enter feedback title..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="feedback-message" className="text-white">Message</Label>
                    <Textarea
                      id="feedback-message"
                      value={newFeedback.message}
                      onChange={(e) => setNewFeedback({...newFeedback, message: e.target.value})}
                      placeholder="Describe your feedback in detail..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 focus:ring-0 focus:outline-none"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="feedback-type" className="text-white">Feedback Type</Label>
                      <Select value={newFeedback.type} onValueChange={(value: "suggestion" | "bug" | "feature" | "complaint" | "praise") => setNewFeedback({...newFeedback, type: value})}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="suggestion" className="text-white hover:bg-gray-700">Suggestion</SelectItem>
                          <SelectItem value="bug" className="text-white hover:bg-gray-700">Bug Report</SelectItem>
                          <SelectItem value="feature" className="text-white hover:bg-gray-700">Feature Request</SelectItem>
                          <SelectItem value="complaint" className="text-white hover:bg-gray-700">Complaint</SelectItem>
                          <SelectItem value="praise" className="text-white hover:bg-gray-700">Praise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="feedback-priority" className="text-white">Priority</Label>
                      <Select value={newFeedback.priority} onValueChange={(value: "low" | "medium" | "high") => setNewFeedback({...newFeedback, priority: value})}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300 focus:ring-0 focus:outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                          <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                          <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous-feedback"
                      checked={newFeedback.isAnonymous}
                      onChange={(e) => setNewFeedback({...newFeedback, isAnonymous: e.target.checked})}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <Label htmlFor="anonymous-feedback" className="text-white text-sm">
                      Submit anonymously
                    </Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleAddFeedback}
                      className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                      Submit Feedback
                    </Button>
                    <Button 
                      onClick={() => setShowAddFeedback(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feedback List */}
            <div className="space-y-4">
              {feedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No feedback submitted yet.</p>
                </div>
              ) : (
                feedbacks
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(feedback => (
                    <Card key={feedback.id} className="bg-gray-800/50 border-gray-700 hover:border-blue-800/50 transition-colors backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                            feedback.type === "suggestion" && "bg-blue-800/30",
                            feedback.type === "bug" && "bg-red-800/30",
                            feedback.type === "feature" && "bg-green-800/30",
                            feedback.type === "complaint" && "bg-orange-800/30",
                            feedback.type === "praise" && "bg-purple-800/30"
                          )}>
                            {feedback.type === "suggestion" && <Target className="h-5 w-5 text-blue-300" />}
                            {feedback.type === "bug" && <AlertCircle className="h-5 w-5 text-red-300" />}
                            {feedback.type === "feature" && <Plus className="h-5 w-5 text-green-300" />}
                            {feedback.type === "complaint" && <AlertCircle className="h-5 w-5 text-orange-300" />}
                            {feedback.type === "praise" && <CheckCircle className="h-5 w-5 text-purple-300" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-white truncate">{feedback.title}</h3>
                              <Badge 
                                className={cn(
                                  "text-xs",
                                  feedback.status === "open" && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                                  feedback.status === "in-progress" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                                  feedback.status === "resolved" && "bg-green-500/20 text-green-400 border-green-500/30",
                                  feedback.status === "closed" && "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                )}
                              >
                                {feedback.status === "open" ? "Open" : 
                                 feedback.status === "in-progress" ? "In Progress" : 
                                 feedback.status === "resolved" ? "Resolved" : "Closed"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300 mb-3">{feedback.message}</p>
                            <div className="flex items-center space-x-3">
                              <Badge 
                                className={cn(
                                  "text-xs",
                                  feedback.priority === "high" && "bg-red-500/20 text-red-400 border-red-500/30",
                                  feedback.priority === "medium" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                                  feedback.priority === "low" && "bg-green-500/20 text-green-400 border-green-500/30"
                                )}
                              >
                                {feedback.priority} priority
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className="text-xs border-gray-600 text-gray-400"
                              >
                                {feedback.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {feedback.isAnonymous ? "Anonymous" : feedback.author} • {new Date(feedback.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="p-6 bg-[#000917]">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2 text-white">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h2>
              <p className="text-gray-400">This section is coming soon!</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#000917] flex">
      <DashboardSidebar />
      <PodSidebar podData={podData} activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col">
        {/* Pod Header */}
        <header className="border-b border-gray-700 p-4 bg-[#000917]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-800/30 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{podData.name}</h1>
                <p className="text-sm text-gray-300">{podData.description}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              {podData.members.filter((m) => m.status === "online").length} online
            </Badge>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-hidden">{renderContent()}</main>

          {/* Members Panel - moved to the right */}
          <div className="w-64 border-l border-gray-700 bg-gray-800/30">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-white">Members ({podData.members.length})</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-blue-800/30 hover:text-blue-300 text-gray-400">
                  <UserPlus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {podData.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-800/30 cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#000917]",
                          member.status === "online"
                            ? "bg-green-500"
                            : member.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-500",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">{member.name}</p>
                      <p className="text-xs text-gray-400 truncate">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-400 hover:bg-blue-800/30 hover:text-blue-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                Pod Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
