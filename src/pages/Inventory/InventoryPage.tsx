"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Plus, Search } from "lucide-react"
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
  const { user } = useAuth() // get current logged-in user
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
  const token = localStorage.getItem("token");
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
        headers: { "Content-Type": "application/json" ,
         Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ ...itemData, category: itemData.categoryId }),
      })
      if (!res.ok) throw new Error("Failed to add item")
      const newItem = await res.json()
      const categoryObj = categories.find((c) => c.id === newItem.category)
      setItems([
        ...items,
        { ...newItem, id: newItem._id, categoryId: newItem.category, category: categoryObj },
      ])
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
        headers: { "Content-Type": "application/json" ,
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
            : item
        )
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
      const res = await fetch(`${API_URL}/items/${id}`, { method: "DELETE" ,
          headers: {
            Authorization: `Bearer ${token}`,
  },})
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
        (categoryFilter === "all" || item.categoryId === categoryFilter)
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "quantity") return a.quantity - b.quantity
      return 0
    })

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="flex flex-col gap-4 p-3 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">Inventory Items</h1>
          <p className="text-sm text-muted-foreground">Manage your inventory items and stock levels</p>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
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
                <SelectTrigger className="w-full sm:w-48">
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
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </Button>
              )}
            </div>

            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Quantity</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    {!isEmploye && <th className="px-4 py-3 text-right font-semibold">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={isEmploye ? 4 : 5} className="px-4 py-8 text-center text-muted-foreground">
                        No items found. Create your first item.
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item) => {
                      const isLowStock = item.quantity <= item.lowStockThreshold
                      return (
                        <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-foreground">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{item.category?.name  || "Unknown"}</td>
                          <td className="px-4 py-3">
                            <span className={isLowStock ? "text-red-500 font-semibold" : ""}>
                              {item.quantity} {item.unit}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {isLowStock ? (
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border-red-500/20">
                                Low Stock
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border-green-500/20">
                                In Stock
                              </span>
                            )}
                          </td>
                          {!isEmploye && (
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setShowModal(true) }}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setDeletingId(item.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} items
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)}>
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
          <AlertDialogDescription>Are you sure you want to delete this item? This action cannot be undone.</AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && handleDeleteItem(deletingId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}