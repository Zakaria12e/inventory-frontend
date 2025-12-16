"use client"

import type React from "react"
import {
  Package,
  Hammer,
  Truck,
  Pill,
  Leaf,
  Utensils,
  Home,
  Monitor,
  ShoppingBag,
  Wrench,
  Lightbulb,
  BarChart3,
  Briefcase,
  Zap,
  Cpu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { OilIcon } from "@/components/icons/OilIcon"
import { TubeIcon } from "@/components/icons/TubeIcon"
import { GasCylinderIcon } from "@/components/icons/GasCylinderIcon"
import { useTranslation } from "react-i18next"

interface IconOption {
  name: string
  icon: React.ReactNode
  label: string
}

const CONSTRUCTION_ICONS: IconOption[] = [
  { name: "Zap", icon: <Zap className="w-4 h-4" />, label: "Electricity" },
  { name: "Truck", icon: <Truck className="w-4 h-4" />, label: "Logistics / Transport" },
  { name: "Hammer", icon: <Hammer className="w-4 h-4" />, label: "Construction / Tools" },
  { name: "Wrench", icon: <Wrench className="w-4 h-4" />, label: "Maintenance" },
  { name: "Oil", icon: <OilIcon className="w-4 h-4" />, label: "Oil / Petroleum" },
  { name: "Tube", icon: <TubeIcon className="w-4 h-4" />, label: "Tube / Pipe" },
  { name: "GasCylinder", icon: <GasCylinderIcon className="w-4 h-4" />, label: "Gas Cylinder" },
  { name: "Package", icon: <Package className="w-4 h-4" />, label: "Materials / Supplies" },
  { name: "Leaf", icon: <Leaf className="w-4 h-4" />, label: "Environment / Landscaping" },
  { name: "Cpu", icon: <Cpu className="w-4 h-4" />, label: "Automation / Control" },
  { name: "Lightbulb", icon: <Lightbulb className="w-4 h-4" />, label: "Lighting / Electricity" },
  { name: "Pill", icon: <Pill className="w-4 h-4" />, label: "Safety / Health" },
  { name: "Monitor", icon: <Monitor className="w-4 h-4" />, label: "Monitoring / IT" },
  { name: "BarChart3", icon: <BarChart3 className="w-4 h-4" />, label: "Metrics / Performance" },
  { name: "Briefcase", icon: <Briefcase className="w-4 h-4" />, label: "Project Management" },
  { name: "ShoppingBag", icon: <ShoppingBag className="w-4 h-4" />, label: "Equipment / Supplies" },
  { name: "Utensils", icon: <Utensils className="w-4 h-4" />, label: "Cafeteria / Food" },
  { name: "Home", icon: <Home className="w-4 h-4" />, label: "Buildings / Structures" },
]



const COLORS = [
  { name: "red", value: "#ef4444", label: "Red" },
  { name: "orange", value: "#f97316", label: "Orange" },
  { name: "amber", value: "#eab308", label: "Amber" },
  { name: "yellow", value: "#eab308", label: "Yellow" },
  { name: "lime", value: "#84cc16", label: "Lime" },
  { name: "green", value: "#22c55e", label: "Green" },
  { name: "emerald", value: "#10b981", label: "Emerald" },
  { name: "teal", value: "#14b8a6", label: "Teal" },
  { name: "cyan", value: "#06b6d4", label: "Cyan" },
  { name: "blue", value: "#3b82f6", label: "Blue" },
  { name: "indigo", value: "#6366f1", label: "Indigo" },
  { name: "violet", value: "#7c3aed", label: "Violet" },
  { name: "purple", value: "#a855f7", label: "Purple" },
  { name: "pink", value: "#ec4899", label: "Pink" },
  { name: "rose", value: "#f43f5e", label: "Rose" },
  { name: "gray", value: "#6b7280", label: "Gray" },
]

interface IconSelectorProps {
  value: string
  onIconChange: (iconName: string) => void
  color: string
  onColorChange: (color: string) => void
}

export function IconSelector({ value, onIconChange, color, onColorChange }: IconSelectorProps) {
  const selectedIcon = CONSTRUCTION_ICONS.find((i) => i.name === value)
  const { t } = useTranslation()

return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="icon-select">{t("iconSelector.iconLabel")}</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start bg-transparent" id="icon-select">
              {selectedIcon ? (
                <>
                  <span className="mr-2">{selectedIcon.icon}</span>
                  {t(`iconSelector.icons.${selectedIcon.name}`)}
                </>
              ) : (
                t("iconSelector.selectPlaceholder")
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {CONSTRUCTION_ICONS.map((icon) => (
              <DropdownMenuItemButton
                key={icon.name}
                selected={value === icon.name}
                onClick={() => onIconChange(icon.name)}
              >
                <span className="mr-2">{icon.icon}</span>
                {t(`iconSelector.icons.${icon.name}`)}
              </DropdownMenuItemButton>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <Label>{t("iconSelector.colorLabel")}</Label>
        <div className="grid grid-cols-8 gap-2">
          {COLORS.map((colorOption) => (
            <button
              key={colorOption.name}
              onClick={() => onColorChange(colorOption.name)}
              className={cn(
                "w-8 h-8 rounded-md transition-all border-2",
                color === colorOption.name ? "border-foreground scale-110" : "border-transparent hover:scale-105",
              )}
              style={{ backgroundColor: colorOption.value }}
              title={t(`iconSelector.colors.${colorOption.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper component to make dropdown items clickable
function DropdownMenuItemButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <DropdownMenuItemWrapper selected={selected} onClick={onClick}>
      {children}
    </DropdownMenuItemWrapper>
  )
}

function DropdownMenuItemWrapper({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <DropdownMenuItemCustom selected={selected} onClick={onClick}>
      {children}
    </DropdownMenuItemCustom>
  )
}

function DropdownMenuItemCustom({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        selected && "bg-accent text-accent-foreground",
      )}
    >
      {children}
      {selected && <span className="ml-auto">✓</span>}
    </div>
  )
}
