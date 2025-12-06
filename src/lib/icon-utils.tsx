import {
  Package,
  Zap,
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
  Shirt,
  Book,
  Briefcase,
  Gauge,
  Cpu,
  BarChart3,
  type LucideIcon,
} from "lucide-react"

import { OilIcon } from "@/components/icons/OilIcon"
import { TubeIcon } from "@/components/icons/TubeIcon"
import {GasCylinderIcon} from "@/components/icons/GasCylinderIcon"

const ICON_MAP: Record<string, React.ElementType> = {
  Package,
  Zap,
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
  Shirt,
  Book,
  Briefcase,
  Gauge,
  Cpu,
  BarChart3,
  Oil: OilIcon,
  Tube: TubeIcon,
  GasCylinder: GasCylinderIcon,
}

export const COLORS = [
  { name: "red", value: "#ef4444" },
  { name: "orange", value: "#f97316" },
  { name: "amber", value: "#eab308" },
  { name: "yellow", value: "#eab308" },
  { name: "lime", value: "#84cc16" },
  { name: "green", value: "#22c55e" },
  { name: "emerald", value: "#10b981" },
  { name: "teal", value: "#14b8a6" },
  { name: "cyan", value: "#06b6d4" },
  { name: "blue", value: "#3b82f6" },
  { name: "indigo", value: "#6366f1" },
  { name: "violet", value: "#7c3aed" },
  { name: "purple", value: "#a855f7" },
  { name: "pink", value: "#ec4899" },
  { name: "rose", value: "#f43f5e" },
  { name: "gray", value: "#6b7280" },
]

export function getIconComponent(iconName: string): LucideIcon {
  return (ICON_MAP[iconName] || Package) as LucideIcon
}
