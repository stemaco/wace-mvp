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
import { DashboardSidebar } from "@/components/dashboard-sidebar"
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
    theme: "dark",
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
    <div className="min-h-screen bg-[#000917] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-700 p-6 bg-[#000917]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center text-white">
                <Settings className="h-8 w-8 mr-3 text-blue-300" />
                Settings
              </h1>
              <p className="text-gray-300">Manage your account settings and preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-800/20 text-blue-300 border-blue-800/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                All changes saved
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-[#000917]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl bg-gray-800/50 border-gray-700">
              <TabsTrigger value="profile" className="text-gray-300 data-[state=active]:bg-blue-800 data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-gray-300 data-[state=active]:bg-blue-800 data-[state=active]:text-white">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="text-gray-300 data-[state=active]:bg-blue-800 data-[state=active]:text-white">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="preferences" className="text-gray-300 data-[state=active]:bg-blue-800 data-[state=active]:text-white">
                <Palette className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="account" className="text-gray-300 data-[state=active]:bg-blue-800 data-[state=active]:text-white">
                <Key className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Profile Picture */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Profile Picture</CardTitle>
                    <CardDescription className="text-gray-300">Update your profile picture</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="bg-gray-700 text-white text-lg">
                          {profile.firstName[0]}{profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700/50">
                          <Camera className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="lg:col-span-2 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Personal Information</CardTitle>
                    <CardDescription className="text-gray-300">Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-white">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-white">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-white">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location" className="text-white">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website" className="text-white">Website</Label>
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => setProfile({...profile, website: e.target.value})}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timezone" className="text-white">Timezone</Label>
                        <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="PST" className="text-white hover:bg-gray-700">PST</SelectItem>
                            <SelectItem value="EST" className="text-white hover:bg-gray-700">EST</SelectItem>
                            <SelectItem value="GMT" className="text-white hover:bg-gray-700">GMT</SelectItem>
                            <SelectItem value="CET" className="text-white hover:bg-gray-700">CET</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="language" className="text-white">Language</Label>
                        <Select value={profile.language} onValueChange={(value) => setProfile({...profile, language: value})}>
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="English" className="text-white hover:bg-gray-700">English</SelectItem>
                            <SelectItem value="Spanish" className="text-white hover:bg-gray-700">Spanish</SelectItem>
                            <SelectItem value="French" className="text-white hover:bg-gray-700">French</SelectItem>
                            <SelectItem value="German" className="text-white hover:bg-gray-700">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleSaveProfile} className="bg-blue-800 hover:bg-blue-900 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Notification Preferences</CardTitle>
                  <CardDescription className="text-gray-300">Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Email Notifications</Label>
                        <p className="text-sm text-gray-400">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Push Notifications</Label>
                        <p className="text-sm text-gray-400">Receive push notifications in your browser</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">SMS Notifications</Label>
                        <p className="text-sm text-gray-400">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Marketing Emails</Label>
                        <p className="text-sm text-gray-400">Receive marketing and promotional emails</p>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Security Alerts</Label>
                        <p className="text-sm text-gray-400">Receive security-related notifications</p>
                      </div>
                      <Switch
                        checked={notifications.security}
                        onCheckedChange={(checked) => setNotifications({...notifications, security: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Product Updates</Label>
                        <p className="text-sm text-gray-400">Receive notifications about product updates</p>
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

            {/* Security */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Password & Authentication</CardTitle>
                    <CardDescription className="text-gray-300">Manage your password and authentication settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-white">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-300"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-400">Add an extra layer of security</p>
                      </div>
                      <Switch
                        checked={security.twoFactor}
                        onCheckedChange={(checked) => setSecurity({...security, twoFactor: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Login Alerts</Label>
                        <p className="text-sm text-gray-400">Get notified of new login attempts</p>
                      </div>
                      <Switch
                        checked={security.loginAlerts}
                        onCheckedChange={(checked) => setSecurity({...security, loginAlerts: checked})}
                      />
                    </div>
                    <Button onClick={handleSaveSecurity} className="bg-blue-800 hover:bg-blue-900 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Update Security
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Session Management</CardTitle>
                    <CardDescription className="text-gray-300">Manage your active sessions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="sessionTimeout" className="text-white">Session Timeout</Label>
                      <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity({...security, sessionTimeout: value})}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="15" className="text-white hover:bg-gray-700">15 minutes</SelectItem>
                          <SelectItem value="30" className="text-white hover:bg-gray-700">30 minutes</SelectItem>
                          <SelectItem value="60" className="text-white hover:bg-gray-700">1 hour</SelectItem>
                          <SelectItem value="120" className="text-white hover:bg-gray-700">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Active Sessions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <div>
                            <p className="text-white text-sm">Chrome on Windows</p>
                            <p className="text-gray-400 text-xs">San Francisco, CA • Last active: 2 minutes ago</p>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Current</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <div>
                            <p className="text-white text-sm">Safari on iPhone</p>
                            <p className="text-gray-400 text-xs">San Francisco, CA • Last active: 1 hour ago</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Appearance & Behavior</CardTitle>
                  <CardDescription className="text-gray-300">Customize your WACE experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="theme" className="text-white">Theme</Label>
                      <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-blue-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="dark" className="text-white hover:bg-gray-700">Dark</SelectItem>
                          <SelectItem value="light" className="text-white hover:bg-gray-700">Light</SelectItem>
                          <SelectItem value="system" className="text-white hover:bg-gray-700">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Compact Mode</Label>
                        <p className="text-sm text-gray-400">Use less space for interface elements</p>
                      </div>
                      <Switch
                        checked={preferences.compactMode}
                        onCheckedChange={(checked) => setPreferences({...preferences, compactMode: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Animations</Label>
                        <p className="text-sm text-gray-400">Enable smooth animations and transitions</p>
                      </div>
                      <Switch
                        checked={preferences.animations}
                        onCheckedChange={(checked) => setPreferences({...preferences, animations: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Sound Effects</Label>
                        <p className="text-sm text-gray-400">Play sounds for notifications and actions</p>
                      </div>
                      <Switch
                        checked={preferences.soundEffects}
                        onCheckedChange={(checked) => setPreferences({...preferences, soundEffects: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Auto-save</Label>
                        <p className="text-sm text-gray-400">Automatically save your work</p>
                      </div>
                      <Switch
                        checked={preferences.autoSave}
                        onCheckedChange={(checked) => setPreferences({...preferences, autoSave: checked})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSavePreferences} className="bg-blue-800 hover:bg-blue-900 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account */}
            <TabsContent value="account" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Data Management</CardTitle>
                    <CardDescription className="text-gray-300">Export or delete your account data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Export Data</p>
                          <p className="text-gray-400 text-sm">Download all your data in JSON format</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleExportData} className="border-gray-600 text-gray-300 hover:bg-gray-700/50">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Import Data</p>
                          <p className="text-gray-400 text-sm">Upload previously exported data</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700/50">
                          <Upload className="h-4 w-4 mr-2" />
                          Import
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription className="text-gray-300">Irreversible and destructive actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                          <div>
                            <h4 className="text-white font-medium">Delete Account</h4>
                            <p className="text-gray-400 text-sm mt-1">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="mt-3 bg-red-600 hover:bg-red-700"
                              onClick={handleDeleteAccount}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
