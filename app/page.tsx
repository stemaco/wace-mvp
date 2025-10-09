"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Users, Target, Sparkles, ArrowRight, Zap, Shield, TrendingUp, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/wace.png" alt="WACE" width={40} height={40} className="rounded-xl" />
              <span className="text-2xl font-bold text-white">
                WACE
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/signin">
                <Button variant="ghost" className="rounded-xl">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/5 border border-white/10">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Startup Journey Starts Here</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white">
              Build Your
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                Dream Startup
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
              The gamified platform that transforms startup ideas into reality with AI-powered guidance, collaborative workspaces, and data-driven insights.
            </p>

            <div className="flex items-center justify-center gap-4 pt-8">
              <Link href="/signup">
                <Button size="lg" className="rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 text-lg px-8 h-14">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline" className="rounded-xl text-lg px-8 h-14 backdrop-blur-xl bg-white/5 border-white/10 text-white hover:bg-white/10">
                  Watch Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 pt-12 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-gray-400">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-gray-400">Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-gray-400">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Step Feature Showcase */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Launch in <span className="text-primary">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-400">From idea to execution in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Pod",
                description: "Set up your workspace and invite your team members to collaborate",
                icon: Rocket,
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "Plan & Strategize",
                description: "Use AI-powered tools to plan your roadmap and set achievable goals",
                icon: Target,
                gradient: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                title: "Execute & Scale",
                description: "Track progress, get insights, and scale your startup to success",
                icon: TrendingUp,
                gradient: "from-cyan-500 to-blue-500",
              },
            ].map((step, index) => (
              <Card key={index} className="rounded-2xl border-white/10 hover:border-primary/50 transition-all backdrop-blur-xl bg-white/5">
                <CardContent className="p-8 space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-lg`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-bold text-primary/20">{step.step}</div>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Everything You Need to <span className="text-primary">Succeed</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed for modern startups
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Assistant",
                description: "Get personalized recommendations and strategic advice",
                icon: Sparkles,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Collaborative Pods",
                description: "Private workspaces for your team to build together",
                icon: Users,
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Goal Tracking",
                description: "Set milestones and monitor progress in real-time",
                icon: Target,
                color: "from-cyan-500 to-blue-500",
              },
              {
                title: "Video Meetings",
                description: "Built-in video calls and screen sharing",
                icon: Zap,
                color: "from-orange-500 to-red-500",
              },
              {
                title: "Secure & Private",
                description: "Enterprise-grade security for your data",
                icon: Shield,
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Analytics Dashboard",
                description: "Track metrics and gain actionable insights",
                icon: TrendingUp,
                color: "from-purple-500 to-indigo-500",
              },
            ].map((feature, index) => (
              <Card key={index} className="rounded-2xl border-white/10 hover:border-primary/50 transition-all group cursor-pointer backdrop-blur-xl bg-white/5">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="rounded-3xl border-2 border-primary/20 backdrop-blur-xl bg-white/5 p-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Build Your <span className="text-primary">Future</span>?
              </h2>
              <p className="text-xl text-gray-400">
                Join thousands of entrepreneurs turning their ideas into successful startups
              </p>
              <div className="flex items-center justify-center gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 text-lg px-8 h-14">
                    Get Started for Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 backdrop-blur-xl bg-black/80">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/wace.png" alt="WACE" width={40} height={40} className="rounded-xl" />
                <span className="text-xl font-bold text-white">WACE</span>
              </div>
              <p className="text-sm text-gray-400">
                Build your dream startup with AI-powered tools and collaborative workspaces.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
            <p>© 2025 WACE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}