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
import { DashboardSidebar } from "@/components/dashboard-sidebar"
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
        revenue: "$200K MRR",
        funding: "$2M raised",
        team: "15 people",
      },
      isFollowing: true,
      lastActivity: "1 day ago",
    },
    {
      id: 3,
      name: "FinanceFlow",
      description: "Modern financial management tools for small businesses and freelancers with AI-powered insights.",
      industry: "FinTech",
      stage: "MVP",
      members: 5,
      users: 123,
      location: "Austin, TX",
      founded: "2024",
      privacy: "private" as const,
      badges: ["FinTech", "SaaS", "SMB"],
      founder: {
        name: "Mike Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        title: "Founder & CTO",
      },
      metrics: {
        revenue: "Pre-revenue",
        funding: "Bootstrapped",
        team: "5 people",
      },
      isFollowing: false,
      lastActivity: "3 hours ago",
    },
    {
      id: 4,
      name: "EduConnect",
      description:
        "Connecting students with mentors and industry professionals for career guidance and skill development.",
      industry: "EdTech",
      stage: "Growth",
      members: 12,
      users: 445,
      location: "New York, NY",
      founded: "2022",
      privacy: "semi-public" as const,
      badges: ["EdTech", "Marketplace", "B2C"],
      founder: {
        name: "Jennifer Liu",
        avatar: "/placeholder.svg?height=32&width=32",
        title: "CEO",
      },
      metrics: {
        revenue: "$100K MRR",
        funding: "$1.5M raised",
        team: "12 people",
      },
      isFollowing: false,
      lastActivity: "5 hours ago",
    },
    {
      id: 5,
      name: "RetailTech Innovations",
      description: "Next-generation retail analytics and inventory management powered by computer vision and IoT.",
      industry: "RetailTech",
      stage: "Seed",
      members: 10,
      users: 189,
      location: "Seattle, WA",
      founded: "2024",
      privacy: "semi-public" as const,
      badges: ["Computer Vision", "IoT", "B2B"],
      founder: {
        name: "David Park",
        avatar: "/placeholder.svg?height=32&width=32",
        title: "Founder",
      },
      metrics: {
        revenue: "$25K MRR",
        funding: "Seed round",
        team: "10 people",
      },
      isFollowing: false,
      lastActivity: "1 hour ago",
    },
    {
      id: 6,
      name: "SpaceLogistics",
      description: "Developing autonomous systems for space cargo delivery and orbital manufacturing operations.",
      industry: "SpaceTech",
      stage: "Series A",
      members: 25,
      users: 892,
      location: "Los Angeles, CA",
      founded: "2021",
      privacy: "semi-public" as const,
      badges: ["SpaceTech", "Robotics", "Deep Tech"],
      founder: {
        name: "Captain Maria Santos",
        avatar: "/placeholder.svg?height=32&width=32",
        title: "CEO & Founder",
      },
      metrics: {
        revenue: "Contract-based",
        funding: "$5M raised",
        team: "25 people",
      },
      isFollowing: true,
      lastActivity: "30 minutes ago",
    },
  ]

  const industries = ["all", "CleanTech", "HealthTech", "FinTech", "EdTech", "RetailTech", "SpaceTech"]
  const stages = ["all", "MVP", "Pre-Seed", "Seed", "Series A", "Growth"]

  const filteredPods = pods.filter((pod) => {
    const matchesSearch =
      pod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pod.industry.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = selectedIndustry === "all" || pod.industry === selectedIndustry
    const matchesStage = selectedStage === "all" || pod.stage === selectedStage
    return matchesSearch && matchesIndustry && matchesStage
  })

  const handleFollow = (podId: number) => {
    // Handle follow/unfollow logic
    console.log("Toggle follow for pod:", podId)
  }

  const handleRequestJoin = (podId: number) => {
    // Handle join request logic
    console.log("Request to join pod:", podId)
  }

  return (
    <div className="min-h-screen bg-[#000917] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-700 p-6 bg-[#000917]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center text-white">
                <Globe className="h-8 w-8 mr-3 text-blue-400" />
                Explore Pods
              </h1>
              <p className="text-gray-300">Discover and connect with innovative startups and teams</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                {filteredPods.length} Pods
              </Badge>
              <Button 
                onClick={() => setShowShowcaseModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Showcase Pod
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </Button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="p-6 bg-[#000917]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pods, industries, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-0 focus:outline-none"
              />
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry} className="text-white hover:bg-gray-700">
                    {industry === "all" ? "All Industries" : industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage} className="text-white hover:bg-gray-700">
                    {stage === "all" ? "All Stages" : stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 bg-[#000917]">
          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPods.map((pod) => (
                <Card key={pod.id} className="hover:shadow-lg transition-shadow bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white">{pod.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {pod.industry}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-blue-600/20 text-blue-400 border-blue-600/30">
                              {pod.stage}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFollow(pod.id)}
                        className={pod.isFollowing ? "text-red-500" : "text-gray-400 hover:text-white"}
                      >
                        <Heart className={`h-4 w-4 ${pod.isFollowing ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                    <CardDescription className="text-sm leading-relaxed text-gray-300">{pod.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-1">
                        {pod.badges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs bg-gray-700/50 text-gray-300 border-gray-600">
                            {badge}
                          </Badge>
                        ))}
                      </div>

                      {/* Founder */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={pod.founder.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gray-700 text-white">
                            {pod.founder.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">{pod.founder.name}</p>
                          <p className="text-xs text-gray-400">{pod.founder.title}</p>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">{pod.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">Founded {pod.founded}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">{pod.members} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">{pod.users} users</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleRequestJoin(pod.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Request to Join
                        </Button>
                        <Button variant="outline" size="sm" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPods.map((pod) => (
                <Card key={pod.id} className="hover:shadow-md transition-shadow bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-8 w-8 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-white">{pod.name}</h3>
                            <div className="flex items-center space-x-2 mt-1 mb-2">
                              <Badge variant="outline" className="border-gray-600 text-gray-300">{pod.industry}</Badge>
                              <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30">{pod.stage}</Badge>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-400">{pod.location}</span>
                            </div>
                            <p className="text-gray-300 mb-3">{pod.description}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {pod.badges.map((badge) => (
                                <Badge key={badge} variant="secondary" className="text-xs bg-gray-700/50 text-gray-300 border-gray-600">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleFollow(pod.id)}
                            className={pod.isFollowing ? "text-red-500" : "text-gray-400 hover:text-white"}
                          >
                            <Heart className={`h-4 w-4 ${pod.isFollowing ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{pod.members} members</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{pod.followers} followers</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{pod.metrics.revenue}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleRequestJoin(pod.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Request to Join
                            </Button>
                            <Button variant="outline" size="sm" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredPods.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">No pods found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </main>
      </div>

      {/* Showcase Modal */}
      {showShowcaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#000917] border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Showcase Your Pod</h2>
                  <p className="text-sm text-gray-300">Add your pod to the explore page for others to discover</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowShowcaseModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="select-pod" className="text-white">Select Pod *</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                      <SelectValue placeholder="Choose a pod to showcase" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="trice" className="text-white hover:bg-gray-700">Trice</SelectItem>
                      <SelectItem value="zyroz" className="text-white hover:bg-gray-700">Zyroz</SelectItem>
                      <SelectItem value="deeproot" className="text-white hover:bg-gray-700">DeepRoot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-white">Industry *</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="CleanTech" className="text-white hover:bg-gray-700">CleanTech</SelectItem>
                        <SelectItem value="HealthTech" className="text-white hover:bg-gray-700">HealthTech</SelectItem>
                        <SelectItem value="FinTech" className="text-white hover:bg-gray-700">FinTech</SelectItem>
                        <SelectItem value="EdTech" className="text-white hover:bg-gray-700">EdTech</SelectItem>
                        <SelectItem value="RetailTech" className="text-white hover:bg-gray-700">RetailTech</SelectItem>
                        <SelectItem value="SpaceTech" className="text-white hover:bg-gray-700">SpaceTech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your pod is about..."
                    rows={3}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-0 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded" className="text-white">Founded Date *</Label>
                    <Input
                      id="founded"
                      type="date"
                      className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-400 focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="members" className="text-white">Team Members *</Label>
                    <Input
                      id="members"
                      type="number"
                      placeholder="Number of team members"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage" className="text-white">Stage *</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="MVP" className="text-white hover:bg-gray-700">MVP</SelectItem>
                        <SelectItem value="Pre-Seed" className="text-white hover:bg-gray-700">Pre-Seed</SelectItem>
                        <SelectItem value="Seed" className="text-white hover:bg-gray-700">Seed</SelectItem>
                        <SelectItem value="Series A" className="text-white hover:bg-gray-700">Series A</SelectItem>
                        <SelectItem value="Growth" className="text-white hover:bg-gray-700">Growth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categories" className="text-white">Categories/Tags</Label>
                  <Input
                    id="categories"
                    placeholder="e.g., AI/ML, B2B, SaaS (comma separated)"
                    className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-0 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowShowcaseModal(false)}
                    className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Showcase Pod
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
