"use client"

import { useState } from "react"
import { Search, Plus, Mail, UserPlus, MapPin, Briefcase, Users, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProtectedRoute } from "@/components/protected-route"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const startups = [
  {
    id: "1",
    name: "NeuralFlow AI",
    tagline: "Next-gen machine learning platform for enterprises",
    category: "AI/ML",
    location: "San Francisco, CA",
    members: 12,
    funding: "Series A",
    avatar: "/neural-flow-logo.png",
    email: "contact@neuralflow.ai",
    positions: ["Full-stack Developer", "ML Engineer", "Product Designer"],
  },
  {
    id: "2",
    name: "EcoTrack",
    tagline: "Sustainability tracking for modern businesses",
    category: "Climate Tech",
    location: "Seattle, WA",
    members: 8,
    funding: "Seed",
    avatar: "/ecotrack-logo.png",
    email: "hello@ecotrack.com",
    positions: ["Backend Developer", "Marketing Manager"],
  },
  {
    id: "3",
    name: "FinFlow",
    tagline: "Modern financial management for small businesses",
    category: "Fintech",
    location: "Chicago, IL",
    members: 15,
    funding: "Series B",
    avatar: "/finflow-logo.png",
    email: "team@finflow.io",
    positions: ["Frontend Developer", "Sales Lead", "Customer Success"],
  },
]

const userPods = [
  { id: "1", name: "AI Venture", icon: "🤖", members: 5 },
  { id: "2", name: "EcoSolutions", icon: "🌱", members: 3 },
  { id: "3", name: "FinTech Pro", icon: "💰", members: 7 },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStartup, setSelectedStartup] = useState<(typeof startups)[0] | null>(null)
  const [showcaseOpen, setShowcaseOpen] = useState(false)
  const [requestJoinOpen, setRequestJoinOpen] = useState(false)
  const [selectedPod, setSelectedPod] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const filteredStartups = startups.filter((startup) => {
    const matchesSearch =
      searchQuery === "" ||
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handlePodSelect = (podId: string) => {
    setSelectedPod(podId)
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-balance">Explore Startups</h1>
            <p className="text-sm text-muted-foreground">Discover innovative startups and opportunities</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={showcaseOpen} onOpenChange={setShowcaseOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Showcase Your Startup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Showcase Your Startup</DialogTitle>
                  <DialogDescription>Share your startup with the WACE community</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Stage 1: Select Pod */}
                  <div className="space-y-3">
                    <Label>Select Pod</Label>
                    <Select value={selectedPod} onValueChange={handlePodSelect}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Choose a pod to showcase" />
                      </SelectTrigger>
                      <SelectContent>
                        {userPods.map((pod) => (
                          <SelectItem key={pod.id} value={pod.id}>
                            <div className="flex items-center gap-2">
                              <span>{pod.icon}</span>
                              <span>{pod.name}</span>
                              <span className="text-muted-foreground text-sm">({pod.members} members)</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPod && (
                    <>
                      {/* Auto-filled from pod */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Startup Name</Label>
                          <Input
                            defaultValue={userPods.find((p) => p.id === selectedPod)?.name}
                            className="rounded-xl"
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Input
                            defaultValue={userPods.find((p) => p.id === selectedPod)?.icon}
                            className="rounded-xl"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tagline</Label>
                        <Input placeholder="Brief description of your startup" className="rounded-xl" />
                      </div>

                      {/* Stage 2: Startup Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Startup Type</Label>
                          <Select>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="saas">SaaS</SelectItem>
                              <SelectItem value="marketplace">Marketplace</SelectItem>
                              <SelectItem value="fintech">Fintech</SelectItem>
                              <SelectItem value="healthtech">Healthtech</SelectItem>
                              <SelectItem value="edtech">Edtech</SelectItem>
                              <SelectItem value="ai">AI/ML</SelectItem>
                              <SelectItem value="climate">Climate Tech</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input placeholder="City, Country" className="rounded-xl" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Funding Stage</Label>
                          <Select>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pre-seed">Pre-seed</SelectItem>
                              <SelectItem value="seed">Seed</SelectItem>
                              <SelectItem value="series-a">Series A</SelectItem>
                              <SelectItem value="series-b">Series B</SelectItem>
                              <SelectItem value="series-c">Series C+</SelectItem>
                              <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Team Size</Label>
                          <Input
                            type="number"
                            defaultValue={userPods.find((p) => p.id === selectedPod)?.members}
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Positions Looking For</Label>
                        <Textarea
                          placeholder="e.g., Full-stack Developer, Product Designer, Marketing Manager"
                          className="rounded-xl min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Contact Email</Label>
                        <Input type="email" placeholder="contact@startup.com" className="rounded-xl" />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button className="flex-1 rounded-xl bg-primary hover:bg-primary/90">Publish Startup</Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl bg-transparent"
                          onClick={() => setShowcaseOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search startups by name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-2xl border-border text-base"
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredStartups.map((startup) => (
            <Card
              key={startup.id}
              className="rounded-2xl border-border hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setSelectedStartup(startup)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 rounded-2xl border-2 border-border group-hover:border-primary transition-all">
                    <AvatarImage src={startup.avatar || "/placeholder.svg"} alt={startup.name} />
                    <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary/20 to-[oklch(0.6_0.2_290)]/20 text-primary text-lg">
                      {startup.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg leading-tight mb-2">{startup.name}</h3>
                    <Badge variant="secondary" className="rounded-lg">
                      {startup.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-pretty line-clamp-2">{startup.tagline}</p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-lg">
                    <MapPin className="w-3 h-3 mr-1" />
                    {startup.location}
                  </Badge>
                  <Badge variant="outline" className="rounded-lg">
                    <Users className="w-3 h-3 mr-1" />
                    {startup.members} members
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Badge className="rounded-lg bg-gradient-to-r from-primary to-[oklch(0.6_0.2_290)] text-white">
                    {startup.funding}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{startup.positions.length} positions</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="rounded-xl bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.location.href = `mailto:${startup.email}`
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button
                    className="rounded-xl bg-primary hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedStartup(startup)
                      setRequestJoinOpen(true)
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStartups.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No startups found. Try adjusting your search.</p>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedStartup && !requestJoinOpen} onOpenChange={(open) => !open && setSelectedStartup(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selectedStartup && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-20 h-20 rounded-2xl border-2 border-primary">
                    <AvatarImage src={selectedStartup.avatar || "/placeholder.svg"} alt={selectedStartup.name} />
                    <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary/20 to-[oklch(0.6_0.2_290)]/20 text-primary text-xl">
                      {selectedStartup.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle className="text-2xl">{selectedStartup.name}</SheetTitle>
                    <SheetDescription className="text-base mt-2">{selectedStartup.tagline}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <Badge variant="outline" className="rounded-lg">
                        {selectedStartup.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Location</span>
                      <span className="text-sm font-medium">{selectedStartup.location}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Team Size</span>
                      <span className="text-sm font-medium">{selectedStartup.members} members</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Funding Stage</span>
                      <Badge className="rounded-lg bg-gradient-to-r from-primary to-[oklch(0.6_0.2_290)] text-white">
                        {selectedStartup.funding}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Open Positions</h4>
                  <div className="space-y-2">
                    {selectedStartup.positions.map((position, index) => (
                      <div key={index} className="p-3 rounded-xl bg-muted/50 text-sm">
                        {position}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl bg-transparent"
                    onClick={() => (window.location.href = `mailto:${selectedStartup.email}`)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Get in Contact
                  </Button>
                  <Button
                    className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
                    onClick={() => setRequestJoinOpen(true)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Request to Join
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={requestJoinOpen} onOpenChange={setRequestJoinOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request to Join {selectedStartup?.name}</DialogTitle>
            <DialogDescription>Submit your application to join this startup</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Position</Label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {selectedStartup?.positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cover Letter</Label>
              <Textarea placeholder="Tell them why you'd be a great fit..." className="rounded-xl min-h-[120px]" />
            </div>

            <div className="space-y-2">
              <Label>Resume / CV</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="resume-upload"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium">{resumeFile.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          setResumeFile(null)
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX (max 5MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1 rounded-xl bg-primary hover:bg-primary/90">Submit Application</Button>
              <Button
                variant="outline"
                className="flex-1 rounded-xl bg-transparent"
                onClick={() => setRequestJoinOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  )
}
