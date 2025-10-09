"use client"

import { useState, useEffect } from "react"
import { User, CreditCard, Plug, Bell, Palette, Shield, Globe, Sun, Moon, Monitor, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProtectedRoute } from "@/components/protected-route"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "theme", label: "Theme", icon: Palette },
]

const integrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Connect your workspace to Slack for notifications",
    connected: true,
    logo: "/slack-logo.png",
  },
  {
    id: "google",
    name: "Google Calendar",
    description: "Sync your meetings and events",
    connected: true,
    logo: "/google-calendar-logo.png",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Link your repositories and track commits",
    connected: false,
    logo: "/github-logo.png",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept payments and manage subscriptions",
    connected: false,
    logo: "/stripe-logo.png",
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-balance">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 rounded-2xl p-1 h-12">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="rounded-xl gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="rounded-2xl border-border">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details and public profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24 rounded-2xl border-2 border-border">
                      <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                      <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.6_0.2_290)] text-white text-2xl">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button className="rounded-xl bg-primary hover:bg-primary/90">Change Avatar</Button>
                      <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" className="rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      defaultValue="Founder & CEO at TechStartup"
                      className="rounded-xl"
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="San Francisco, CA" className="rounded-xl" />
                  </div>

                  <div className="flex gap-3">
                    <Button className="rounded-xl bg-primary hover:bg-primary/90">Save Changes</Button>
                    <Button variant="outline" className="rounded-xl bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card className="rounded-2xl border-border">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-[oklch(0.6_0.2_290)]/5 border border-primary/20">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">Personal Pro</h3>
                        <Badge className="rounded-lg bg-gradient-to-r from-primary to-[oklch(0.6_0.2_290)] text-white">
                          Active
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">$12/month • Renews on Jan 15, 2025</p>
                    </div>
                    <Button variant="outline" className="rounded-xl bg-transparent">
                      Change Plan
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-4">Payment Method</h4>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="rounded-xl">
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Billing History</h4>
                    <div className="space-y-2">
                      {[
                        { date: "Dec 15, 2024", amount: "$12.00", status: "Paid" },
                        { date: "Nov 15, 2024", amount: "$12.00", status: "Paid" },
                        { date: "Oct 15, 2024", amount: "$12.00", status: "Paid" },
                      ].map((invoice, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{invoice.date}</p>
                            <p className="text-sm text-muted-foreground">Personal Pro</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">{invoice.amount}</span>
                            <Badge variant="secondary" className="rounded-lg">
                              {invoice.status}
                            </Badge>
                            <Button variant="ghost" size="sm" className="rounded-xl">
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <Card className="rounded-2xl border-border">
                <CardHeader>
                  <CardTitle>Connected Apps</CardTitle>
                  <CardDescription>Manage your third-party integrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {integrations.map((integration) => (
                      <div
                        key={integration.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                            <Globe className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{integration.name}</h4>
                              {integration.connected && (
                                <Badge variant="secondary" className="rounded-lg">
                                  Connected
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                        <Button
                          variant={integration.connected ? "outline" : "default"}
                          className={`rounded-xl ${integration.connected ? "bg-transparent" : "bg-primary hover:bg-primary/90"}`}
                        >
                          {integration.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="rounded-2xl border-border">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="email-notifications" className="text-base font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="push-notifications" className="text-base font-medium">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Get notified in your browser</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="weekly-digest" className="text-base font-medium">
                        Weekly Digest
                      </Label>
                      <p className="text-sm text-muted-foreground">Summary of your activity every week</p>
                    </div>
                    <Switch id="weekly-digest" checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-4">Notification Types</h4>
                    <div className="space-y-3">
                      {[
                        "New messages in Pods",
                        "Goal progress updates",
                        "Team member mentions",
                        "Document uploads",
                        "Meeting reminders",
                        "Feedback submissions",
                      ].map((type) => (
                        <div key={type} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                          <span className="text-sm">{type}</span>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent value="theme" className="space-y-6">
              <Card className="rounded-2xl border-border">
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how WACE looks for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Theme Mode</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Light Theme */}
                      <button
                        onClick={() => setTheme("light")}
                        className={cn(
                          "relative p-4 rounded-xl border-2 transition-all hover:border-primary/50",
                          theme === "light" ? "border-primary bg-primary/5" : "border-border",
                        )}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center">
                            <Sun className="w-6 h-6 text-gray-900" />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">Light</p>
                            <p className="text-xs text-muted-foreground">Bright and clear</p>
                          </div>
                        </div>
                        {theme === "light" && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>

                      {/* Gray Theme */}
                      <button
                        onClick={() => setTheme("gray")}
                        className={cn(
                          "relative p-4 rounded-xl border-2 transition-all hover:border-primary/50",
                          theme === "gray" ? "border-primary bg-primary/5" : "border-border",
                        )}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-600 border-2 border-gray-500 flex items-center justify-center">
                            <Monitor className="w-6 h-6 text-gray-200" />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">Gray</p>
                            <p className="text-xs text-muted-foreground">Balanced contrast</p>
                          </div>
                        </div>
                        {theme === "gray" && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>

                      {/* Dark Theme */}
                      <button
                        onClick={() => setTheme("dark")}
                        className={cn(
                          "relative p-4 rounded-xl border-2 transition-all hover:border-primary/50",
                          theme === "dark" ? "border-primary bg-primary/5" : "border-border",
                        )}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-black border-2 border-gray-800 flex items-center justify-center">
                            <Moon className="w-6 h-6 text-gray-100" />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">Dark</p>
                            <p className="text-xs text-muted-foreground">Pure black</p>
                          </div>
                        </div>
                        {theme === "dark" && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                      <ThemeToggle />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Quick Toggle</p>
                        <p className="text-xs text-muted-foreground">Click to cycle through Light → Gray → Dark</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium mb-4 block">Accent Color</Label>
                    <div className="grid grid-cols-6 gap-3">
                      {[
                        "oklch(0.55 0.15 250)",
                        "oklch(0.6 0.2 290)",
                        "oklch(0.65 0.18 200)",
                        "oklch(0.6 0.2 150)",
                        "oklch(0.65 0.22 30)",
                        "oklch(0.6 0.2 350)",
                      ].map((color, index) => (
                        <button
                          key={index}
                          className="w-12 h-12 rounded-xl border-2 border-border hover:border-primary transition-all hover:scale-110"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" className="rounded-xl">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
