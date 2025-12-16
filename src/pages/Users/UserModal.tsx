"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { User, Mail, Lock, UserCircle, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

export function UserModal({ open, onOpenChange, onUserCreated }: Props) {
  const { t } = useTranslation();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employe");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const handleSave = async () => {
    if (!first_name || !last_name || !email || !password || !role) {
      return toast.error(t("userModal.allFieldsRequired"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error(t("userModal.invalidEmail"));
    }

    if (password.length < 6) {
      return toast.error(t("userModal.passwordMinLength"));
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/users`,
        { first_name, last_name, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t("userModal.userCreated"));
      onUserCreated();
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || t("userModal.creationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRole("employe");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserCircle className="h-5 w-5" />
            {t("userModal.title")}
          </DialogTitle>
          <DialogDescription>{t("userModal.description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-sm font-medium">
                {t("userModal.firstName")}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="first_name"
                  placeholder={t("userModal.firstNamePlaceholder")}
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-9"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-sm font-medium">
                {t("userModal.lastName")}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="last_name"
                  placeholder={t("userModal.lastNamePlaceholder")}
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-9"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("userModal.email")}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={t("userModal.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {t("userModal.password")}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-muted-foreground">{t("userModal.passwordHint")}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              {t("userModal.role")}
            </Label>
            <Select value={role} onValueChange={setRole} disabled={loading}>
              <SelectTrigger id="role">
                <SelectValue placeholder={t("userModal.rolePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employe">{t("userModal.employee")}</SelectItem>
                <SelectItem value="admin">{t("userModal.admin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            {t("userModal.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("userModal.creating")}
              </>
            ) : (
              t("userModal.createUser")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
