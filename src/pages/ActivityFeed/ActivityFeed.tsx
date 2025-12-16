"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Calendar,
  Package,
  Trash2,
  CheckCircle2,
  Clock,
  Activity as ActivityIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type Activity = {
  id: string;
  user?: {
    _id: string;
    first_name: string;
    email: string;
    avatarColor: string;
    profile_image?: string;
    role: string;
  };
  action: string;
  timestamp: string;
  date: Date;
};

export default function ActivityFeed() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/activities`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setActivities(
            data.data.map((act: any) => ({
              id: act._id,
              user: act.user,
              action: act.action,
              timestamp: new Date(act.timestamp).toLocaleString(),
              date: new Date(act.timestamp),
            }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const colorMap: Record<string, string> = {
    "bg-red-500": "#ef4444",
    "bg-green-500": "#22c55e",
    "bg-blue-500": "#3b82f6",
    "bg-yellow-500": "#eab308",
    "bg-purple-500": "#8b5cf6",
    "bg-pink-500": "#ec4899",
    "bg-orange-500": "#f97316",
  };

  const filteredAndSortedActivities = useMemo(() => {
    let filtered = activities.filter((activity) => {
      const userName = activity.user?.first_name || "";
      const userRole = activity.user?.role || "";

      const matchesSearch =
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userRole.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate = dateFilter
        ? activity.date.toISOString().split("T")[0] === dateFilter
        : true;

      return matchesSearch && matchesDate;
    });

    return filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.date.getTime() - b.date.getTime();
      }
      return b.date.getTime() - a.date.getTime();
    });
  }, [activities, searchQuery, sortOrder, dateFilter]);

  const totalPages = Math.ceil(filteredAndSortedActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = filteredAndSortedActivities.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFilter, sortOrder]);

  const getIcon = (action: string) => {
    if (action.toLowerCase().includes("added") || action.toLowerCase().includes("created"))
      return <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    if (action.toLowerCase().includes("deleted") || action.toLowerCase().includes("removed"))
      return <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    if (action.toLowerCase().includes("updated") || action.toLowerCase().includes("modified"))
      return <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    return <ActivityIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDateFilter("");
    setSortOrder("desc");
  };

  const hasActiveFilters = searchQuery || dateFilter || sortOrder !== "desc";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section */}
      <div className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-sm bg-background/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">{t("activityFeed.title")}</h1>
            </div>
            <p className="text-sm text-muted-foreground">{t("activityFeed.description")}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Card */}
        <Card className="mb-8 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">{t("activityFeed.filterTitle")}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={t("activityFeed.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-sm"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-9 h-10 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
                  <SelectTrigger className="h-10 text-sm flex-1">
                    <SelectValue placeholder={t("activityFeed.sortLabel")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">{t("activityFeed.sort.newest")}</SelectItem>
                    <SelectItem value="asc">{t("activityFeed.sort.oldest")}</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1 h-10 bg-transparent">
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("activityFeed.clear")}</span>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                      {t("activityFeed.user")}
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                      {t("activityFeed.role")}
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                      {t("activityFeed.action")}
                    </th>
                    <th className="px-6 py-4 text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                      {t("activityFeed.dateTime")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-5 w-16" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-full max-w-xs" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-32 ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : paginatedActivities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="rounded-full bg-muted p-3">
                            <Clock className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="font-medium">{t("activityFeed.noActivities")}</p>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            {hasActiveFilters ? t("activityFeed.tryFilters") : t("activityFeed.empty")}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={`${activity.user?.profile_image}`} alt={activity.user?.first_name} />
                              <AvatarFallback
                                style={{
                                  backgroundColor: colorMap[activity.user?.avatarColor || "bg-blue-500"],
                                  color: "white",
                                }}
                              >
                                {activity.user?.first_name?.charAt(0).toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {activity.user?.first_name || t("activityFeed.unknownUser")}
                              </span>
                              <span className="text-xs text-muted-foreground">{activity.user?.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="text-xs capitalize font-medium">
                            {activity.user?.role || "N/A"}
                          </Badge>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="shrink-0">{getIcon(activity.action)}</div>
                            <span className="text-muted-foreground line-clamp-2">{activity.action}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right text-muted-foreground text-xs whitespace-nowrap">
                          {activity.timestamp}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Tablet & Mobile Card View */}
        <div className="lg:hidden space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-border/50 shadow-sm">
                <CardContent className="p-2">
                  <div className="flex items-start gap-2">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-2 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : paginatedActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-semibold text-center text-foreground">{t("activityFeed.noActivities")}</p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                {hasActiveFilters
                  ? t("activityFeed.tryFilters")
                  : t("activityFeed.empty")}
              </p>
            </div>
          ) : (
            paginatedActivities.map((activity) => (
              <Card key={activity.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-2 sm:p-3">
                  {/* Top Row - User & Role */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Avatar className="w-9 h-9 shrink-0">
                        <AvatarImage src={activity.user?.profile_image || undefined} alt={activity.user?.first_name} />
                        <AvatarFallback
                          style={{
                            backgroundColor: colorMap[activity.user?.avatarColor || "bg-blue-500"],
                            color: "white",
                          }}
                        >
                          {activity.user?.first_name?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground text-xs">
                          {activity.user?.first_name || t("activityFeed.unknownUser")}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">{activity.user?.email}</span>
                      </div>
                    </div>

                    <Badge variant="secondary" className="text-xs capitalize font-medium shrink-0">
                      {activity.user?.role}
                    </Badge>
                  </div>

                  {/* Action */}
                  <div className="flex items-start gap-2 mb-2 pb-2 border-b border-border/30">
                    <div className="shrink-0 mt-0.5">{getIcon(activity.action)}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{activity.action}</p>
                  </div>

                  {/* Date - Bottom */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{activity.timestamp}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border/30">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{startIndex + 1}</span>-
                <span className="font-semibold text-foreground">
                  {Math.min(endIndex, filteredAndSortedActivities.length)}
                </span>{" "}
                of <span className="font-semibold text-foreground">{filteredAndSortedActivities.length}</span>
              </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-9 w-[75px] text-xs">
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

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-transparent"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 px-3 text-sm">
                <span className="font-medium">{currentPage}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-transparent"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}