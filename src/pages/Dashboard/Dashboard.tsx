"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Folder, AlertTriangle, Clock } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const API_URL = import.meta.env.VITE_API_URL

export default function DashboardPage() {
  const { t } = useTranslation()
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")

    axios
      .get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDashboard(res.data))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return t("dashboard.today")
    if (diff === 1) return t("dashboard.yesterday")
    if (diff < 7) return t("dashboard.daysAgo", { count: diff })
    return new Date(date).toLocaleDateString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full"
    >
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.description")}</p>
      </div>

      {/* METRICS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title={t("dashboard.totalItems")}
              value={dashboard.stats.totalItems}
              subtitle={`${dashboard.stats.totalQuantity} ${t("dashboard.units")}`}
              icon={<Package />}
            />
            <MetricCard
              title={t("dashboard.categories")}
              value={dashboard.charts.stockByCategory.length}
              subtitle={t("dashboard.activeCategories")}
              icon={<Folder />}
            />
            <MetricCard
              title={t("dashboard.lowStock")}
              value={dashboard.stats.lowStockCount}
              subtitle={t("dashboard.needAttention")}
              icon={<AlertTriangle className="text-destructive" />}
              danger
            />
          </>
        )}
      </div>

      {/* CHARTS */}
      <div className="grid gap-4 lg:grid-cols-2">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.stockDistribution")}</CardTitle>
                <p className="text-sm text-muted-foreground">{t("dashboard.unitsPerCategory")}</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer height={280}>
                  <BarChart data={dashboard.charts.stockByCategory}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stock" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.stockTrend")}</CardTitle>
                <p className="text-sm text-muted-foreground">{t("dashboard.evolution")}</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer height={280}>
                  <AreaChart data={dashboard.charts.stockByCategory}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Area dataKey="stock" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* PANELS */}
      <div className="grid gap-4 lg:grid-cols-2">
        {loading ? (
          <>
            <PanelSkeleton />
            <PanelSkeleton />
          </>
        ) : (
          <>
            {/* ACTIVITY */}
            <Card>
              <CardHeader className="flex justify-between">
                <div>
                  <CardTitle>{t("dashboard.activity")}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t("dashboard.latestActions")}</p>
                </div>
                <Clock className="w-4 h-4" />
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboard.panels.activities.map((a: any, i: number) => (
                  <div key={a._id}>
                    {i > 0 && <Separator />}
                    <p className="text-sm">
                      <span className="font-medium">{a.user?.name}</span> {a.action}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ALERTS */}
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.alerts")}</CardTitle>
                <p className="text-sm text-muted-foreground">{t("dashboard.notifications")}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboard.panels.alerts.map((a: any, i: number) => (
                  <div key={a._id}>
                    {i > 0 && <Separator />}
                    <p className="text-sm font-medium">{a.message}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </motion.div>
  )
}

/* ================= COMPONENTS ================= */

function MetricCard({ title, value, subtitle, icon, danger }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className={danger ? "border-destructive/50" : ""}>
        <CardHeader className="flex justify-between items-center pb-2">
          <CardTitle className="text-sm">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function MetricSkeleton() {
  return (
    <Card>
      <CardHeader className="flex justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded-md" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-40 mb-2" />
        <Skeleton className="h-3 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

function PanelSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
