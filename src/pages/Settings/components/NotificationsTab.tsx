"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Bell, AlertCircle, Database, Save } from "lucide-react"
import { toast } from "sonner"

export default function NotificationsTab() {
  const { t } = useTranslation()
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

  const settings = [
    {
      id: "email-notif",
      label: t("notifications.emailNotifications"),
      checked: emailNotifications,
      setChecked: setEmailNotifications,
      icon: Mail,
      description: t("notifications.emailNotificationsDesc"),
    },
    {
      id: "push-notif",
      label: t("notifications.pushNotifications"),
      checked: pushNotifications,
      setChecked: setPushNotifications,
      icon: Bell,
      description: t("notifications.pushNotificationsDesc"),
    },
    {
      id: "stock-alerts",
      label: t("notifications.lowStockAlerts"),
      checked: lowStockAlerts,
      setChecked: setLowStockAlerts,
      icon: AlertCircle,
      description: t("notifications.lowStockAlertsDesc"),
    },
    {
      id: "weekly-reports",
      label: t("notifications.weeklyReports"),
      checked: weeklyReports,
      setChecked: setWeeklyReports,
      icon: Database,
      description: t("notifications.weeklyReportsDesc"),
    },
  ]

  return (
    <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">{t("notifications.title")}</CardTitle>
          <CardDescription className="text-xs sm:text-sm">{t("notifications.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-6">
          {settings.map(({ id, label, checked, setChecked, icon: Icon, description }) => (
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
            <Button onClick={() => handleSave(() => toast.success(t("notifications.saveSuccess")))} disabled={loading} className="gap-2 text-xs sm:text-sm">
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {loading ? t("notifications.saving") : t("notifications.save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
