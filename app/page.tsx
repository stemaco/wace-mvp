"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ArrowRight,
  Users,
  Bot,
  Network,
  TrendingUp,
  Compass,
  Plus,
  MessageSquare,
  Target,
  FileText,
  Calendar,
  Video,
  Folder,
  MessageCircle,
  Settings,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

// Typing animation component for AI assistant names
function TypingAssistantName() {
  const names = ["Jinx", "Laura", "Max", "Steve"]
  const [currentNameIndex, setCurrentNameIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentName = names[currentNameIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentName.length) {
          setCurrentText(currentName.slice(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 1500) // Wait 1.5 seconds before deleting
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentNameIndex((prev) => (prev + 1) % names.length)
        }
      }
    }, isDeleting ? 80 : 120) // Faster animation: 80ms deletion, 120ms typing

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentNameIndex])

  return (
    <span className="text-white font-medium">
      {currentText}
      <span className="animate-pulse text-blue-400">|</span>
    </span>
  )
}

// Window opening animation component
function WindowReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Top curtain */}
      <div 
        className={`absolute top-0 left-0 w-full h-1/2 bg-blue-600/10 transition-transform duration-1000 ease-out z-10 ${
          isVisible ? '-translate-y-full' : 'translate-y-0'
        }`}
      />
      
      {/* Bottom curtain */}
      <div 
        className={`absolute bottom-0 left-0 w-full h-1/2 bg-blue-600/10 transition-transform duration-1000 ease-out z-10 ${
          isVisible ? 'translate-y-full' : 'translate-y-0'
        }`}
      />
      
      {/* Content */}
      <div className={`transition-opacity duration-500 delay-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {children}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [showMoreFeatures, setShowMoreFeatures] = useState(false)

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#000917] text-white relative scroll-smooth" style={{scrollBehavior: 'smooth'}}>
      {/* Background dots pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
        <div className="absolute top-16 right-20 w-1 h-1 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-32 left-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-20 right-16 w-1 h-1 bg-blue-400 rounded-full"></div>
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-400 rounded-full"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full"></div>
      </div>
      {/* Header */}
      <header>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="WACE Logo" 
                width={40} 
                height={40} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">WACE</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" className="py-20 px-4 relative">
        {/* Background Lines SVG */}
        <div className="absolute inset-0 opacity-0">
          <Image 
            src="/The-lines.svg" 
            alt="Background Lines" 
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-blue-600/20 text-blue-400 border-blue-600/30">
            AI-Powered Collaboration Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance text-white">Your Space. Your AI. Your Progress.</h1>
          <p className="text-xl text-gray-300 mb-8 text-pretty max-w-2xl mx-auto">
            AI-powered Pods for founders, teams, and freelancers. Collaborate, organize, and grow with intelligent
            workspaces designed for modern startups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6" asChild>
              <Link href="/auth/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-gray-600 text-gray-300 hover:text-white hover:border-blue-400" asChild>
              <Link href="/explore">
                <Compass className="mr-2 h-5 w-5" />
                Explore Pods
              </Link>
            </Button>
          </div>

          {/* Hero Mockup */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex">
                {/* Sidebar Preview */}
                <div className="w-64 bg-gray-700/50 rounded-l-lg p-4 border-r border-gray-600">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-blue-400">
                      <Plus className="h-4 w-4" />
                      <span>Create Pod</span>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-sm text-left">Ecowork</div>
                      <div className="text-gray-400 px-2 py-1 text-sm text-left">Trice</div>
                      <div className="text-gray-400 px-2 py-1 text-sm text-left">DeepRoot</div>
                    </div>
                  </div>
                </div>
                {/* Main Content Preview */}
                <div className="flex-1 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-400" />
                      <span className="font-medium text-white">Ecowork Pod Chat</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gray-700/50 p-3 rounded text-left">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-gray-400">Sarah Chen</span>
                        </div>
                        <p className="text-sm text-gray-300">Hey team! Just finished the market research for our eco-friendly packaging solution</p>
                      </div>
                      <div className="bg-gray-700/50 p-3 rounded text-left">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-gray-400">Mike Rodriguez</span>
                        </div>
                        <p className="text-sm text-gray-300">Great work Sarah! The data looks promising. Should we schedule a review meeting? @jinx what do you suggest</p>
                      </div>
                      <div className="bg-blue-600/10 border border-blue-600/20 p-3 rounded text-left">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-xs text-blue-400">JINX</span>
                        </div>
                        <p className="text-sm text-blue-200">I've analyzed the market data and suggest scheduling the review for tomorrow at 2pm. I can also prepare a competitive analysis report.</p>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Our Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to build, collaborate, and grow your startup
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 relative z-10">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">AI Agents</h3>
                <p className="text-gray-300">
                  Access specialized AI agents for different aspects of your business - from strategy to execution.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 relative z-10">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Personalized Assistants</h3>
                <p className="text-gray-300">
                  Get your own AI assistant that learns your preferences and adapts to your working style.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 relative z-10">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Showcase Feature</h3>
                <p className="text-gray-300">
                  Showcase your Pods to potential collaborators, investors, and partners in our community.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 relative z-10">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Find Co-founders</h3>
                <p className="text-gray-300">
                  Connect with like-minded entrepreneurs and find the perfect co-founder for your startup journey.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 relative z-10">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Smart Collaboration</h3>
                <p className="text-gray-300">
                  Work seamlessly with your team using AI-powered tools for project management and communication.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 relative z-10">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Network className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Investor Network</h3>
                <p className="text-gray-300">
                  Connect with investors and showcase your startup to potential funding partners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Personalized AI Assistant Section */}
      <section id="jinx" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Get Your Own Personalized AI-Powered Assistant</h2>
            <p className="text-xl text-gray-300">Advanced AI that syncs all your work across every Pod - docs, meetings, chats, and more</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-blue-400" />
                  </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Cross-Pod Synchronization</h3>
                  <p className="text-gray-300">Your AI assistant automatically syncs and analyzes data from all your Pods - documents, meetings, chats, and tasks.</p>
                  </div>
                  </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-400" />
                  </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Intelligent Context</h3>
                  <p className="text-gray-300">Advanced AI that understands your work patterns, preferences, and goals across all your projects.</p>
                  </div>
                  </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Advanced Automation</h3>
                  <p className="text-gray-300">Automate repetitive tasks, schedule meetings, organize documents, and manage workflows across all Pods.</p>
                  </div>
                </div>
              </div>

            {/* Jinx Chat Preview */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <TypingAssistantName />
                <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">Online</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                    U
                      </div>
                      <div className="flex-1">
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-sm text-gray-300">can you schedule a meeting at 8pm on Zyrox pod and a meeting at 10pm on Trice pod also add them to my google calendar too</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        AI
                      </div>
                      <div className="flex-1">
                    <div className="bg-blue-600/10 border border-blue-600/20 p-3 rounded-lg">
                      <p className="text-sm text-blue-200">
                        I've scheduled both meetings for you! 8pm meeting on Zyrox pod and 10pm meeting on Trice pod. 
                        Both have been added to your Google Calendar with automatic reminders. I'll also notify the team members in each pod.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Get Expert Advice from Different AI Agents</h2>
            <p className="text-xl text-gray-300">Access specialized AI agents from our shop, each with unique expertise</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 text-center relative z-10">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Strategy Pro</h3>
                <p className="text-blue-400 font-medium mb-2">Business Strategy</p>
                <p className="text-gray-300 text-sm">Expert AI agent specializing in business planning, market analysis, and strategic decision-making.</p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 text-center relative z-10">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Marketing Genius</h3>
                <p className="text-blue-400 font-medium mb-2">Growth & Marketing</p>
                <p className="text-gray-300 text-sm">AI agent focused on customer acquisition, growth hacking, and digital marketing strategies.</p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 text-center relative z-10">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Finance Expert</h3>
                <p className="text-blue-400 font-medium mb-2">Finance & Funding</p>
                <p className="text-gray-300 text-sm">Specialized AI agent for financial planning, fundraising, and investment strategies.</p>
              </CardContent>
            </Card>

            <Card className="p-6 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 text-center relative z-10">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Product Master</h3>
                <p className="text-blue-400 font-medium mb-2">Product Development</p>
                <p className="text-gray-300 text-sm">AI agent specialized in product strategy, MVP development, and user experience design.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Inside a Pod Section */}
      <section id="journaling" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">What's Inside a Pod</h2>
            <p className="text-xl text-gray-300">Everything you need to build and manage your startup in one intelligent workspace</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Team Chats</h3>
                  <p className="text-gray-300">Real-time communication with your team, integrated with AI assistance for better collaboration.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Document Management</h3>
                  <p className="text-gray-300">Organize and collaborate on documents, presentations, and files with AI-powered organization.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Strategy Planning</h3>
                  <p className="text-gray-300">Plan and track your business strategy with AI-powered insights and milestone tracking.</p>
                </div>
              </div>

              {/* Additional features that appear with animation */}
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showMoreFeatures ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">Calendar & Scheduling</h3>
                      <p className="text-gray-300">Manage meetings, deadlines, and events with smart scheduling and automatic reminders.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">Journal & Notes</h3>
                      <p className="text-gray-300">Keep track of ideas, progress, and insights with AI-powered note-taking and organization.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Video className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">Video Meetings</h3>
                      <p className="text-gray-300">Host video calls and screen sharing sessions directly within your Pod workspace.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* See More Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={() => setShowMoreFeatures(!showMoreFeatures)}
                  variant="outline" 
                  className="bg-transparent border-blue-600 text-blue-400 hover:bg-blue-600/10 hover:border-blue-500 transition-all duration-300"
                >
                  {showMoreFeatures ? (
                    <>
                      <span>See Less</span>
                      <span className="ml-2 transform transition-transform duration-300 rotate-180">⌄</span>
                    </>
                  ) : (
                    <>
                      <span>See More Features</span>
                      <span className="ml-2 transform transition-transform duration-300">⌄</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Pod Preview */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Pod Dashboard</h3>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30">Active</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Team Chat</span>
                  </div>
                  <span className="text-blue-400 font-medium">3 online</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Documents</span>
                  </div>
                  <span className="text-blue-400 font-medium">12 files</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Calendar</span>
                  </div>
                  <span className="text-blue-400 font-medium">2 meetings</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Journal</span>
                  </div>
                  <span className="text-blue-400 font-medium">5 entries</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div className="flex items-center space-x-2">
                    <Video className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Meetings</span>
                  </div>
                  <span className="text-blue-400 font-medium">1 scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Pods Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Explore Pods & Find Opportunities</h2>
            <p className="text-xl text-gray-300">Discover startups, join teams, or find investment opportunities in our vibrant community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* For Freelancers & Job Seekers */}
            <Card className="p-8 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 text-center relative z-10">
                <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Join a Startup</h3>
                <p className="text-gray-300 mb-6">
                  Browse active Pods looking for co-founders, freelancers, and team members. 
                  Find the perfect startup to join and grow with.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Find co-founder opportunities</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Join as freelancer or contractor</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Connect with like-minded entrepreneurs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Investors */}
            <Card className="p-8 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 text-center relative z-10">
                <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Invest in Startups</h3>
                <p className="text-gray-300 mb-6">
                  Discover promising startups and investment opportunities. 
                  Access detailed Pod profiles, metrics, and team information.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Browse startup portfolios</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">View detailed metrics and progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Connect directly with founders</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Startups */}
            <Card className="p-8 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 text-center relative z-10">
                <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Network className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Showcase Your Startup</h3>
                <p className="text-gray-300 mb-6">
                  Present your Pod to potential investors, collaborators, and team members. 
                  Build your network and grow your startup.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Create compelling Pod profiles</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Showcase progress and achievements</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Attract investors and talent</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-800/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Choose Your Plan</h2>
            <p className="text-xl text-gray-300">Start free and scale as you grow. All plans include AI-powered collaboration tools.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="p-8 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 text-center relative z-10">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Free (Starter)</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">$0</div>
                  <p className="text-gray-400">Perfect for getting started</p>
                </div>
                
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Basic AI Assistant</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">3 Pods</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Basic Channels</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Simple Showcase</span>
                  </li>
                </ul>

                <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Personal Pro Plan */}
            <Card className="p-8 transition-all duration-300 bg-gray-800 border-blue-500 relative overflow-hidden group hover:scale-105 border-2">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                Most Popular
              </div>
              <CardContent className="p-0 text-center relative z-10">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Personal Pro</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">$14</div>
                  <p className="text-gray-400">per month (or $140/year)</p>
                </div>
                
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Pro AI Assistant</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Smart Scheduling</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Advanced Analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">5 Pods</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Premium Showcase</span>
                  </li>
                </ul>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Start Personal Pro
                </Button>
              </CardContent>
            </Card>

            {/* Pod Pro Plan */}
            <Card className="p-8 transition-all duration-300 bg-gray-800 border-gray-700 relative overflow-hidden group hover:scale-105">
              <CardContent className="p-0 text-center relative z-10">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Pod Pro</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">$49</div>
                  <p className="text-gray-400">per month per Pod (or $490/year)</p>
                </div>
                
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Pod AI</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">JINX Advanced AI</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">3 Pro Consultants</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Pro VC + AI Notes</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Custom Branding</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Priority Showcase</span>
                  </li>
                </ul>

                <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                  Start Pod Pro
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Add-Ons Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-white mb-8">⚡ Add-Ons</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-2">Extra Pods</h4>
                <p className="text-blue-400 font-bold text-xl mb-2">$5/month each</p>
                <p className="text-gray-400 text-sm">For Free/Pro users</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-2">Extra Consultants</h4>
                <p className="text-blue-400 font-bold text-xl mb-2">+$15/month</p>
                <p className="text-gray-400 text-sm">Per 3-pack for Pods</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-2">VC Advanced</h4>
                <p className="text-blue-400 font-bold text-xl mb-2">$10/month</p>
                <p className="text-gray-400 text-sm">Unlimited call recording + AI transcripts</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-2">Custom Domain</h4>
                <p className="text-blue-400 font-bold text-xl mb-2">$20/year</p>
                <p className="text-gray-400 text-sm">For Showcase</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">All plans include 14-day free trial</p>
            <p className="text-sm text-gray-500">Cancel anytime. No hidden fees.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300">Everything you need to know about WACE Pods and AI-powered collaboration</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-gray-800 border-gray-700 rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-blue-400">
                What is a Pod and how does it work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                A Pod is your intelligent workspace that combines team collaboration, AI assistance, and project management. 
                Each Pod includes team chats, document management, strategy planning, and calendar integration, all powered by AI 
                to help you build and grow your startup more effectively.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-gray-800 border-gray-700 rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-blue-400">
                How does the personalized AI assistant sync across Pods?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Your AI assistant automatically syncs and analyzes data from all your Pods - including documents, meetings, 
                chats, and tasks. It learns your work patterns and provides intelligent insights and recommendations across 
                all your projects, making it a truly advanced collaboration tool.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-gray-800 border-gray-700 rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-blue-400">
                What's the difference between Free, Personal Pro, and Pod Pro plans?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Free plan includes 3 Pods with basic AI assistant. Personal Pro ($14/month) offers 5 Pods, advanced AI, smart scheduling, and premium showcase. Pod Pro ($49/month per Pod) includes unlimited Pods, JINX Advanced AI, 3 Pro Consultants, custom branding, and priority showcase for teams and startups.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-gray-800 border-gray-700 rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-blue-400">
                How can I find co-founders and collaborators?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                WACE provides a showcase feature where you can display your Pods to potential collaborators, investors, and partners. 
                Our community platform helps you connect with like-minded entrepreneurs and find the perfect co-founder for your startup journey.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-gray-800 border-gray-700 rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-blue-400">
                Is my data secure across all Pods?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Absolutely. We use enterprise-grade security measures including end-to-end encryption, secure cloud storage, 
                and regular security audits. Your data is never shared with third parties without your explicit consent, 
                and all Pod data is protected with the same high-level security standards.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/bg2.jpg" 
            alt="Background" 
            fill
            className="object-cover opacity-20"
          />
        </div>
        
        {/* Content */}
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-white">Join a Digital Workspace for Your Startup</h2>
          <p className="text-xl text-gray-300 mb-8">
            Find collaborators, connect with investors, and build your startup in our AI-powered ecosystem. 
            Start your journey today and transform your ideas into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6" asChild>
              <Link href="/auth/signup">
                Start Building <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-gray-600 text-gray-300 hover:text-white hover:border-blue-400" asChild>
              <Link href="/explore">Find Collaborators</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-12 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Image 
                    src="/logo.png" 
                    alt="WACE Logo" 
                    width={40} 
                    height={40} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-white">WACE</span>
              </div>
              <p className="text-gray-300 mb-4">AI-powered Pods for founders, teams, and freelancers. Collaborate, organize, and grow with intelligent workspaces designed for modern startups.</p>
              <div className="flex space-x-4">
                <Link href="https://instagram.com/wace" target="_blank" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Link>
                <Link href="https://linkedin.com/company/wace" target="_blank" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
                <Link href="https://tiktok.com/@wace" target="_blank" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/coming-soon" className="hover:text-blue-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-blue-400 transition-colors">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-blue-400 transition-colors">
                    Works
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-blue-400 transition-colors">
                    Career
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Help</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/coming-soon" className="hover:text-blue-400 transition-colors">
                    Customer Support
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-blue-400 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-blue-400 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/coming-soon" className="hover:text-blue-400 transition-colors">
                    Start Here
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-blue-400 transition-colors">
                    Explore Pods
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-blue-400 transition-colors">
                    What is JINX?
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-blue-400 transition-colors">
                    AI Agents Shop
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 WACE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
