"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
      setPhone(user.phone || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const currentAvatarSource = avatar ? URL.createObjectURL(avatar) : user?.profile_image || "";

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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("profile.updateError"));

      toast.success(t("profile.updateSuccess"));

      updateUser({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        bio,
        profile_image: data.user.profile_image || user?.profile_image,
      });

      if (data.user.profile_image) setAvatar(null);
    } catch (err: any) {
      toast.error(err.message || t("profile.updateError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">{t("profile.title")}</CardTitle>
          <CardDescription className="text-xs sm:text-sm">{t("profile.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">

          {/* Avatar Section */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <Avatar className="h-16 sm:h-20 w-16 sm:w-20 flex-shrink-0">
              <AvatarImage src={currentAvatarSource} />
              <AvatarFallback>{`${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase()}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files && e.target.files[0]) setAvatar(e.target.files[0]); }}
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
                  <span className="hidden sm:inline">{t("profile.changePhoto")}</span>
                  <span className="sm:hidden">{t("profile.change")}</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive text-xs sm:text-sm"
                  onClick={() => {
                    setAvatar(null);
                    updateUser({ profile_image: "" });
                    toast.info(t("profile.imageCleared"));
                  }}
                >
                  {t("profile.remove")}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{t("profile.avatarNote")}</p>
            </div>
          </div>

          <Separator />

          {/* Name Fields */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="firstName" className="text-xs sm:text-sm">{t("profile.firstName")}</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t("profile.firstNamePlaceholder")}
                className="h-8 sm:h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="lastName" className="text-xs sm:text-sm">{t("profile.lastName")}</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t("profile.lastNamePlaceholder")}
                className="h-8 sm:h-10 text-sm"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm">{t("profile.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("profile.emailPlaceholder")}
                className="h-8 sm:h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-xs sm:text-sm">{t("profile.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("profile.phonePlaceholder")}
                className="h-8 sm:h-10 text-sm"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="bio" className="text-xs sm:text-sm">{t("profile.bio")}</Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("profile.bioPlaceholder")}
              className="h-8 sm:h-10 text-sm"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2 sm:pt-4">
            <Button onClick={handleSave} disabled={loading} className="gap-2 text-xs sm:text-sm">
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {loading ? t("profile.saving") : t("profile.saveChanges")}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
