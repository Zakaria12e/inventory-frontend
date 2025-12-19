import { useState } from "react";
import { Plus, Search, QrCode, FileText, PackagePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ContainersPage() {
  const [search, setSearch] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const [openAddItem, setOpenAddItem] = useState(false);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">📦 Containers</h1>
          <p className="text-muted-foreground">
            Centralized container control with full traceability
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <QrCode className="h-4 w-4" /> Scan Container
          </Button>
          <Button className="gap-2" onClick={() => setOpenNew(true)}>
            <Plus className="h-4 w-4" /> New Container
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {["Total Containers", "Active", "Empty", "Total Items"].map((k, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-sm">{k}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {i === 1 ? <span className="text-emerald-500">18</span> : i === 2 ? <span className="text-muted-foreground">6</span> : 24}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-2 max-w-md flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by container number or item"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6m">6m</SelectItem>
            <SelectItem value="12m">12m</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="empty">Empty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((c) => (
          <Card key={c} className="group hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">Container #00{c}</CardTitle>
                <p className="text-xs text-muted-foreground">12m • Created 2025-01-02</p>
              </div>
              <Badge variant={c % 2 === 0 ? "secondary" : "default"}>
                {c % 2 === 0 ? "Empty" : "Active"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span className="font-medium">14</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Quantity</span>
                  <span className="font-medium">320</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition">
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setOpenAddItem(true)}>
                  <PackagePlus className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Container Modal */}
      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Container</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Container Number" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Container Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6m">6 meters</SelectItem>
                <SelectItem value="12m">12 meters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNew(false)}>
              Cancel
            </Button>
            <Button>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog open={openAddItem} onOpenChange={setOpenAddItem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item to Container</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steel">Steel</SelectItem>
                <SelectItem value="hydraulic">Hydraulic Part</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Quantity" />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddItem(false)}>
              Cancel
            </Button>
            <Button>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
