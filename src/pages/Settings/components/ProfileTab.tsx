"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Camera, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function ProfileTab() {
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState("John")
  const [lastName, setLastName] = useState("Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [phone, setPhone] = useState("+1 234 567 8900")
  const [bio, setBio] = useState("Inventory Manager")

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
          <CardTitle className="text-base sm:text-lg">Profile Information</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Update your personal details and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Avatar */}
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
              <Label htmlFor="firstName" className="text-xs sm:text-sm">First Name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="h-8 sm:h-10 text-sm"/>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="lastName" className="text-xs sm:text-sm">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="h-8 sm:h-10 text-sm"/>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-8 sm:h-10 text-sm" placeholder="john@example.com"/>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-8 sm:h-10 text-sm" placeholder="+1 234 567 8900"/>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="bio" className="text-xs sm:text-sm">Bio</Label>
            <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="h-8 sm:h-10 text-sm" placeholder="Tell us about yourself"/>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2 sm:pt-4">
            <Button onClick={() => handleSave(() => toast.success("Profile updated"))} disabled={loading} className="gap-2 text-xs sm:text-sm">
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
