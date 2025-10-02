"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotionSidebar } from "@/components/notion-sidebar"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Edit,
  Camera,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    security: true,
    updates: true,
  })

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Building the next big SaaS platform with AI integration",
    location: "San Francisco, CA",
    website: "https://johndoe.com",
    timezone: "PST",
    language: "English",
    avatar: "/placeholder.svg?height=32&width=32",
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
    passwordLastChanged: "2024-01-15",
  })

  const [preferences, setPreferences] = useState({
    theme: "light",
    sidebarCollapsed: false,
    compactMode: false,
    animations: true,
    soundEffects: false,
    autoSave: true,
  })

  const handleSaveProfile = () => {
    // Handle profile save logic
    console.log("Profile saved:", profile)
  }

  const handleSaveSecurity = () => {
    // Handle security save logic
    console.log("Security settings saved:", security)
  }

  const handleSavePreferences = () => {
    // Handle preferences save logic
    console.log("Preferences saved:", preferences)
  }

  const handleExportData = () => {
    // Handle data export
    console.log("Exporting data...")
  }

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log("Deleting account...")
  }

  return (
    <div className="relative h-screen bg-background overflow-hidden">
      <NotionSidebar />

      <div className="absolute inset-0 flex flex-col pl-[268px]">
        <div className="relative glass-card rounded-l-3xl border-l border-border/50 h-full">
          {/* Header */}
          <header className="border-b border-border px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center text-foreground">
                  <Settings className="h-8 w-8 mr-3 text-muted-foreground" />
                  Settings
                </h1>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="glass-card">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  All changes saved
                </Badge>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-8 py-6 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 max-w-2xl glass-card rounded-xl">
                <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="preferences" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                  <Palette className="h-4 w-4 mr-2" />
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                  <Key className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Profile Picture */}
                  <Card className="glass-card rounded-2xl border-border/50">
                    <CardHeader>
                      <CardTitle className="text-foreground">Profile Picture</CardTitle>
                      <CardDescription className="text-muted-foreground">Update your profile picture</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="bg-primary/10 text-foreground text-lg">
                            {profile.firstName[0]}{profile.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="rounded-xl">
                            <Camera className="h-4 w-4 mr-2" />
                            Change Photo
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive rounded-xl">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personal Information */}
                  <Card className="lg:col-span-2 glass-card rounded-2xl border-border/50">
                    <CardHeader>
                      <CardTitle className="text-foreground">Personal Information</CardTitle>
                      <CardDescription className="text-muted-foreground">Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                          <Input
                            id="firstName"
                            value={profile.firstName}
                            onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                            className="rounded-xl glass-button"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profile.lastName}
                            onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                            className="rounded-xl glass-button"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-foreground">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="rounded-xl glass-button"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-foreground">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="rounded-xl glass-button"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio" className="text-foreground">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                          className="rounded-xl glass-button"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location" className="text-foreground">Location</Label>
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            className="rounded-xl glass-button"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website" className="text-foreground">Website</Label>
                          <Input
                            id="website"
                            value={profile.website}
                            onChange={(e) => setProfile({...profile, website: e.target.value})}
                            className="rounded-xl glass-button"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSaveProfile} className="rounded-xl">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="glass-card rounded-2xl border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">Notification Preferences</CardTitle>
                    <CardDescription className="text-muted-foreground">Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">Marketing Updates</Label>
                          <p className="text-sm text-muted-foreground">Receive marketing and promotional content</p>
                        </div>
                        <Switch
                          checked={notifications.marketing}
                          onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">Security Alerts</Label>
                          <p className="text-sm text-muted-foreground">Important security notifications</p>
                        </div>
                        <Switch
                          checked={notifications.security}
                          onCheckedChange={(checked) => setNotifications({...notifications, security: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">Product Updates</Label>
                          <p className="text-sm text-muted-foreground">New features and improvements</p>
                        </div>
                        <Switch
                          checked={notifications.updates}
                          onCheckedChange={(checked) => setNotifications({...notifications, updates: checked})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card className="glass-card rounded-2xl border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">Security Settings</CardTitle>
                    <CardDescription className="text-muted-foreground">Manage your security preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Switch
                          checked={security.twoFactor}
                          onCheckedChange={(checked) => setSecurity({...security, twoFactor: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">Login Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified of new sign-ins</p>
                        </div>
                        <Switch
                          checked={security.loginAlerts}
                          onCheckedChange={(checked) => setSecurity({...security, loginAlerts: checked})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout" className="text-foreground">Session Timeout</Label>
                        <Select
                          value={security.sessionTimeout}
                          onValueChange={(value) => setSecurity({...security, sessionTimeout: value})}
                        >
                          <SelectTrigger className="rounded-xl glass-button">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="240">4 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Change Password</Label>
                        <p className="text-sm text-muted-foreground">Last changed: {security.passwordLastChanged}</p>
                        <Button variant="outline" className="rounded-xl">
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveSecurity} className="rounded-xl">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Settings */}
              <TabsContent value="preferences" className="space-y-6">
                <Card className="glass-card rounded-2xl border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">App Preferences</CardTitle>
                    <CardDescription className="text-muted-foreground">Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="theme" className="text-foreground">Theme</Label>
                        <Select
                          value={preferences.theme}
                          onValueChange={(value) => setPreferences({...preferences, theme: value})}
                        >
                          <SelectTrigger className="rounded-xl glass-button">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">Show more content in less space</p>
                        </div>
                        <Switch
                          checked={preferences.compactMode}
                          onCheckedChange={(checked) => setPreferences({...preferences, compactMode: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">Animations</Label>
                          <p className="text-sm text-muted-foreground">Enable interface animations</p>
                        </div>
                        <Switch
                          checked={preferences.animations}
                          onCheckedChange={(checked) => setPreferences({...preferences, animations: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">Sound Effects</Label>
                          <p className="text-sm text-muted-foreground">Play sounds for actions</p>
                        </div>
                        <Switch
                          checked={preferences.soundEffects}
                          onCheckedChange={(checked) => setPreferences({...preferences, soundEffects: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-foreground">Auto-Save</Label>
                          <p className="text-sm text-muted-foreground">Automatically save your work</p>
                        </div>
                        <Switch
                          checked={preferences.autoSave}
                          onCheckedChange={(checked) => setPreferences({...preferences, autoSave: checked})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSavePreferences} className="rounded-xl">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Settings */}
              <TabsContent value="account" className="space-y-6">
                <Card className="glass-card rounded-2xl border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">Data Management</CardTitle>
                    <CardDescription className="text-muted-foreground">Export or download your data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" onClick={handleExportData} className="rounded-xl">
                      <Download className="h-4 w-4 mr-2" />
                      Export All Data
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card rounded-2xl border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription className="text-muted-foreground">Irreversible actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl border border-destructive/50 bg-destructive/5">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Delete Account</p>
                          <p className="text-sm text-muted-foreground">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            className="rounded-xl"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}