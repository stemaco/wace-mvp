"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NotionSidebar } from "@/components/notion-sidebar"
import {
  Search,
  Filter,
  Users,
  TrendingUp,
  Globe,
  Eye,
  Heart,
  MessageSquare,
  MapPin,
  Calendar,
  Briefcase,
  Plus,
  X,
} from "lucide-react"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [selectedStage, setSelectedStage] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showShowcaseModal, setShowShowcaseModal] = useState(false)

  const pods = [
    {
      id: 1,
      name: "EcoTech Solutions",
      description:
        "Building sustainable technology solutions for climate change mitigation and environmental monitoring.",
      industry: "CleanTech",
      stage: "Seed",
      members: 8,
      users: 234,
      location: "San Francisco, CA",
      founded: "2024",
      privacy: "semi-public" as const,
      badges: ["AI-Powered", "B2B", "Hardware"],
      founder: {
        name: "Alex Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        title: "CEO & Founder",
      },
      metrics: {
        revenue: "$50K MRR",
        funding: "Pre-Seed",
        team: "8 people",
      },
      isFollowing: false,
      lastActivity: "2 hours ago",
    },
    {
      id: 2,
      name: "HealthAI Platform",
      description: "AI-driven healthcare diagnostics platform helping doctors make faster, more accurate diagnoses.",
      industry: "HealthTech",
      stage: "Series A",
      members: 15,
      users: 567,
      location: "Boston, MA",
      founded: "2023",
      privacy: "semi-public" as const,
      badges: ["AI/ML", "Healthcare", "B2B"],
      founder: {
        name: "Dr. Sarah Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        title: "Chief Medical Officer",
      },
      metrics: {
        revenue: "$250K MRR",
        funding: "$5M raised",
        team: "15 people",
      },
      isFollowing: true,
      lastActivity: "1 day ago",
    },
    {
      id: 3,
      name: "EdTech Revolution",
      description: "Personalized learning platform using AI to adapt to each student's learning style and pace.",
      industry: "Education",
      stage: "Seed",
      members: 6,
      users: 890,
      location: "Austin, TX",
      founded: "2024",
      privacy: "semi-public" as const,
      badges: ["EdTech", "AI", "B2C"],
      founder: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        title: "Founder",
      },
      metrics: {
        revenue: "$30K MRR",
        funding: "Bootstrapped",
        team: "6 people",
      },
      isFollowing: false,
      lastActivity: "5 hours ago",
    },
  ]

  const filteredPods = pods.filter((pod) => {
    const matchesSearch = pod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pod.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = selectedIndustry === "all" || pod.industry === selectedIndustry
    const matchesStage = selectedStage === "all" || pod.stage === selectedStage
    return matchesSearch && matchesIndustry && matchesStage
  })

  return (
    <div className="relative h-screen bg-background overflow-hidden">
      <NotionSidebar />

      <div className="absolute inset-0 flex flex-col pl-[268px]">
        <div className="relative glass-card rounded-l-3xl border-l border-border/50 h-full">
          {/* Header */}
          <header className="border-b border-border px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center text-foreground">
                  <Globe className="h-8 w-8 mr-3 text-muted-foreground" />
                  Explore Pods
                </h1>
                <p className="text-muted-foreground">Discover and join amazing communities</p>
              </div>
              <Button onClick={() => setShowShowcaseModal(true)} className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Showcase Your Pod
              </Button>
            </div>
          </header>

          {/* Search and Filters */}
          <div className="px-8 py-4 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pods by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl glass-button"
                />
              </div>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-[180px] rounded-xl glass-button">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="CleanTech">CleanTech</SelectItem>
                  <SelectItem value="HealthTech">HealthTech</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="FinTech">FinTech</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger className="w-[180px] rounded-xl glass-button">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Series A">Series A</SelectItem>
                  <SelectItem value="Series B">Series B</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-xl"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="1" width="6" height="6" stroke="currentColor" />
                    <rect x="9" y="1" width="6" height="6" stroke="currentColor" />
                    <rect x="1" y="9" width="6" height="6" stroke="currentColor" />
                    <rect x="9" y="9" width="6" height="6" stroke="currentColor" />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-xl"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <line x1="1" y1="3" x2="15" y2="3" stroke="currentColor" />
                    <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" />
                    <line x1="1" y1="13" x2="15" y2="13" stroke="currentColor" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <main className="flex-1 px-8 py-6 overflow-auto">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card className="glass-card rounded-2xl border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Pods</p>
                      <p className="text-2xl font-bold text-foreground">1,234</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card rounded-2xl border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Members</p>
                      <p className="text-2xl font-bold text-foreground">45,678</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card rounded-2xl border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">New This Week</p>
                      <p className="text-2xl font-bold text-foreground">89</p>
                    </div>
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card rounded-2xl border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Industries</p>
                      <p className="text-2xl font-bold text-foreground">24</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pods Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-5"}>
              {filteredPods.map((pod) => (
                <Card key={pod.id} className="glass-card rounded-2xl border-border/50 transition-all hover:scale-[1.02] relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={pod.founder.avatar} />
                          <AvatarFallback className="bg-primary/10 text-foreground">
                            {pod.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg text-foreground">{pod.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {pod.industry}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {pod.stage}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={pod.isFollowing ? "default" : "outline"}
                        size="sm"
                        className="rounded-xl"
                      >
                        {pod.isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{pod.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pod.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Revenue</p>
                        <p className="font-medium text-foreground">{pod.metrics.revenue}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Funding</p>
                        <p className="font-medium text-foreground">{pod.metrics.funding}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Team</p>
                        <p className="font-medium text-foreground">{pod.metrics.team}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {pod.members} members
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {pod.location}
                        </span>
                      </div>
                      <span className="text-xs">{pod.lastActivity}</span>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={pod.founder.avatar} />
                          <AvatarFallback className="text-xs">
                            {pod.founder.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-xs">
                          <p className="font-medium text-foreground">{pod.founder.name}</p>
                          <p className="text-muted-foreground">{pod.founder.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="rounded-xl h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-xl h-8 w-8 p-0">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-xl h-8 w-8 p-0">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPods.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pods found matching your criteria</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Showcase Modal */}
      {showShowcaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(100px) saturate(300%)', WebkitBackdropFilter: 'blur(100px) saturate(300%)' }}>
          <div className="w-full max-w-md glass-strong rounded-[32px] shadow-2xl relative overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Showcase Your Pod</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowShowcaseModal(false)}
                  className="rounded-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="podName" className="text-foreground">Pod Name</Label>
                  <Input id="podName" placeholder="Enter your pod name" className="rounded-xl glass-button" />
                </div>
                <div>
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your pod..."
                    rows={3}
                    className="rounded-xl glass-button"
                  />
                </div>
                <div>
                  <Label htmlFor="industry" className="text-foreground">Industry</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl glass-button">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleantech">CleanTech</SelectItem>
                      <SelectItem value="healthtech">HealthTech</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="fintech">FinTech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowShowcaseModal(false)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button onClick={() => setShowShowcaseModal(false)} className="rounded-xl">
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}