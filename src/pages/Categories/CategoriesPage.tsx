"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Plus, Search, FolderOpen, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const demoCategories: Category[] = [
        { id: 1, name: "Electronics", description: "Electronic devices and accessories", itemsCount: 45 },
        { id: 2, name: "Clothing", description: "Apparel and fashion items", itemsCount: 128 },
        { id: 3, name: "Books", description: "Physical and digital books", itemsCount: 87 },
        { id: 4, name: "Furniture", description: "Home and office furniture", itemsCount: 23 },
        { id: 5, name: "Sports Equipment", description: "Athletic and sports gear", itemsCount: 56 },
        { id: 6, name: "Food & Beverages", description: "Groceries and beverages", itemsCount: 234 },
      ]
      setCategories(demoCategories)
      setLoading(false)
    }, 500)
  }, [])

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
    const newCategory: Category = {
      id: Math.max(...categories.map((c) => c.id), 0) + 1,
      name,
      description,
      itemsCount: 0,
    }
    setCategories([...categories, newCategory])
    setShowModal(false)
    toast.success(`Category "${name}" created successfully`)
  }

  const handleEditCategory = async (name: string, description: string) => {
    if (!editingCategory) return
    const updatedCategory = { ...editingCategory, name, description }
    setCategories(categories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)))
    setEditingCategory(null)
    setShowModal(false)
    toast.success(`Category "${name}" updated successfully`)
  }

  const handleDeleteCategory = async (id: number) => {
    const categoryToDelete = categories.find((cat) => cat.id === id)
    try {
      setDeleting(true)
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
    <div className="flex flex-col gap-4 p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full min-h-screen">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Categories</h1>
        </div>
        <p className="text-sm text-muted-foreground">Manage your inventory categories efficiently</p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            {!isEmploye && (
              <Button
                onClick={() => {
                  setEditingCategory(null)
                  setShowModal(true)
                }}
                size="sm"
                className="gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Category</span>
                <span className="sm:hidden">Add</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="grid gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full md:h-16" />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <FolderOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1 text-sm md:text-base">No categories found</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first category"}
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
              <div className="grid gap-2 sm:gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {paginatedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col gap-2 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="font-semibold text-sm md:text-base truncate flex-1">{category.name}</h3>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 flex-shrink-0">
                          {category.itemsCount}
                        </Badge>
                      </div>
                      {category.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
                      )}
                    </div>

                    {!isEmploye && (
                      <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-1 sm:flex-none"
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
                          className="h-8 w-8 flex-1 sm:flex-none"
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

              {totalPages > 1 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-muted-foreground">
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
                      <SelectTrigger className="h-8 w-[70px] text-xs">
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

                  <div className="flex items-center justify-between gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1 px-2 text-xs sm:text-sm">
                      <span className="font-medium">{currentPage}</span>
                      <span className="text-muted-foreground">of {totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
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

      <CategoryModal
        open={showModal}
        onOpenChange={handleModalClose}
        onSave={editingCategory ? handleEditCategory : handleAddCategory}
        initialData={
          editingCategory ? { name: editingCategory.name, description: editingCategory.description } : undefined
        }
        isEditing={!!editingCategory}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="w-[90vw] sm:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categories.find((c) => c.id === deletingId)?.name}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
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
