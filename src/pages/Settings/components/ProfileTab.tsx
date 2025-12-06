"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // 1. useEffect simplified: only initializes text fields.
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
      setPhone(user.phone || "");
      setBio(user.bio || "");
      // Removed setAvatarPreview
    }
  }, [user]);

  // 2. Dynamic Source Calculation
  // This ensures the displayed image always reflects the current state (new file or saved context path).
  const currentAvatarSource = avatar 
    ? URL.createObjectURL(avatar)
    : user?.profile_image 
    ? `${API_URL}${user.profile_image}`
    : ""; 

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("bio", bio);
      if (avatar) formData.append("avatar", avatar);

      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      toast.success("Profile updated successfully");

      // Update the user in AuthContext with new fields, including the profile_image path.
      updateUser({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        bio,
        profile_image: data.profile_image || user?.profile_image,
      });
      
      // Clear the temporary file state after successful upload
      if (data.profile_image) {
          setAvatar(null); 
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

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
              {/* Use the dynamically calculated source */}
              <AvatarImage src={currentAvatarSource} /> 
              <AvatarFallback>{`${user?.first_name[0] || ""}${user?.last_name[0] || ""}`.toUpperCase()}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setAvatar(e.target.files[0]);
                  // Preview is handled automatically by currentAvatarSource
                }
              }}
            />
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 text-xs sm:text-sm bg-transparent"
                  onClick={() => document.getElementById("avatarInput")?.click()}
                >
                  <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Change Photo</span>
                  <span className="sm:hidden">Change</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive text-xs sm:text-sm"
                  onClick={() => {
                    setAvatar(null);
                    // 3. Update AuthContext immediately to clear the displayed image
                    updateUser({ profile_image: "" }); 
                    toast.info("Image cleared. Click 'Save Changes' to confirm.");
                  }}
                >
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
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="h-8 sm:h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="lastName" className="text-xs sm:text-sm">Last Name</Label>
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
              <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="h-8 sm:h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="h-8 sm:h-10 text-sm"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="bio" className="text-xs sm:text-sm">Bio</Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="h-8 sm:h-10 text-sm"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2 sm:pt-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="gap-2 text-xs sm:text-sm"
            >
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}