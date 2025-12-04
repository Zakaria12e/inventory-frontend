"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Lock,
  Globe,
  Moon,
  Sun,
  Monitor,
  Camera,
  Save,
  Trash2,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Profile settings
  const [firstName, setFirstName] = useState("John")
  const [lastName, setLastName] = useState("Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [phone, setPhone] = useState("+1 234 567 8900")
  const [bio, setBio] = useState("Inventory Manager")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)

  // Appearance settings
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("en")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")

  const handleSaveProfile = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Profile updated successfully")
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Notification preferences saved")
    }, 1000)
  }

  const handleSaveAppearance = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Appearance settings saved")
    }, 1000)
  }

  const handleSaveSecurity = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Security settings updated")
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Name Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email-notif" className="font-medium">
                      Email Notifications
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="push-notif" className="font-medium">
                      Push Notifications
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in browser
                  </p>
                </div>
                <Switch
                  id="push-notif"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <Separator />

              {/* Low Stock Alerts */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="stock-alerts" className="font-medium">
                      Low Stock Alerts
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get notified when items are running low
                  </p>
                </div>
                <Switch
                  id="stock-alerts"
                  checked={lowStockAlerts}
                  onCheckedChange={setLowStockAlerts}
                />
              </div>

              <Separator />

              {/* Weekly Reports */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="weekly-reports" className="font-medium">
                      Weekly Reports
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly inventory summary reports
                  </p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications} disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                      theme === "light"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                      theme === "dark"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                      theme === "system"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Monitor className="h-5 w-5" />
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </div>

              <Separator />

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="pl-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Format */}
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger id="dateFormat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveAppearance} disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Change Password */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="2fa" className="font-medium">
                      Two-Factor Authentication
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  id="2fa"
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>

              <Separator />

              {/* Session Timeout */}
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout</Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger id="session-timeout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Automatically log out after period of inactivity
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSecurity} disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Saving..." : "Update Security"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage devices where you're currently logged in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Monitor className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Chrome on Windows</p>
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Casablanca, Morocco • Last active now
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Safari on iPhone</p>
                    <p className="text-xs text-muted-foreground">
                      Casablanca, Morocco • 2 hours ago
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive">
                  Revoke
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}