"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Plus, Search, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ItemModal } from "./item-modal"
import { useAuth } from "@/context/AuthContext"
import { useTranslation } from "react-i18next"

interface Item {
  id: string
  name: string
  description: string
  quantity: number
  unit: "pcs" | "kg" | "L" | "pack"
  categoryId: string
  category?: { id: string; name: string }
  lowStockThreshold: number
}

interface Category {
  id: string
  name: string
}

export default function InventoryPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<"name" | "quantity">("name")

  const API_URL = import.meta.env.VITE_API_URL
  const token = localStorage.getItem("token")
  const itemsPerPage = 10
  const isEmploye = user?.role === "employe"

  // Load categories
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        const validCategories = data
          .filter((cat: any) => cat?._id && cat?.name)
          .map((cat: any) => ({ id: cat._id, name: cat.name }))
        setCategories(validCategories)
      })
      .catch(() => toast.error(t("inventory.failedLoadCategories")))
  }, [t])

  // Load items
  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/items`)
      if (!res.ok) throw new Error(t("inventory.failedFetchItems"))
      const data = await res.json()
      const mappedItems: Item[] = data.map((item: any) => ({
        id: item._id,
        name: item.name,
        description: item.description || "",
        quantity: item.quantity,
        unit: item.unit || "pcs",
        categoryId: item.category._id,
        category: { id: item.category._id, name: item.category.name },
        lowStockThreshold: item.lowStockThreshold || 5,
      }))
      setItems(mappedItems)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || t("inventory.failedFetchItems"))
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // Add item
  const handleAddItem = async (itemData: Omit<Item, "id">) => {
    try {
      const res = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...itemData, category: itemData.categoryId }),
      })
      if (!res.ok) throw new Error(t("inventory.failedAddItem"))
      const newItem = await res.json()
      const categoryObj = categories.find((c) => c.id === newItem.category)
      setItems([...items, { ...newItem, id: newItem._id, categoryId: newItem.category, category: categoryObj }])
      setShowModal(false)
      toast.success(t("inventory.itemAdded", { name: newItem.name }))
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || t("inventory.failedAddItem"))
    }
  }

  // Edit item
  const handleEditItem = async (itemData: Omit<Item, "id">) => {
    if (!editingItem) return
    try {
      const res = await fetch(`${API_URL}/items/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...itemData, category: itemData.categoryId }),
      })
      if (!res.ok) throw new Error(t("inventory.failedUpdateItem"))
      const updatedItem = await res.json()
      const categoryObj = categories.find((c) => c.id === itemData.categoryId)
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...updatedItem, categoryId: itemData.categoryId, category: categoryObj }
            : item,
        ),
      )
      setEditingItem(null)
      setShowModal(false)
      toast.success(t("inventory.itemUpdated", { name: updatedItem.name }))
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || t("inventory.failedUpdateItem"))
    }
  }

  // Delete item
  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(t("inventory.failedDeleteItem"))
      setItems(items.filter((item) => item.id !== id))
      setDeletingId(null)
      toast.success(t("inventory.itemDeleted"))
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || t("inventory.failedDeleteItem"))
    }
  }

  // Filter, sort, paginate
  const filteredItems = items
    .filter(
      (item) =>
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (categoryFilter === "all" || item.categoryId === categoryFilter),
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "quantity") return a.quantity - b.quantity
      return 0
    })

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("inventory.title")}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{t("inventory.description")}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("inventory.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-input h-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 h-10">
                <SelectValue placeholder={t("inventory.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("inventory.allCategories")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-full sm:w-48 h-10">
                <SelectValue placeholder={t("inventory.sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t("inventory.sortByName")}</SelectItem>
                <SelectItem value="quantity">{t("inventory.sortByQuantity")}</SelectItem>
              </SelectContent>
            </Select>

            {!isEmploye && (
              <Button
                onClick={() => {
                  setEditingItem(null)
                  setShowModal(true)
                }}
                className="gap-2 h-10 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> {t("inventory.addItem")}
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          {paginatedItems.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">{t("inventory.noItems")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 hover:bg-muted/40">
                    <th className="px-6 py-4 text-left font-semibold text-foreground">{t("inventory.table.item")}</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">{t("inventory.table.category")}</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">{t("inventory.table.quantity")}</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">{t("inventory.table.status")}</th>
                    {!isEmploye && <th className="px-6 py-4 text-right font-semibold text-foreground">{t("inventory.table.actions")}</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item, index) => {
                    const isLowStock = item.quantity <= item.lowStockThreshold
                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-border transition-colors hover:bg-muted/30 ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/10"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-foreground">{item.name}</div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{item.category?.name || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${isLowStock ? "text-destructive" : "text-foreground"}`}>
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                              isLowStock
                                ? "bg-destructive/10 text-destructive border border-destructive/20"
                                : "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isLowStock ? "bg-destructive" : "bg-green-500"}`}></span>
                            {isLowStock ? t("inventory.status.lowStock") : t("inventory.status.inStock")}
                          </span>
                        </td>
                        {!isEmploye && (
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingItem(item)
                                  setShowModal(true)
                                }}
                                className="h-8 w-8 p-0 hover:bg-primary/10"
                              >
                                <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingId(item.id)}
                                className="h-8 w-8 p-0 hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile view */}
        <div className="md:hidden grid grid-cols-1 gap-3">
          {paginatedItems.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">{t("inventory.noItems")}</p>
              </CardContent>
            </Card>
          ) : (
            paginatedItems.map((item) => {
              const isLowStock = item.quantity <= item.lowStockThreshold
              return (
                <Card
                  key={item.id}
                  className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-base leading-tight truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.category?.name || t("inventory.uncategorized")}</p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
                          isLowStock
                            ? "bg-destructive/10 text-destructive border border-destructive/20"
                            : "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isLowStock ? "bg-destructive" : "bg-green-500"}`}
                        ></span>
                        {isLowStock ? t("inventory.status.lowStock") : t("inventory.status.inStock")}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <p className="text-xs text-muted-foreground">{t("inventory.table.quantity")}</p>
                        <p className={`font-semibold text-sm ${isLowStock ? "text-destructive" : "text-foreground"}`}>
                          {item.quantity} {item.unit}
                        </p>
                      </div>

                      {!isEmploye && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 bg-transparent"
                            onClick={() => {
                              setEditingItem(item)
                              setShowModal(true)
                            }}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 border-destructive/30 hover:bg-destructive/5 bg-transparent"
                            onClick={() => setDeletingId(item.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              {t("inventory.showing")} <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> {t("inventory.to")}{" "}
              <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> {t("inventory.of")}{" "}
              <span className="font-semibold">{filteredItems.length}</span> {t("inventory.items")}
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                {t("inventory.prev")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                {t("inventory.next")}
              </Button>
            </div>
          </div>
        )}

        {/* Item Modal */}
        <ItemModal
          open={showModal}
          onOpenChange={setShowModal}
          onSave={editingItem ? handleEditItem : handleAddItem}
          categories={categories}
          initialData={editingItem ?? undefined}
          isEditing={!!editingItem}
        />

        {/* Delete Dialog */}
        <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogTitle>{t("inventory.deleteItemTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("inventory.deleteItemDescription")}</AlertDialogDescription>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>{t("inventory.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingId && handleDeleteItem(deletingId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("inventory.delete")}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
