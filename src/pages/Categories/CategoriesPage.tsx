"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Plus, Search, FolderOpen, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { CategoryModal } from "./category-modal"
import { useAuth } from "@/context/AuthContext"

interface Category {
  id: number
  name: string
  description: string
  itemsCount: number
}

interface Item {
  id: number
  name: string
  categoryId: number
  stock: number
}

export default function CategoriesPage() {
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error("Failed to load items")
    }
  }

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleAddCategory = async (name: string, description: string) => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      })
      if (!res.ok) throw new Error("Failed to add")
      const newCategory = await res.json()
      setCategories([...categories, newCategory])
      setShowModal(false)
      toast.success(`Category "${name}" created successfully`)
    } catch {
      toast.error("Failed to add category")
    }
  }

  const handleEditCategory = async (name: string, description: string) => {
    if (!editingCategory) return
    try {
      const res = await fetch(`${API_URL}/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      })
      if (!res.ok) throw new Error("Failed to update")
      const updatedCategory = await res.json()
      setCategories(categories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)))
      setEditingCategory(null)
      setShowModal(false)
      toast.success(`Category "${name}" updated successfully`)
    } catch {
      toast.error("Failed to update category")
    }
  }

  const handleDeleteCategory = async (id: number) => {
    const categoryToDelete = categories.find((cat) => cat.id === id)
    const categoryItems = items.filter((item) => item.categoryId === id)

    if (categoryItems.length > 0) {
      toast.error(`Cannot delete category with ${categoryItems.length} item(s). Remove items first.`)
      return
    }

    try {
      setDeleting(true)
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to delete")
      setCategories(categories.filter((cat) => cat.id !== id))
      setDeletingId(null)
      toast.success(`Category "${categoryToDelete?.name}" deleted successfully`)
    } catch {
      toast.error("Failed to delete category")
    } finally {
      setDeleting(false)
    }
  }

  const handleModalClose = (open: boolean) => {
    setShowModal(open)
    if (!open) {
      setEditingCategory(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your inventory categories
        </p>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            {!isEmploye && (
              <Button
                onClick={() => {
                  setEditingCategory(null)
                  setShowModal(true)
                }}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Categories Grid */}
          {loading ? (
            <div className="grid gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <FolderOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No categories found</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first category"}
              </p>
              {!isEmploye && !searchTerm && (
                <Button
                  onClick={() => {
                    setEditingCategory(null)
                    setShowModal(true)
                  }}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Category
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-2 md:grid-cols-2">
                {paginatedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm truncate">{category.name}</h3>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {category.itemsCount}
                        </Badge>
                      </div>
                      {category.description && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {!isEmploye && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingCategory(category)
                            setShowModal(true)
                          }}
                          title="Edit category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDeletingId(category.id)}
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredCategories.length)} of{" "}
                      {filteredCategories.length}
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

      {/* Category Modal */}
      <CategoryModal
        open={showModal}
        onOpenChange={handleModalClose}
        onSave={editingCategory ? handleEditCategory : handleAddCategory}
        initialData={
          editingCategory
            ? { name: editingCategory.name, description: editingCategory.description }
            : undefined
        }
        isEditing={!!editingCategory}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categories.find((c) => c.id === deletingId)?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDeleteCategory(deletingId)}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}