"use client"

import { useState } from "react"
import { Check, Sparkles, Zap, Crown, TrendingUp, DollarSign, Palette, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ProtectedRoute } from "@/components/protected-route"

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    icon: Sparkles,
    features: ["1 Pod workspace", "Up to 3 team members", "Basic chat & goals", "5GB storage", "Community support"],
    popular: false,
  },
  {
    id: "personal",
    name: "Personal Pro",
    price: "$12",
    period: "per month",
    description: "For serious solo founders",
    icon: Zap,
    features: [
      "3 Pod workspaces",
      "Up to 10 team members",
      "All collaboration tools",
      "50GB storage",
      "Priority support",
      "Advanced analytics",
      "1 AI agent included",
    ],
    popular: true,
  },
  {
    id: "pods",
    name: "Pods Pro",
    price: "$49",
    period: "per month",
    description: "For growing teams",
    icon: Crown,
    features: [
      "Unlimited Pod workspaces",
      "Unlimited team members",
      "All collaboration tools",
      "500GB storage",
      "24/7 priority support",
      "Advanced analytics",
      "5 AI agents included",
      "Custom integrations",
      "White-label options",
    ],
    popular: false,
  },
]

const aiAgents = [
  {
    id: "finance",
    name: "Finance AI",
    description: "Financial planning, budgeting, and fundraising assistance",
    icon: DollarSign,
    price: "$19",
    period: "per month",
    features: ["Budget tracking", "Financial projections", "Investor pitch help", "Expense analysis"],
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "marketing",
    name: "Marketing AI",
    description: "Content creation, social media, and growth strategies",
    icon: TrendingUp,
    price: "$19",
    period: "per month",
    features: ["Content generation", "Social media posts", "SEO optimization", "Campaign ideas"],
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "design",
    name: "Design AI",
    description: "UI/UX feedback, design systems, and brand guidelines",
    icon: Palette,
    price: "$19",
    period: "per month",
    features: ["Design feedback", "Color palette suggestions", "Layout recommendations", "Brand consistency"],
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "analytics",
    name: "Analytics AI",
    description: "Data analysis, insights, and performance tracking",
    icon: BarChart,
    price: "$19",
    period: "per month",
    features: ["Data visualization", "Trend analysis", "Performance metrics", "Predictive insights"],
    color: "from-purple-500 to-violet-600",
  },
]

export default function ShopPage() {
  const [selectedTab, setSelectedTab] = useState("plans")

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-balance">Shop</h1>
            <p className="text-sm text-muted-foreground">Upgrade your workspace and add AI agents</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="p-8 max-w-6xl mx-auto">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 rounded-xl p-1 h-11">
            <TabsTrigger value="plans" className="rounded-lg">
              Plans
            </TabsTrigger>
            <TabsTrigger value="ai-agents" className="rounded-lg">
              AI Agents
            </TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const Icon = plan.icon
                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "rounded-xl border transition-all",
                      plan.popular ? "border-primary" : "border-border",
                    )}
                  >
                    <CardHeader className="pb-4">
                      {plan.popular && (
                        <Badge className="w-fit rounded-lg mb-2 bg-primary text-white">Most Popular</Badge>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">/ {plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm">{plan.description}</CardDescription>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={cn(
                          "w-full rounded-lg",
                          plan.popular ? "bg-primary hover:bg-primary/90" : "bg-transparent",
                        )}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.id === "free" ? "Current Plan" : "Upgrade"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* AI Agents Tab */}
          <TabsContent value="ai-agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiAgents.map((agent) => {
                const Icon = agent.icon
                return (
                  <Card key={agent.id} className="rounded-xl border-border hover:border-primary/50 transition-all">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-white`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-xl font-bold">{agent.price}</span>
                              <span className="text-xs text-muted-foreground">/ month</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-sm">{agent.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-1.5">
                        {agent.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full rounded-lg bg-primary hover:bg-primary/90">Add Agent</Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Bundle */}
            <Card className="rounded-xl border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-[oklch(0.6_0.2_290)] flex items-center justify-center text-white">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-0.5">All AI Agents Bundle</h3>
                      <p className="text-sm text-muted-foreground">Save 25% with all agents</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground line-through">$76/mo</div>
                    <div className="text-2xl font-bold mb-2">$57/mo</div>
                    <Button className="rounded-lg bg-primary hover:bg-primary/90">Get Bundle</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  )
}
