"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Bell, AlertCircle, Database, Save } from "lucide-react"
import { toast } from "sonner"

export default function NotificationsTab() {
  const [loading, setLoading] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)

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
          <CardTitle className="text-base sm:text-lg">Notification Preferences</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-6">
          {[
            { id: "email-notif", label: "Email Notifications", checked: emailNotifications, setChecked: setEmailNotifications, icon: Mail, description: "Receive notifications via email" },
            { id: "push-notif", label: "Push Notifications", checked: pushNotifications, setChecked: setPushNotifications, icon: Bell, description: "Receive push notifications in browser" },
            { id: "stock-alerts", label: "Low Stock Alerts", checked: lowStockAlerts, setChecked: setLowStockAlerts, icon: AlertCircle, description: "Get notified when items are running low" },
            { id: "weekly-reports", label: "Weekly Reports", checked: weeklyReports, setChecked: setWeeklyReports, icon: Database, description: "Receive weekly inventory summary reports" },
          ].map(({ id, label, checked, setChecked, icon: Icon, description }) => (
            <div key={id} className="flex items-center justify-between gap-2">
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Label htmlFor={id} className="font-medium text-xs sm:text-sm">{label}</Label>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">{description}</p>
              </div>
              <Switch id={id} checked={checked} onCheckedChange={setChecked} />
            </div>
          ))}

          <div className="flex justify-end pt-2 sm:pt-4">
            <Button onClick={() => handleSave(() => toast.success("Preferences saved"))} disabled={loading} className="gap-2 text-xs sm:text-sm">
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
