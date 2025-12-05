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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  AlertCircle,
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

  const handleSave = (callback : any) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      callback()
    }, 800)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Settings</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-1 sm:gap-0 p-1">
          <TabsTrigger value="profile" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Profile Information</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Update your personal details and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <Avatar className="h-16 sm:h-20 w-16 sm:w-20 flex-shrink-0">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2 flex-1">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" variant="outline" className="gap-2 text-xs sm:text-sm bg-transparent">
                      <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Change Photo</span>
                      <span className="sm:hidden">Change</span>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive text-xs sm:text-sm">
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <Separator />

              {/* Name Fields */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="firstName" className="text-xs sm:text-sm">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="h-8 sm:h-10 text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="lastName" className="text-xs sm:text-sm">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="h-8 sm:h-10 text-sm"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2 sm:top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-8 sm:h-10 text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="phone" className="text-xs sm:text-sm">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-8 sm:h-10 text-sm"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="bio" className="text-xs sm:text-sm">
                  Bio
                </Label>
                <Input
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="h-8 sm:h-10 text-sm"
                  placeholder="Tell us about yourself"
                />
              </div>

              <div className="flex justify-end pt-2 sm:pt-4">
                <Button
                  onClick={() => handleSave(() => toast.success("Profile updated"))}
                  disabled={loading}
                  className="gap-2 text-xs sm:text-sm"
                >
                  <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-destructive text-base sm:text-lg">Danger Zone</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm" className="gap-2 w-full sm:w-auto text-xs sm:text-sm">
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Notification Preferences</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-6">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Label htmlFor="email-notif" className="font-medium text-xs sm:text-sm">
                      Email Notifications
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground hidden sm:block">Receive notifications via email</p>
                </div>
                <Switch id="email-notif" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Label htmlFor="push-notif" className="font-medium text-xs sm:text-sm">
                      Push Notifications
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground hidden sm:block">Receive push notifications in browser</p>
                </div>
                <Switch id="push-notif" checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Label htmlFor="stock-alerts" className="font-medium text-xs sm:text-sm">
                      Low Stock Alerts
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Get notified when items are running low
                  </p>
                </div>
                <Switch id="stock-alerts" checked={lowStockAlerts} onCheckedChange={setLowStockAlerts} />
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Label htmlFor="weekly-reports" className="font-medium text-xs sm:text-sm">
                      Weekly Reports
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Receive weekly inventory summary reports
                  </p>
                </div>
                <Switch id="weekly-reports" checked={weeklyReports} onCheckedChange={setWeeklyReports} />
              </div>

              <div className="flex justify-end pt-2 sm:pt-4">
                <Button
                  onClick={() => handleSave(() => toast.success("Preferences saved"))}
                  disabled={loading}
                  className="gap-2 text-xs sm:text-sm"
                >
                  <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Appearance Settings</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Customize the look and feel of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Theme Selection */}
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-xs sm:text-sm">Theme</Label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { value: "light", icon: Sun, label: "Light" },
                    { value: "dark", icon: Moon, label: "Dark" },
                    { value: "system", icon: Monitor, label: "System" },
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-lg border-2 transition-colors ${
                        theme === value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Language */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="language" className="text-xs sm:text-sm">
                  Language
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2 sm:top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="pl-9 h-8 sm:h-10 text-sm">
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
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="dateFormat" className="text-xs sm:text-sm">
                  Date Format
                </Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger id="dateFormat" className="h-8 sm:h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-2 sm:pt-4">
                <Button
                  onClick={() => handleSave(() => toast.success("Settings saved"))}
                  disabled={loading}
                  className="gap-2 text-xs sm:text-sm"
                >
                  <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Security Settings</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage your account security and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-6">
              {/* Change Password */}
              <div className="space-y-2 sm:space-y-4">
                <h3 className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="current-password" className="text-xs sm:text-sm">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-8 sm:h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="new-password" className="text-xs sm:text-sm">
                      New Password
                    </Label>
                    <Input id="new-password" type="password" placeholder="••••••••" className="h-8 sm:h-10 text-sm" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="confirm-password" className="text-xs sm:text-sm">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-8 sm:h-10 text-sm"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Label htmlFor="2fa" className="font-medium text-xs sm:text-sm">
                      Two-Factor Authentication
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground hidden sm:block">Add an extra layer of security</p>
                </div>
                <Switch id="2fa" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
              </div>

              <Separator />

              {/* Session Timeout */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="sessionTimeout" className="text-xs sm:text-sm">
                  Session Timeout (minutes)
                </Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger id="sessionTimeout" className="h-8 sm:h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-2 sm:pt-4">
                <Button
                  onClick={() => handleSave(() => toast.success("Security settings updated"))}
                  disabled={loading}
                  className="gap-2 text-xs sm:text-sm"
                >
                  <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
