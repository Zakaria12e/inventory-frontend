"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, Save } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useLanguage } from "@/context/LanguageContext"

type Theme = "light" | "dark" | "system"

export default function AppearanceTab() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage() // use global language context

  const [theme, setTheme] = useState<Theme>("system")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [loading, setLoading] = useState(false)

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  /* -------------------- HANDLE SAVE -------------------- */
  const handleSave = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      await fetch(`${API_BASE}/system-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ language, theme, dateFormat }),
      })
      toast.success(t("appearance.saved"))
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("appearance.title")}</CardTitle>
        <CardDescription>{t("appearance.description")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* THEME */}
        <div>
          <Label>{t("appearance.theme")}</Label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { value: "light", icon: Sun, label: t("appearance.light") },
              { value: "dark", icon: Moon, label: t("appearance.dark") },
              { value: "system", icon: Monitor, label: t("appearance.system") },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value as Theme)}
                className={`p-4 rounded-lg border transition ${
                  theme === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Icon className="mx-auto mb-1 h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* LANGUAGE */}
        <div  className="grid grid-cols-3 gap-3 mt-2">
          <div><Label className="mb-2">{t("appearance.language")}</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select></div>
          

          <div>
          <Label className="mb-2">{t("appearance.dateFormat")}</Label>
          <Select value={dateFormat} onValueChange={setDateFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>

        {/* DATE FORMAT */}
        

        {/* SAVE BUTTON */}
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? t("appearance.saving") : t("appearance.save")}
        </Button>
      </CardContent>
    </Card>
  )
}