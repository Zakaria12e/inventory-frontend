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

interface Item {
  id: string
  name: string
  description: string
  quantity: number
  unit: "pcs" | "kg" | "L"
  categoryId: string
  category?: { id: string; name: string }
  lowStockThreshold: number
}

interface Category {
  id: string
  name: string
}

export default function InventoryPage() {
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

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        const validCategories = data
          .filter((cat: any) => cat?._id && cat?.name)
          .map((cat: any) => ({ id: cat._id, name: cat.name }))
        setCategories(validCategories)
      })
      .catch(() => toast.error("Failed to load categories"))
  }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/items`)
      if (!res.ok) throw new Error("Failed to fetch items")
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
      toast.error(error.message || "Failed to fetch items.")
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

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
      if (!res.ok) throw new Error("Failed to add item")
      const newItem = await res.json()
      const categoryObj = categories.find((c) => c.id === newItem.category)
      setItems([...items, { ...newItem, id: newItem._id, categoryId: newItem.category, category: categoryObj }])
      setShowModal(false)
      toast.success(`${newItem.name} added.`)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to add item.")
    }
  }

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
      if (!res.ok) throw new Error("Failed to update item")
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
      toast.success(`${updatedItem.name} updated.`)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to update item.")
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to delete item")
      setItems(items.filter((item) => item.id !== id))
      setDeletingId(null)
      toast.success("Item deleted.")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to delete item.")
    }
  }

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
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
          </div>
          <p className="text-sm text-muted-foreground">Manage and track your inventory items efficiently</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search items by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-input h-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 h-10">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-full sm:w-48 h-10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="quantity">Sort by Quantity</SelectItem>
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
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            )}
          </div>
        </div>

        <div className="hidden md:block">
          {paginatedItems.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No items found. Create your first item to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 hover:bg-muted/40">
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Item</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Category</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Quantity</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                    {!isEmploye && <th className="px-6 py-4 text-right font-semibold text-foreground">Actions</th>}
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
                          {isLowStock ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                              <span className="w-2 h-2 rounded-full bg-destructive"></span>
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              In Stock
                            </span>
                          )}
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

        <div className="md:hidden grid grid-cols-1 gap-3">
          {paginatedItems.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">No items found yet</p>
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
                        <p className="text-xs text-muted-foreground mt-1">{item.category?.name || "Uncategorized"}</p>
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
                        {isLowStock ? "Low" : "In Stock"}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <p className="text-xs text-muted-foreground">Quantity</p>
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

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> of{" "}
              <span className="font-semibold">{filteredItems.length}</span> items
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number
                  if (totalPages <= 5) {
                    page = i + 1
                  } else if (currentPage <= 3) {
                    page = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i
                  } else {
                    page = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <ItemModal
        open={showModal}
        onOpenChange={setShowModal}
        onSave={editingItem ? handleEditItem : handleAddItem}
        categories={categories}
        initialData={editingItem ?? undefined}
        isEditing={!!editingItem}
      />

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDeleteItem(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
