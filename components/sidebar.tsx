"use client"

import { Home, Compass, Plus, ShoppingBag, Settings, Bot, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

const topNavItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Bot, label: "AI Assistant", href: "/ai" },
  { icon: Compass, label: "Explore", href: "/explore" },
]

const bottomNavItems = [
  { icon: ShoppingBag, label: "Shop", href: "/shop" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

// Mock pod data
const pods = [
  { id: "1", name: "TechStartup", avatar: "/tech-startup-logo.png" },
  { id: "2", name: "DesignCo", avatar: "/generic-company-logo.png" },
  { id: "3", name: "AIVenture", avatar: "/ai-venture-logo.jpg" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [showCreatePodModal, setShowCreatePodModal] = useState(false)
  const [createPodStage, setCreatePodStage] = useState(1)
  const [podName, setPodName] = useState("")
  const [podDescription, setPodDescription] = useState("")
  const [podIcon, setPodIcon] = useState("")
  const [podPrivacy, setPodPrivacy] = useState("private")

  const handleCreatePod = () => {
    if (createPodStage < 3) {
      setCreatePodStage(createPodStage + 1)
    } else {
      // Final submission
      setShowCreatePodModal(false)
      setCreatePodStage(1)
      setPodName("")
      setPodDescription("")
      setPodIcon("")
      setPodPrivacy("private")
    }
  }

  const handleBack = () => {
    if (createPodStage > 1) {
      setCreatePodStage(createPodStage - 1)
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed left-0 top-0 z-40 h-screen w-16 flex flex-col items-center bg-sidebar border-r border-sidebar-border py-4 gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="mb-2">
          <Image src="/wace.png" alt="WACE" width={40} height={40} className="rounded-xl" />
        </Link>

        {/* Top Navigation */}
        <nav className="flex flex-col gap-2">
          {topNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "w-10 h-10 rounded-xl transition-all",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={() => setShowCreatePodModal(true)}
              className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Create Pod</p>
          </TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-8 h-px bg-sidebar-border my-2" />

        {/* Pods Section */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
          {pods.map((pod) => (
            <Tooltip key={pod.id}>
              <TooltipTrigger asChild>
                <Link href={`/pod/${pod.id}`}>
                  <Avatar className="w-10 h-10 rounded-xl cursor-pointer hover:rounded-2xl transition-all hover:scale-110">
                    <AvatarImage src={pod.avatar || "/placeholder.svg"} alt={pod.name} />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-[oklch(0.6_0.2_290)]/20 text-primary">
                      {pod.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{pod.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Bottom Navigation */}
        <nav className="flex flex-col gap-2 mt-auto">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "w-10 h-10 rounded-xl transition-all",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
          
          {/* Logout Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="w-10 h-10 rounded-xl transition-all text-sidebar-foreground hover:bg-red-500/10 hover:text-red-500"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>

      <Dialog open={showCreatePodModal} onOpenChange={setShowCreatePodModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create New Pod - Stage {createPodStage} of 3</DialogTitle>
            <DialogDescription>
              {createPodStage === 1 && "Let's start with the basics"}
              {createPodStage === 2 && "Choose your pod's privacy settings"}
              {createPodStage === 3 && "Help Jinx understand your startup"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Stage 1: Basic Info */}
            {createPodStage === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pod-name">Pod Name</Label>
                  <Input
                    id="pod-name"
                    value={podName}
                    onChange={(e) => setPodName(e.target.value)}
                    placeholder="e.g., TechStartup"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pod-description">Description</Label>
                  <Textarea
                    id="pod-description"
                    value={podDescription}
                    onChange={(e) => setPodDescription(e.target.value)}
                    placeholder="Brief description of your startup..."
                    className="rounded-xl"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pod-icon">Icon (emoji or URL)</Label>
                  <Input
                    id="pod-icon"
                    value={podIcon}
                    onChange={(e) => setPodIcon(e.target.value)}
                    placeholder="🚀 or image URL"
                    className="rounded-xl"
                  />
                </div>
              </>
            )}

            {/* Stage 2: Privacy */}
            {createPodStage === 2 && (
              <div className="space-y-4">
                <Label>Privacy Method</Label>
                <RadioGroup value={podPrivacy} onValueChange={setPodPrivacy} className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="flex-1 cursor-pointer">
                      <div className="font-medium">Private</div>
                      <div className="text-sm text-muted-foreground">Only invited members can see and join</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="semi-public" id="semi-public" />
                    <Label htmlFor="semi-public" className="flex-1 cursor-pointer">
                      <div className="font-medium">Semi-Public</div>
                      <div className="text-sm text-muted-foreground">
                        Visible in Explore, but requires approval to join
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Stage 3: Feed Jinx */}
            {createPodStage === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="problem">Problem</Label>
                  <Textarea
                    id="problem"
                    placeholder="What problem does your startup solve?"
                    className="rounded-xl"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="solution">Solution</Label>
                  <Textarea
                    id="solution"
                    placeholder="How does your product/service solve it?"
                    className="rounded-xl"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Team</Label>
                  <Input id="team" placeholder="Who's on your team?" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-model">Business Model</Label>
                  <Input id="business-model" placeholder="How will you make money?" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress">Current Progress</Label>
                  <Textarea
                    id="progress"
                    placeholder="Where are you now? MVP, users, revenue?"
                    className="rounded-xl"
                    rows={2}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            {createPodStage > 1 && (
              <Button variant="outline" onClick={handleBack} className="rounded-xl bg-transparent">
                Back
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowCreatePodModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleCreatePod} className="rounded-xl bg-primary">
              {createPodStage === 3 ? "Create Pod" : "Next"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
