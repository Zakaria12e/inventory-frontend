"use client"
import { useEffect, useState } from "react"
import { Trash2, Edit2, Plus, Search, FolderOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { CategoryModal } from "./category-modal"
import { getIconComponent } from "@/lib/icon-utils"
import { useAuth } from "@/context/AuthContext"
import { useTranslation } from "react-i18next"

interface Category {
  _id: number
  name: string
  description: string
  itemsCount: number
  icon?: string
  iconColor?: string
}

interface Item {
  _id: number
  name: string
  categoryId: number
  stock: number
}

export default function CategoriesPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const isEmploye = user?.role === "employe"

  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const API_URL = import.meta.env.VITE_API_URL
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchCategories()
    fetchItems()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setCategories(data)
    } catch {
      toast.error(t("categoriesPage.fetchError"))
    } finally {
      setLoading(false)
    }
  }

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/items`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setItems(data)
    } catch {
      console.error("Failed to load items")
    }
  }

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

  useEffect(() => { setCurrentPage(1) }, [searchTerm])

  const handleAddCategory = async (data: { name: string; description: string; icon: string; iconColor: string }) => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to add")
      const newCategory = await res.json()
      setCategories([...categories, newCategory])
      setShowModal(false)
      toast.success(t("categoriesPage.addSuccess", { name: data.name }))
    } catch {
      toast.error(t("categoriesPage.addError"))
    }
  }

  const handleEditCategory = async (data: { name: string; description: string; icon: string; iconColor: string }) => {
    if (!editingCategory) return
    try {
      const res = await fetch(`${API_URL}/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update")
      const updatedCategory = await res.json()
      setCategories(categories.map((cat) => (cat._id === updatedCategory._id ? updatedCategory : cat)))
      setEditingCategory(null)
      setShowModal(false)
      toast.success(t("categoriesPage.updateSuccess", { name: data.name }))
    } catch {
      toast.error(t("categoriesPage.updateError"))
    }
  }

  const handleDeleteCategory = async (id: number) => {
    const categoryToDelete = categories.find((cat) => cat._id === id)
    const categoryItems = items.filter((item) => item.categoryId === id)

    if (categoryItems.length > 0) {
      toast.error(t("categoriesPage.deleteErrorWithItems", { count: categoryItems.length }))
      return
    }

    try {
      setDeleting(true)
      const res = await fetch(`${API_URL}/categories/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error("Failed to delete")
      setCategories(categories.filter((cat) => cat._id !== id))
      setDeletingId(null)
      toast.success(t("categoriesPage.deleteSuccess", { name: categoryToDelete?.name }))
    } catch {
      toast.error(t("categoriesPage.deleteError"))
    } finally {
      setDeleting(false)
    }
  }

  const handleModalClose = (open: boolean) => {
    setShowModal(open)
    if (!open) setEditingCategory(null)
  }

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      purple: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      orange: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
      pink: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
      cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
      amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      rose: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
      red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      green: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
      indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
      teal: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
      lime: "bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300",
      sky: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
      violet: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
      slate: "bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("categoriesPage.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("categoriesPage.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Search & Add */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("categoriesPage.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-background"
          />
        </div>
        {!isEmploye && (
          <Button
            onClick={() => { setEditingCategory(null); setShowModal(true) }}
            size="sm"
            className="gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {t("categoriesPage.addButton")}
          </Button>
        )}
      </div>

      {/* Table / Empty state */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{t("categoriesPage.noCategories")}</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {searchTerm ? t("categoriesPage.noResults") : t("categoriesPage.getStarted")}
          </p>
          {!isEmploye && !searchTerm && (
            <Button onClick={() => { setEditingCategory(null); setShowModal(true) }} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              {t("categoriesPage.addButton")}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border">
            <Table className="w-full text-sm">
              <TableHeader className="bg-muted text-xs text-muted-foreground sm:text-sm">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left">{t("categoriesPage.table.name")}</TableHead>
                  <TableHead className="px-4 py-3 text-left hidden md:table-cell">{t("categoriesPage.table.description")}</TableHead>
                  <TableHead className="px-4 py-3 text-left">{t("categoriesPage.table.items")}</TableHead>
                  {!isEmploye && (
                    <TableHead className="px-10 py-3 text-right">{t("categoriesPage.table.actions")}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCategories.map((category) => {
                  const IconComponent = getIconComponent(category.icon || "Package")
                  const colorClass = getColorClass(category.iconColor || "blue")
                  return (
                    <TableRow key={category._id} className="border-b">
                      <TableCell className="px-6 py-3 flex items-center gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-md ${colorClass} flex items-center justify-center flex-shrink-0`}>
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                          </div>
                          <div className="font-medium text-foreground">{category.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 flex items-center gap-2 hidden md:table-cell">
                        <div className="text-sm text-muted-foreground line-clamp-2">{category.description || "—"}</div>
                      </TableCell>
                      <TableCell className="px-4 py-3 flex items-center gap-2 text-center">
                        <Badge variant="secondary" className="font-medium text-xs">{category.itemsCount}</Badge>
                      </TableCell>
                      {!isEmploye && (
                        <TableCell className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => { setEditingCategory(category); setShowModal(true) }}
                              title={t("categoriesPage.edit")}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeletingId(category._id)}
                              title={t("categoriesPage.delete")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {t("categoriesPage.pagination.showing", { start: startIndex + 1, end: Math.min(endIndex, filteredCategories.length), total: filteredCategories.length })}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 px-3 text-sm">
                  <span className="font-medium">{currentPage}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{totalPages}</span>
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <CategoryModal
        open={showModal}
        onOpenChange={handleModalClose}
        onSave={editingCategory ? handleEditCategory : handleAddCategory}
        initialData={editingCategory ? { name: editingCategory.name, description: editingCategory.description, icon: editingCategory.icon, iconColor: editingCategory.iconColor } : undefined}
        isEditing={!!editingCategory}
      />

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("categoriesPage.delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("categoriesPage.deleteConfirm", { name: categories.find((c) => c._id === deletingId)?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{t("categoriesPage.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && handleDeleteCategory(deletingId)} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? t("categoriesPage.deleting") : t("categoriesPage.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}