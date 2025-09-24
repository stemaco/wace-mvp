"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ArrowLeft, Heart, Users, MapPin, Calendar, Share, Flag, Briefcase, Globe, Star } from "lucide-react"
import Link from "next/link"

export default function PodDetailPage() {
  const [isFollowing, setIsFollowing] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinMessage, setJoinMessage] = useState("")

  const pod = {
    id: 1,
    name: "EcoTech Solutions",
    description:
      "Building sustainable technology solutions for climate change mitigation and environmental monitoring.",
    longDescription: `EcoTech Solutions is at the forefront of environmental technology, developing cutting-edge solutions to combat climate change and monitor environmental health. Our team combines expertise in IoT, AI, and environmental science to create products that make a real difference.

Our flagship product is an AI-powered environmental monitoring system that helps cities and organizations track air quality, water pollution, and energy consumption in real-time. We're currently working with 15 pilot customers across North America and Europe.

We're looking for passionate individuals who want to make a positive impact on the world while building a successful business. Join us in our mission to create a more sustainable future.`,
    industry: "CleanTech",
    stage: "Seed",
    members: 8,
    followers: 234,
    location: "San Francisco, CA",
    founded: "2024",
    privacy: "public" as const,
    badges: ["AI-Powered", "B2B", "Hardware", "Sustainability"],
    founder: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=64&width=64",
      title: "CEO & Founder",
      bio: "Former Tesla engineer with 10+ years in clean energy. MIT graduate with passion for environmental technology.",
    },
    team: [
      {
        id: 1,
        name: "Alex Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "CEO & Founder",
        expertise: "Clean Energy, IoT",
      },
      {
        id: 2,
        name: "Dr. Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "CTO",
        expertise: "AI/ML, Environmental Science",
      },
      {
        id: 3,
        name: "James Park",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Head of Product",
        expertise: "Product Strategy, UX",
      },
      {
        id: 4,
        name: "Lisa Zhang",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Lead Engineer",
        expertise: "Hardware, Embedded Systems",
      },
    ],
    metrics: {
      revenue: "$50K MRR",
      funding: "Pre-Seed ($500K)",
      customers: "15 pilot customers",
      growth: "+25% MoM",
    },
    achievements: [
      "Winner of CleanTech Innovation Award 2024",
      "Featured in TechCrunch Disrupt",
      "Partnership with 3 major cities",
      "Patent pending on core technology",
    ],
    lookingFor: [
      "Full-stack developers with IoT experience",
      "Sales professionals with B2B SaaS background",
      "Environmental scientists and researchers",
      "Marketing specialists in CleanTech space",
    ],
    lastActivity: "2 hours ago",
  }

  const handleJoinRequest = () => {
    // Handle join request logic
    console.log("Join request sent:", joinMessage)
    setShowJoinModal(false)
    setJoinMessage("")
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/explore">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Pod Details</h1>
              <p className="text-muted-foreground">Learn more about this startup</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Pod Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-10 w-10 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{pod.name}</h1>
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant="outline" className="text-sm">
                            {pod.industry}
                          </Badge>
                          <Badge variant="secondary" className="text-sm">
                            {pod.stage}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={
                              pod.privacy === "public"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-blue-500/20 text-blue-400"
                            }
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            {pod.privacy}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{pod.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{pod.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Founded {pod.founded}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{pod.members} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{pod.followers} followers</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsFollowing(!isFollowing)}
                          className={isFollowing ? "text-red-500 border-red-500" : ""}
                        >
                          <Heart className={`h-4 w-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
                          {isFollowing ? "Following" : "Follow"}
                        </Button>
                        <Button onClick={() => setShowJoinModal(true)} className="bg-primary hover:bg-primary/90">
                          Request to Join
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {pod.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="whitespace-pre-line text-muted-foreground">{pod.longDescription}</div>
                      <div className="flex flex-wrap gap-2">
                        {pod.badges.map((badge) => (
                          <Badge key={badge} variant="secondary">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team */}
                <Card>
                  <CardHeader>
                    <CardTitle>Meet the Team</CardTitle>
                    <CardDescription>Key members of {pod.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pod.team.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center space-x-3 p-3 border border-border rounded-lg"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                            <p className="text-xs text-muted-foreground">{member.expertise}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements & Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pod.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          <span className="text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="font-medium">{pod.metrics.revenue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Funding</span>
                      <span className="font-medium">{pod.metrics.funding}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Customers</span>
                      <span className="font-medium">{pod.metrics.customers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Growth</span>
                      <span className="font-medium text-green-500">{pod.metrics.growth}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Looking For */}
                <Card>
                  <CardHeader>
                    <CardTitle>We're Looking For</CardTitle>
                    <CardDescription>Roles and expertise needed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pod.lookingFor.map((role, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{role}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Founder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Founder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={pod.founder.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {pod.founder.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{pod.founder.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{pod.founder.title}</p>
                        <p className="text-xs text-muted-foreground">{pod.founder.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Request to Join {pod.name}</CardTitle>
              <CardDescription>Tell them why you'd like to join their Pod</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Hi! I'm interested in joining your Pod because..."
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={handleJoinRequest} className="flex-1 bg-primary hover:bg-primary/90">
                  Send Request
                </Button>
                <Button variant="outline" onClick={() => setShowJoinModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
