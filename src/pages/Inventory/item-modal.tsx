"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "react-i18next"

interface Category {
  id: string
  name: string
}

interface ItemData {
  name: string
  description: string
  quantity: number
  unit: "pcs" | "kg" | "L" | "pack"
  categoryId: string
  lowStockThreshold: number
}

interface ItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: ItemData) => void
  categories: Category[]
  initialData?: ItemData
  isEditing?: boolean
}

export function ItemModal({ open, onOpenChange, onSave, categories, initialData, isEditing }: ItemModalProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<ItemData>({
    name: "",
    description: "",
    quantity: 0,
    unit: "pcs",
    categoryId: categories[0]?.id || "",
    lowStockThreshold: 5,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        categoryId: String(initialData.categoryId),
      })
    } else {
      setFormData({
        name: "",
        description: "",
        quantity: 0,
        unit: "pcs",
        categoryId: categories[0]?.id || "",
        lowStockThreshold: 5,
      })
    }
  }, [initialData, open, categories])

  const handleSave = () => {
    if (!formData.name.trim() || !formData.categoryId) return
    onSave({ ...formData, categoryId: formData.categoryId })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("itemModal.editTitle") : t("itemModal.addTitle")}</DialogTitle>
          <DialogDescription>
            {isEditing ? t("itemModal.editDescription") : t("itemModal.addDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">{t("itemModal.name")}</Label>
              <Input
                id="item-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-category">{t("itemModal.category")}</Label>
              <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-description">{t("itemModal.description")}</Label>
            <Textarea
              id="item-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-quantity">{t("itemModal.quantity")}</Label>
              <Input
                id="item-quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-unit">{t("itemModal.unit")}</Label>
              <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v as "pcs" | "kg" | "L" | "pack" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">{t("itemModal.units.pcs")}</SelectItem>
                  <SelectItem value="pack">{t("itemModal.units.pack")}</SelectItem>
                  <SelectItem value="kg">{t("itemModal.units.kg")}</SelectItem>
                  <SelectItem value="L">{t("itemModal.units.L")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-threshold">{t("itemModal.lowStockThreshold")}</Label>
              <Input
                id="item-threshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("itemModal.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim()}>
            {isEditing ? t("itemModal.update") : t("itemModal.add")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}