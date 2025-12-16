"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconSelector } from "./icon-selector"
import { useTranslation } from "react-i18next"

interface CategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: { name: string; description: string; icon: string; iconColor: string }) => void
  initialData?: { name: string; description: string; icon?: string; iconColor?: string }
  isEditing?: boolean
}

export function CategoryModal({ open, onOpenChange, onSave, initialData, isEditing }: CategoryModalProps) {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("Package")
  const [iconColor, setIconColor] = useState("blue")

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description)
      setIcon(initialData.icon || "Package")
      setIconColor(initialData.iconColor || "blue")
    } else {
      setName("")
      setDescription("")
      setIcon("Package")
      setIconColor("blue")
    }
  }, [initialData, open])

  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name, description, icon, iconColor })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("categoryModal.editTitle") : t("categoryModal.createTitle")}</DialogTitle>
          <DialogDescription>
            {isEditing ? t("categoryModal.editDescription") : t("categoryModal.createDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">{t("categoryModal.nameLabel")}</Label>
            <Input
              id="category-name"
              placeholder={t("categoryModal.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">{t("categoryModal.descriptionLabel")}</Label>
            <Textarea
              id="category-description"
              placeholder={t("categoryModal.descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <IconSelector value={icon} onIconChange={setIcon} color={iconColor} onColorChange={setIconColor} />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("categoryModal.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {isEditing ? t("categoryModal.saveButtonEdit") : t("categoryModal.saveButtonCreate")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
