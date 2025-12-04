"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Folder, AlertTriangle, DollarSign, TrendingUp, Clock } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area } from "recharts"
import { Separator } from "@/components/ui/separator"

export default function DashboardPage() {
  const [items, setItems] = useState([
    { id: 1, name: "Cement", category: "Materials", stock: 40, price: 50 },
    { id: 2, name: "Pipe", category: "Plumbing", stock: 8, price: 20 },
    { id: 3, name: "Sand", category: "Materials", stock: 90, price: 10 },
    { id: 4, name: "Cable", category: "Electrical", stock: 4, price: 15 },
  ])

  const [categories, setCategories] = useState([
    { id: 1, name: "Materials" },
    { id: 2, name: "Plumbing" },
    { id: 3, name: "Electrical" },
  ])

  const [alerts, setAlerts] = useState([
    { id: 1, message: "Low stock: Cable (4 units left)", date: "2025-11-01", type: "warning" },
    { id: 2, message: "Low stock: Pipe (8 units left)", date: "2025-10-30", type: "warning" },
    { id: 3, message: "New item added: Cement", date: "2025-10-29", type: "info" },
    { id: 4, message: "Category deleted: Tools", date: "2025-10-28", type: "info" },
  ])

  const totalValue = items.reduce((sum, item) => sum + item.stock * item.price, 0)
  const lowStockCount = items.filter((i) => i.stock < 10).length
  const totalStock = items.reduce((sum, item) => sum + item.stock, 0)

  // Prepare data for category chart
  const chartData = categories.map((cat) => ({
    name: cat.name,
    stock: items.filter((i) => i.category === cat.name).reduce((sum, i) => sum + i.stock, 0),
    value: items.filter((i) => i.category === cat.name).reduce((sum, i) => sum + i.stock * i.price, 0),
  }))

  // Mock trend data for value over time
  const trendData = [
    { month: "Jul", value: 2800 },
    { month: "Aug", value: 3200 },
    { month: "Sep", value: 3600 },
    { month: "Oct", value: 4100 },
    { month: "Nov", value: 4500 },
  ]

  const getAlertIcon = (type : any) => {
    if (type === "warning") return "⚠️"
    return "ℹ️"
  }

  const formatDate = (dateString : any) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return dateString
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header with metrics summary */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of your inventory health</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <div className="p-2 rounded-md bg-muted">
              <Package className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{items.length}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">{totalStock} total units</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <div className="p-2 rounded-md bg-muted">
              <Folder className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categories.length}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Active classifications</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-destructive/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <div className="p-2 rounded-md bg-destructive/10">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lowStockCount}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Items need attention</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <div className="p-2 rounded-md bg-muted">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalValue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs text-muted-foreground">+12% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Stock Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stock Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Units per category</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="stock" 
                  radius={[6, 6, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Value Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory Value Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Last 5 months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} className="text-primary" />
                    <stop offset="95%" stopColor="currentColor" stopOpacity={0} className="text-primary" />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value) => [`$${value}`, 'Value']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="currentColor"
                  strokeWidth={2}
                  fill="url(#valueGradient)"
                  className="text-primary"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Latest changes to inventory</p>
              </div>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-muted mt-0.5">
                <span className="text-sm">➕</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New item added</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Cement</span> added to Materials category
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-muted mt-0.5">
                <span className="text-sm">✏️</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Category updated</p>
                <p className="text-sm text-muted-foreground">
                  Modified <span className="font-medium text-foreground">Plumbing</span> category details
                </p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-muted mt-0.5">
                <span className="text-sm">🗑️</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Item removed</p>
                <p className="text-sm text-muted-foreground">
                  Deleted <span className="font-medium text-foreground">Old tools</span> from inventory
                </p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">System Alerts</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Important notifications</p>
              </div>
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.slice(0, 3).map((alert, index) => (
              <div key={alert.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-md mt-0.5 ${
                    alert.type === 'warning' ? 'bg-destructive/10' : 'bg-muted'
                  }`}>
                    <span className="text-sm">{getAlertIcon(alert.type)}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(alert.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}