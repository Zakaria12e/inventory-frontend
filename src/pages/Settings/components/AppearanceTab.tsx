"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, Globe, Save } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function AppearanceTab() {
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("en")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")

  const handleSave = (callback: any) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      callback()
    }, 800)
  }

  return (
    <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Appearance Settings</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Customize the look and feel of your interface</CardDescription>
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
                <button key={value} onClick={() => setTheme(value)}
                  className={`flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-lg border-2 transition-colors ${theme === value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Language */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="language" className="text-xs sm:text-sm">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="h-8 sm:h-10 text-sm pl-9">
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

          {/* Date Format */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="dateFormat" className="text-xs sm:text-sm">Date Format</Label>
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
            <Button onClick={() => handleSave(() => toast.success("Settings saved"))} disabled={loading} className="gap-2 text-xs sm:text-sm">
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
