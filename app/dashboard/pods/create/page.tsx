"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Globe,
  Lock,
  Eye,
  Users,
  Target,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  X,
  Plus,
  Compass,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Step = "basic" | "privacy" | "jinx" | "finalize"

interface PodData {
  name: string
  description: string
  logo: string | null
  privacy: "private" | "semi-public"
  problem: string
  solution: string
  team: string
  progress: string
}

export default function CreatePodPage() {
  const [currentStep, setCurrentStep] = useState<Step>("basic")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [podData, setPodData] = useState<PodData>({
    name: "",
    description: "",
    logo: null,
    privacy: "semi-public",
    problem: "",
    solution: "",
    team: "",
    progress: "",
  })

  const steps = [
    { id: "basic", title: "Basic Info", description: "Pod name, logo, and description" },
    { id: "privacy", title: "Privacy Options", description: "Who can see and join your Pod" },
    { id: "jinx", title: "Feed Jinx", description: "Help AI understand your startup" },
    { id: "finalize", title: "Finalize", description: "Review and create your Pod" },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    const stepOrder: Step[] = ["basic", "privacy", "jinx", "finalize"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const stepOrder: Step[] = ["basic", "privacy", "jinx", "finalize"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const handleCreatePod = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push("/dashboard/pods/1") // Redirect to the new pod
    } catch (error) {
      console.error("Failed to create pod:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePodData = (field: keyof PodData, value: string) => {
    setPodData((prev) => ({ ...prev, [field]: value }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case "basic":
        return podData.name.trim() !== "" && podData.description.trim() !== ""
      case "privacy":
        return podData.privacy !== ""
      case "jinx":
        return true // Allow users to skip this step or fill partially
      case "finalize":
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-[#000917] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-700 p-6 bg-[#000917]">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-300">Welcome back! Here's what's happening with your Pods.</p>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-20 justify-start p-6 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200">
              <Link href="/dashboard/pods/create">
                <Plus className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Create New Pod</div>
                  <div className="text-sm text-gray-300">Start a new project workspace</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-20 justify-start p-6 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200">
              <Link href="/explore">
                <Compass className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Explore Pods</div>
                  <div className="text-sm text-gray-300">Discover and join communities</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-20 justify-start p-6 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200">
              <Link href="/shop">
                <ShoppingBag className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">AI Shop</div>
                  <div className="text-sm text-gray-300">Browse AI agents and tools</div>
                </div>
              </Link>
            </Button>
          </div>
        </main>
      </div>

      {/* Create Pod Modal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#000917] border border-gray-700 rounded-lg w-full max-w-xl max-h-[80vh] overflow-hidden">
          {/* Modal Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Create New Pod</h1>
                <p className="text-sm text-gray-300">Set up your AI-powered workspace</p>
              </div>
              <Button variant="ghost" size="icon" asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                <Link href="/dashboard">
                  <X className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)] scrollbar-hide">
            <div className="w-full">
              {/* Steps */}
              <div className="mb-6">
                <div className="flex items-center justify-center mb-3">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          index <= currentStepIndex
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {index < currentStepIndex ? <CheckCircle className="h-3 w-3" /> : index + 1}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-12 h-0.5 mx-2 ${index < currentStepIndex ? "bg-blue-600" : "bg-gray-700"}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <h2 className="text-base font-semibold text-white">{steps[currentStepIndex].title}</h2>
                  <p className="text-xs text-gray-300">{steps[currentStepIndex].description}</p>
                </div>
              </div>

              {currentStep === "basic" && (
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Basic Information</CardTitle>
                    <CardDescription className="text-gray-300">Give your Pod a name, logo, and description</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Pod Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., TechStartup Pod"
                        value={podData.name}
                        onChange={(e) => updatePodData("name", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-100 focus:ring-0 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo" className="text-white">Pod Logo</Label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                          {podData.logo ? (
                            <img
                              src={podData.logo || "/placeholder.svg"}
                              alt="Pod logo"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Upload className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">Recommended: 256x256px, PNG or JPG</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what your Pod is about and what you're building..."
                        value={podData.description}
                        onChange={(e) => updatePodData("description", e.target.value)}
                        rows={4}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-100 focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === "privacy" && (
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Privacy Options</CardTitle>
                    <CardDescription className="text-gray-300">Choose who can see and join your Pod</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={podData.privacy}
                      onValueChange={(value) => updatePodData("privacy", value)}
                      className="space-y-4"
                    >
                      <div 
                        className="flex items-start space-x-3 p-4 border border-gray-700 rounded-lg hover:bg-gray-700/30 transition-colors cursor-pointer"
                        onClick={() => updatePodData("privacy", "private")}
                      >
                        <RadioGroupItem value="private" id="private" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lock className="h-5 w-5 text-red-500" />
                            <Label htmlFor="private" className="text-base font-medium text-white cursor-pointer">
                              Private
                            </Label>
                            <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                              Invite Only
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300">
                            Invisible to others. Only you can invite people to join.
                          </p>
                        </div>
                      </div>

                      <div 
                        className="flex items-start space-x-3 p-4 border border-gray-700 rounded-lg hover:bg-gray-700/30 transition-colors cursor-pointer"
                        onClick={() => updatePodData("privacy", "semi-public")}
                      >
                        <RadioGroupItem value="semi-public" id="semi-public" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Eye className="h-5 w-5 text-blue-500" />
                            <Label htmlFor="semi-public" className="text-base font-medium text-white cursor-pointer">
                              Semi Public
                            </Label>
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                              Link Only
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300">
                            Visible in Explore Pods but requests are allowed. Good for semi-public projects.
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {currentStep === "jinx" && (
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Feed Jinx</CardTitle>
                    <CardDescription className="text-gray-300">Help AI understand your startup with key information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="problem" className="text-white">• Problem you're solving *</Label>
                      <Textarea
                        id="problem"
                        placeholder="What problem does your startup address?"
                        value={podData.problem}
                        onChange={(e) => updatePodData("problem", e.target.value)}
                        rows={3}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-100 focus:ring-0 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="solution" className="text-white">• Solution and features *</Label>
                      <Textarea
                        id="solution"
                        placeholder="How does your product solve this problem? What features do you offer?"
                        value={podData.solution}
                        onChange={(e) => updatePodData("solution", e.target.value)}
                        rows={3}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-100 focus:ring-0 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team" className="text-white">• Team information *</Label>
                      <Textarea
                        id="team"
                        placeholder="Who's on your team? What are their roles and expertise?"
                        value={podData.team}
                        onChange={(e) => updatePodData("team", e.target.value)}
                        rows={3}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-100 focus:ring-0 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="progress" className="text-white">• Work done so far *</Label>
                      <Textarea
                        id="progress"
                        placeholder="What progress have you made? MVP status, user feedback, milestones achieved..."
                        value={podData.progress}
                        onChange={(e) => updatePodData("progress", e.target.value)}
                        rows={3}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-100 focus:ring-0 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Upload document (optional)</Label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                          <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <Button variant="outline" size="sm" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload PDF/Document
                          </Button>
                          <p className="text-xs text-gray-400 mt-1">Upload pitch deck, business plan, or any relevant document</p>
                        </div>
                      </div>
                      <p className="text-xs text-blue-400">You can skip this step and continue without uploading</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === "finalize" && (
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Review & Create</CardTitle>
                    <CardDescription className="text-gray-300">Review your Pod details before creating</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium">Pod Name</h4>
                        <p className="text-gray-300">{podData.name}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Description</h4>
                        <p className="text-gray-300">{podData.description}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Privacy</h4>
                        <p className="text-gray-300 capitalize">{podData.privacy.replace('-', ' ')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === "basic"}
                  className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 hover:border-gray-600"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep === "finalize" ? (
                  <Button
                    onClick={handleCreatePod}
                    disabled={!isStepValid() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? "Creating Pod..." : "Create Pod"}
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} disabled={!isStepValid()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}