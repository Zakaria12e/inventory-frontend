"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Package, Trash2, CheckCircle2, Clock, Activity as ActivityIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
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
    <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Activity Feed</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor all system activities and changes in real-time
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          {/* Filters */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, action, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              <div className="relative w-full sm:w-44">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
                <SelectTrigger className="w-full sm:w-36 h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
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
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider min-w-[300px]">
                      Action
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-5 w-16" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-32 ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : paginatedActivities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="rounded-full bg-muted p-3">
                            <Clock className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="font-medium">No activities found</p>
                          <p className="text-sm text-muted-foreground">
                            {hasActiveFilters
                              ? "Try adjusting your filters"
                              : "Activities will appear here as users interact with the system"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={activity.user?.profile_image || undefined}
                                alt={activity.user?.first_name}
                              />
                              <AvatarFallback
                                style={{
                                  backgroundColor: colorMap[activity.user?.avatarColor || "bg-blue-500"],
                                  color: "white",
                                }}
                              >
                                {activity.user?.first_name?.charAt(0).toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight">
                              <span className="font-medium">
                                {activity.user?.first_name || "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {activity.user?.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs capitalize">
                            {activity.user?.role || "N/A"}
                          </Badge>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="shrink-0">{getIcon(activity.action)}</div>
                            <span className="text-muted-foreground">{activity.action}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right text-muted-foreground text-xs whitespace-nowrap">
                          {activity.timestamp}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View - Hidden on desktop */}
{/* Mobile Card View - Hidden on desktop */}
<div className="md:hidden space-y-3">
  {loading ? (
    Array.from({ length: 5 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))
  ) : paginatedActivities.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-3 mb-3">
        <Clock className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="font-medium text-center">No activities found</p>
      <p className="text-sm text-muted-foreground text-center mt-1">
        {hasActiveFilters
          ? "Try adjusting your filters"
          : "Activities will appear here as users interact with the system"}
      </p>
    </div>
  ) : (
    paginatedActivities.map((activity) => (
      <Card key={activity.id} className="transition-colors">
        <CardContent className="p-4 space-y-3">

          {/* Top Row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage
                  src={activity.user?.profile_image || undefined}
                  alt={activity.user?.first_name}
                />
                <AvatarFallback
                  style={{
                    backgroundColor: colorMap[activity.user?.avatarColor || "bg-blue-500"],
                    color: "white",
                  }}
                >
                  {activity.user?.first_name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col leading-tight">
                <span className="font-medium text-sm">
                  {activity.user?.first_name || "Unknown User"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {activity.user?.email}
                </span>
              </div>
            </div>

            <Badge variant="outline" className="text-xs capitalize">
              {activity.user?.role || "N/A"}
            </Badge>
          </div>

          {/* Action */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 shrink-0">
              {getIcon(activity.action)}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {activity.action}
            </p>
          </div>

          {/* Date bottom-right */}
          <div className="flex justify-end text-xs text-muted-foreground gap-1">
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedActivities.length)} of{" "}
                  {filteredAndSortedActivities.length}
                </span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
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
        </CardContent>
      </Card>
    </div>
  );
}