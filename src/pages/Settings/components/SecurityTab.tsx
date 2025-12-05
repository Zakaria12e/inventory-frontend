"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, Shield, Save } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function SecurityTab() {
  const [loading, setLoading] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")

  // Change password
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

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
                <Label htmlFor="current-password" className="text-xs sm:text-sm">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-8 sm:h-10 text-sm"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="new-password" className="text-xs sm:text-sm">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-8 sm:h-10 text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="confirm-password" className="text-xs sm:text-sm">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-8 sm:h-10 text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <Label htmlFor="2fa" className="font-medium text-xs sm:text-sm">Two-Factor Authentication</Label>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">Add an extra layer of security</p>
            </div>
            <Switch id="2fa" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
          </div>

          <Separator />

          {/* Session Timeout */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="sessionTimeout" className="text-xs sm:text-sm">Session Timeout (minutes)</Label>
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
            <Button onClick={() => handleSave(() => toast.success("Security settings updated"))} disabled={loading} className="gap-2 text-xs sm:text-sm">
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
