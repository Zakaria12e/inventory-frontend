"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Search, 
  Bell, 
  AlertCircle, 
  Package, 
  CheckCircle2, 
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL
const token = localStorage.getItem("token")

interface AlertData {
  _id: string
  productName: string
  message: string
  seen: boolean
  createdAt: string
}

export default function AlertsPage() {
  const [search, setSearch] = useState("")
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [selected, setSelected] = useState<AlertData | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "new" | "seen">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setAlerts(res.data)
    } catch (err) {
      toast.error("Failed to fetch alerts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const handleOpenAlert = async (alert: AlertData) => {
    setSelected(alert)
    setModalOpen(true)

    if (!alert.seen) {
      try {
        await axios.patch(`${API_URL}/alerts/${alert._id}/seen`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setAlerts((prev) =>
          prev.map((a) => (a._id === alert._id ? { ...a, seen: true } : a))
        )
      } catch {
        toast.error("Failed to update alert")
      }
    }
  }

  const markAllAsSeen = async () => {
    try {
      const unseenIds = alerts.filter(a => !a.seen).map(a => a._id)
      if (unseenIds.length === 0) {
        toast.info("All alerts are already marked as seen")
        return
      }

      await Promise.all(
        unseenIds.map(id =>
          axios.patch(`${API_URL}/alerts/${id}/seen`, null, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      )

      setAlerts((prev) => prev.map((a) => ({ ...a, seen: true })))
      toast.success("All alerts marked as seen")
    } catch {
      toast.error("Failed to mark alerts as seen")
    }
  }

  const filtered = alerts.filter((a) => {
    const matchesSearch =
      a.message.toLowerCase().includes(search.toLowerCase()) ||
      a.productName?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "new" && !a.seen) ||
      (filterStatus === "seen" && a.seen)

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAlerts = filtered.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterStatus])

  const unseenCount = alerts.filter((a) => !a.seen).length

  const clearFilters = () => {
    setSearch("")
    setFilterStatus("all")
  }

  const hasActiveFilters = search || filterStatus !== "all"

  const getAlertIcon = (message: string) => {
    if (message.toLowerCase().includes("low stock") || message.toLowerCase().includes("out of stock")) {
      return <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
    }
    if (message.toLowerCase().includes("added") || message.toLowerCase().includes("created")) {
      return <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
    }
    return <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Alerts Center</h1>
          {unseenCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unseenCount} New
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor and manage all system alerts and notifications
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg">All Alerts</CardTitle>
                <CardDescription>
                  {filtered.length} {filtered.length === 1 ? "alert" : "alerts"} found
                </CardDescription>
              </div>
              {unseenCount > 0 && (
                <Button
                  onClick={markAllAsSeen}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark All as Seen
                </Button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts by product or message..."
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                <SelectTrigger className="w-full sm:w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="seen">Seen</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1 h-9"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Alerts Grid */}
          {loading ? (
            <div className="grid gap-2 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No alerts found</h3>
              <p className="text-sm text-muted-foreground">
                {hasActiveFilters
                  ? "Try adjusting your filters"
                  : "You're all caught up! No alerts at the moment."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-2 md:grid-cols-2">
                {paginatedAlerts.map((alert) => (
                  <div
                    key={alert._id}
                    onClick={() => handleOpenAlert(alert)}
                    className={`group relative p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      !alert.seen
                        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-0.5 shrink-0">{getAlertIcon(alert.message)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">
                              {alert.productName}
                            </h3>
                            {!alert.seen && (
                              <Badge variant="default" className="text-xs px-1.5 py-0">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(alert.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                      <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of{" "}
                      {filtered.length}
                    </span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value))
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1 px-2">
                      <span className="text-sm font-medium">{currentPage}</span>
                      <span className="text-sm text-muted-foreground">of {totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selected && getAlertIcon(selected.message)}
              {selected?.productName}
            </DialogTitle>
            <DialogDescription>
              {selected && (
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(selected.createdAt).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed">{selected?.message}</p>
            </div>

            {selected && (
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Badge variant={selected.seen ? "secondary" : "default"}>
                    {selected.seen ? "Seen" : "New"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}