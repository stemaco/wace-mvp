"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  ShoppingBag,
  Bot,
  Star,
  Check,
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  Brain,
  Target,
  BarChart3,
  MessageSquare,
  Code,
  Palette,
  Shield,
  Crown,
} from "lucide-react"

export default function ShopPage() {
  const [cart, setCart] = useState<string[]>([])

  const aiAgents = [
    {
      id: "finance-ai",
      name: "AI Finance Agent",
      description: "Expert financial analysis, forecasting, and investment guidance for startups",
      price: "$49/month",
      rating: 4.9,
      reviews: 127,
      features: ["Financial modeling", "Cash flow analysis", "Investment recommendations", "Risk assessment"],
      icon: DollarSign,
      category: "Finance",
      popular: true,
    },
    {
      id: "marketing-ai",
      name: "AI Marketing Strategist",
      description: "Comprehensive marketing strategy, campaign optimization, and growth hacking",
      price: "$39/month",
      rating: 4.8,
      reviews: 203,
      features: ["Marketing strategy", "Campaign optimization", "A/B testing", "Growth analytics"],
      icon: TrendingUp,
      category: "Marketing",
      popular: false,
    },
    {
      id: "product-ai",
      name: "AI Product Manager",
      description: "Product roadmap planning, feature prioritization, and user research insights",
      price: "$45/month",
      rating: 4.7,
      reviews: 89,
      features: ["Product roadmaps", "Feature prioritization", "User research", "Competitive analysis"],
      icon: Target,
      category: "Product",
      popular: false,
    },
    {
      id: "data-ai",
      name: "AI Data Analyst",
      description: "Advanced data analysis, visualization, and business intelligence insights",
      price: "$55/month",
      rating: 4.9,
      reviews: 156,
      features: ["Data visualization", "Predictive analytics", "Business intelligence", "Custom reports"],
      icon: BarChart3,
      category: "Analytics",
      popular: true,
    },
    {
      id: "sales-ai",
      name: "AI Sales Coach",
      description: "Sales strategy, lead qualification, and conversion optimization",
      price: "$42/month",
      rating: 4.6,
      reviews: 94,
      features: ["Sales strategy", "Lead scoring", "Pipeline management", "Conversion optimization"],
      icon: Users,
      category: "Sales",
      popular: false,
    },
    {
      id: "tech-ai",
      name: "AI Technical Advisor",
      description: "Architecture guidance, code reviews, and technical decision support",
      price: "$59/month",
      rating: 4.8,
      reviews: 78,
      features: ["Architecture review", "Code analysis", "Tech stack advice", "Security audits"],
      icon: Code,
      category: "Technology",
      popular: false,
    },
    {
      id: "design-ai",
      name: "AI Design Consultant",
      description: "UI/UX guidance, design system creation, and brand development",
      price: "$47/month",
      rating: 4.7,
      reviews: 112,
      features: ["UI/UX design", "Design systems", "Brand guidelines", "User testing"],
      icon: Palette,
      category: "Design",
      popular: false,
    },
    {
      id: "legal-ai",
      name: "AI Legal Advisor",
      description: "Contract review, compliance guidance, and legal risk assessment",
      price: "$65/month",
      rating: 4.9,
      reviews: 67,
      features: ["Contract review", "Compliance checks", "Legal research", "Risk assessment"],
      icon: Shield,
      category: "Legal",
      popular: false,
    },
  ]

  const plans = [
    {
      id: "personal",
      name: "Personal Plan",
      description: "Advanced Personal AI Assistant",
      price: "$29/month",
      yearlyPrice: "$290/year",
      features: [
        "Syncs with all your Pods",
        "Document analysis and summaries",
        "Meeting transcription and notes",
        "Personal productivity insights",
        "Priority support",
        "Advanced AI capabilities",
      ],
      popular: false,
    },
    {
      id: "team",
      name: "Team Pack",
      description: "Enhanced Pod collaboration",
      price: "$99/month",
      yearlyPrice: "$990/year",
      features: [
        "Everything in Personal Plan",
        "Advanced Pod AI for selected Pod",
        "Team automation workflows",
        "Advanced analytics and insights",
        "Custom integrations",
        "Dedicated account manager",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Full-scale AI transformation",
      price: "Custom pricing",
      yearlyPrice: "Contact sales",
      features: [
        "Everything in Team Pack",
        "Unlimited Pods and members",
        "Custom AI agent development",
        "Advanced security and compliance",
        "On-premise deployment options",
        "24/7 premium support",
      ],
      popular: false,
    },
  ]

  const bundles = [
    {
      id: "startup-essentials",
      name: "Startup Essentials Bundle",
      description: "Perfect for early-stage startups",
      originalPrice: "$183/month",
      bundlePrice: "$129/month",
      savings: "$54/month",
      agents: ["finance-ai", "marketing-ai", "product-ai"],
      popular: true,
    },
    {
      id: "growth-accelerator",
      name: "Growth Accelerator Bundle",
      description: "Scale your startup with data-driven insights",
      originalPrice: "$136/month",
      bundlePrice: "$99/month",
      savings: "$37/month",
      agents: ["data-ai", "sales-ai"],
      popular: false,
    },
    {
      id: "complete-suite",
      name: "Complete AI Suite",
      description: "All AI agents for comprehensive support",
      originalPrice: "$364/month",
      bundlePrice: "$249/month",
      savings: "$115/month",
      agents: ["finance-ai", "marketing-ai", "product-ai", "data-ai", "sales-ai"],
      popular: false,
    },
  ]

  const addToCart = (itemId: string) => {
    if (!cart.includes(itemId)) {
      setCart([...cart, itemId])
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((id) => id !== itemId))
  }

  const isInCart = (itemId: string) => cart.includes(itemId)

  return (
    <div className="min-h-screen bg-[#000917] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-700 p-6 bg-[#000917]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center text-white">
                <ShoppingBag className="h-8 w-8 mr-3 text-blue-300" />
                WACE Shop
              </h1>
              <p className="text-gray-300">Supercharge your startup with AI agents and premium plans</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-800/20 text-blue-300 border-blue-800/30">
                {cart.length} items in cart
              </Badge>
              <Button className="bg-blue-800 hover:bg-blue-900 text-white">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Checkout
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-[#000917]">
          <Tabs defaultValue="agents" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md bg-gray-800/50 border-gray-700">
              <TabsTrigger value="agents" className="text-gray-300 data-[state=active]:bg-blue-800 data-[state=active]:text-white">AI Agents</TabsTrigger>
              <TabsTrigger value="plans" className="text-gray-300 data-[state=active]:bg-blue-800 data-[state=active]:text-white">Plans</TabsTrigger>
              <TabsTrigger value="bundles" className="text-gray-300 data-[state=active]:bg-blue-800 data-[state=active]:text-white">Bundles</TabsTrigger>
            </TabsList>

            {/* AI Agents */}
            <TabsContent value="agents" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">AI Agents</h2>
                  <p className="text-gray-300">Specialized AI consultants for every aspect of your startup</p>
                </div>
                <Badge variant="secondary" className="bg-blue-800/20 text-blue-300 border-blue-800/30">8 agents available</Badge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {aiAgents.map((agent) => (
                  <Card key={agent.id} className="relative hover:shadow-lg transition-shadow bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    {agent.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-blue-800 text-white">Popular</Badge>
                    )}
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-800/30 rounded-lg flex items-center justify-center">
                          <agent.icon className="h-6 w-6 text-blue-300" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            {agent.category}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-sm leading-relaxed text-gray-300">{agent.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-300">{agent.price}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-white">{agent.rating}</span>
                            <span className="text-sm text-gray-400">({agent.reviews})</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {agent.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                              <span className="text-xs text-gray-400">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={() => (isInCart(agent.id) ? removeFromCart(agent.id) : addToCart(agent.id))}
                          variant={isInCart(agent.id) ? "secondary" : "default"}
                          className={`w-full ${isInCart(agent.id) ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-blue-800 hover:bg-blue-900 text-white"}`}
                        >
                          {isInCart(agent.id) ? "Remove from Cart" : "Add to Cart"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Plans */}
            <TabsContent value="plans" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Subscription Plans</h2>
                <p className="text-gray-300">Choose the perfect plan for your team's needs</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card key={plan.id} className={`relative bg-gray-800/50 border-gray-700 backdrop-blur-sm ${plan.popular ? "border-blue-800" : ""}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                      <div className="py-4">
                        <div className="text-3xl font-bold text-blue-300">{plan.price}</div>
                        {plan.yearlyPrice !== plan.price && (
                          <div className="text-sm text-gray-400">or {plan.yearlyPrice}</div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={() => addToCart(plan.id)}
                          variant={plan.popular ? "default" : "outline"}
                          className={`w-full ${plan.popular ? "bg-blue-800 hover:bg-blue-900 text-white" : "border-gray-600 text-gray-300 hover:bg-gray-700/50"}`}
                          disabled={isInCart(plan.id)}
                        >
                          {isInCart(plan.id) ? "Added to Cart" : "Choose Plan"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Bundles */}
            <TabsContent value="bundles" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">AI Agent Bundles</h2>
                <p className="text-gray-300">Save money with curated bundles of AI agents</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bundles.map((bundle) => (
                  <Card key={bundle.id} className={`relative bg-gray-800/50 border-gray-700 backdrop-blur-sm ${bundle.popular ? "border-blue-800" : ""}`}>
                    {bundle.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        Best Value
                      </Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl text-white">{bundle.name}</CardTitle>
                      <CardDescription className="text-gray-300">{bundle.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-lg text-gray-400 line-through">{bundle.originalPrice}</span>
                            <span className="text-2xl font-bold text-blue-300">{bundle.bundlePrice}</span>
                          </div>
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400 mt-2">
                            Save {bundle.savings}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-white">Included AI Agents:</h4>
                          {bundle.agents.map((agentId) => {
                            const agent = aiAgents.find((a) => a.id === agentId)
                            return (
                              <div key={agentId} className="flex items-center space-x-2">
                                <Bot className="h-3 w-3 text-blue-300 flex-shrink-0" />
                                <span className="text-sm text-gray-300">{agent?.name}</span>
                              </div>
                            )
                          })}
                        </div>

                        <Button
                          onClick={() => addToCart(bundle.id)}
                          className="w-full bg-blue-800 hover:bg-blue-900 text-white"
                          disabled={isInCart(bundle.id)}
                        >
                          {isInCart(bundle.id) ? "Added to Cart" : "Get Bundle"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Featured Section */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-800/10 to-blue-800/5 rounded-lg border border-blue-800/20">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Brain className="h-6 w-6 text-blue-300" />
                <h3 className="text-xl font-bold text-white">Need Custom AI Solutions?</h3>
              </div>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our team can develop custom AI agents tailored to your specific industry and use case. Get in touch to
                discuss your unique requirements.
              </p>
              <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700/50">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Sales
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
