"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingCart, Users, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Download, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface DashboardData {
  kpis: {
    totalRevenue: number
    avgOrderValue: number
    conversionRate: number
    newCustomers: number
  }
  revenueData: Array<{ month: string; revenue: number }>
  customerSegmentation: {
    newCustomers: number
    returningCustomers: number
    highValueCustomers: number
  }
  topProducts: Array<{ name: string; sales: number; revenue: number }>
  categoryData: Array<{ name: string; value: number; color: string }>
  inventory: {
    totalValue: number
    lowStockProducts: Array<{ name: string; stock: number }>
  }
}

// Dashboard Export Dialog Component
const DashboardExportDialog = ({ dashboardData, open, onOpenChange }: { dashboardData: DashboardData, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateReport = (period: string) => {
    setIsGenerating(true)
    setTimeout(() => {
      downloadDashboardReport(period)
      setIsGenerating(false)
      onOpenChange(false)
    }, 1000)
  }

  const downloadDashboardReport = (period: string) => {
    try {
      const now = new Date()
      const { kpis, revenueData, customerSegmentation, topProducts, categoryData, inventory } = dashboardData

      // Generate PDF content as HTML
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Dashboard Analytics Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
    .kpis { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin-bottom: 30px; }
    .kpi { flex: 1; min-width: 200px; padding: 20px; border: 2px solid #007bff; border-radius: 8px; text-align: center; background: #f8f9fa; }
    .kpi h4 { margin: 0 0 10px 0; color: #007bff; font-size: 14px; }
    .kpi p { margin: 0; font-size: 24px; font-weight: bold; color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
    th { background-color: #007bff; color: white; font-weight: bold; }
    tr:nth-child(even) { background-color: #f8f9fa; }
    .section { margin: 30px 0; }
    .section h3 { color: #007bff; margin-bottom: 15px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="color: #007bff; margin: 0;">Dashboard Analytics Report</h1>
    <h3 style="margin: 10px 0; color: #666;">Period: ${period.charAt(0).toUpperCase() + period.slice(1)} Report</h3>
    <p style="margin: 0; color: #888;">Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}</p>
  </div>
  
  <div class="kpis">
    <div class="kpi">
      <h4>Total Revenue</h4>
      <p>${kpis.totalRevenue.toLocaleString()} ₹</p>
    </div>
    <div class="kpi">
      <h4>Average Order Value</h4>
      <p>${kpis.avgOrderValue.toLocaleString()} ₹</p>
    </div>
    <div class="kpi">
      <h4>Conversion Rate</h4>
      <p>${kpis.conversionRate}%</p>
    </div>
    <div class="kpi">
      <h4>New Customers</h4>
      <p>${kpis.newCustomers.toLocaleString()}</p>
    </div>
  </div>

  <div class="section">
    <h3>Revenue Trend</h3>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Revenue (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${revenueData.map(data => `
          <tr>
            <td>${data.month}</td>
            <td style="font-weight: bold;">${data.revenue.toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h3>Customer Segmentation</h3>
    <table>
      <thead>
        <tr>
          <th>Customer Type</th>
          <th>Count</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>New Customers</td>
          <td>${customerSegmentation.newCustomers}</td>
          <td>${Math.round((customerSegmentation.newCustomers / (customerSegmentation.newCustomers + customerSegmentation.returningCustomers + customerSegmentation.highValueCustomers)) * 100)}%</td>
        </tr>
        <tr>
          <td>Returning Customers</td>
          <td>${customerSegmentation.returningCustomers}</td>
          <td>${Math.round((customerSegmentation.returningCustomers / (customerSegmentation.newCustomers + customerSegmentation.returningCustomers + customerSegmentation.highValueCustomers)) * 100)}%</td>
        </tr>
        <tr>
          <td>High-Value Customers</td>
          <td>${customerSegmentation.highValueCustomers}</td>
          <td>${Math.round((customerSegmentation.highValueCustomers / (customerSegmentation.newCustomers + customerSegmentation.returningCustomers + customerSegmentation.highValueCustomers)) * 100)}%</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <h3>Top Performing Products</h3>
    <table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Sales</th>
          <th>Revenue (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${topProducts.map(product => `
          <tr>
            <td>${product.name}</td>
            <td>${product.sales.toLocaleString()}</td>
            <td style="font-weight: bold;">${product.revenue.toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h3>Category Distribution</h3>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        ${categoryData.map(category => `
          <tr>
            <td>${category.name}</td>
            <td style="font-weight: bold;">${category.value}%</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h3>Inventory Overview</h3>
    <p><strong>Total Inventory Value:</strong> ${inventory.totalValue.toLocaleString()} ₹</p>
    <h4>Low Stock Products:</h4>
    <table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Stock Level</th>
        </tr>
      </thead>
      <tbody>
        ${inventory.lowStockProducts.map(product => `
          <tr>
            <td>${product.name}</td>
            <td style="color: ${product.stock < 20 ? '#dc2626' : '#ea580c'}; font-weight: bold;">${product.stock} units</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`

      // Create new window and generate PDF
      const printWindow = window.open('', '_blank', 'width=1000,height=800')
      if (!printWindow) {
        alert('Please allow popups to download the PDF report')
        return
      }

      printWindow.document.open()
      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
        
        // Close window after printing (optional)
        setTimeout(() => {
          printWindow.close()
        }, 2000)
      }, 500)

      alert(`Dashboard report for ${period} is being generated!`)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download report. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Download Dashboard Report
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="period">Select Time Period</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Report will include:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Key performance indicators (KPIs)</li>
              <li>• Revenue trend analysis</li>
              <li>• Customer segmentation breakdown</li>
              <li>• Top performing products</li>
              <li>• Category distribution</li>
              <li>• Inventory overview and alerts</li>
            </ul>
          </div>
          
          <Button 
            onClick={() => generateReport(selectedPeriod)} 
            className="w-full"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')
      const result = await response.json()
      
      if (result.success) {
        setDashboardData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading || !dashboardData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard data...</div>
        </div>
      </div>
    )
  }

  const { kpis, revenueData, customerSegmentation, topProducts, categoryData, inventory } = dashboardData
  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Export Dialog */}
      <DashboardExportDialog 
        dashboardData={dashboardData} 
        open={exportDialogOpen} 
        onOpenChange={setExportDialogOpen} 
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setExportDialogOpen(true)}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{kpis.totalRevenue.toLocaleString()} ₹</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto text-blue-600 mt-3">
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-3xl font-bold text-gray-900">{kpis.avgOrderValue.toLocaleString()} ₹</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto text-blue-600 mt-3">
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{kpis.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto text-blue-600 mt-3">
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Customers</p>
                <p className="text-3xl font-bold text-gray-900">{kpis.newCustomers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto text-blue-600 mt-3">
              View Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) => `${value / 1000}k ₹`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString()} ₹`, "Revenue"]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Button variant="link" className="p-0 h-auto text-blue-600 mt-4">
              View Full Report
            </Button>
          </CardContent>
        </Card>

        {/* Customer Segmentation */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
            <CardDescription>Insight into customer base distribution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">New Customers</span>
                </div>
                <span className="text-sm font-medium">{customerSegmentation.newCustomers} ({Math.round((customerSegmentation.newCustomers / (customerSegmentation.newCustomers + customerSegmentation.returningCustomers + customerSegmentation.highValueCustomers)) * 100)}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Returning Customers</span>
                </div>
                <span className="text-sm font-medium">{customerSegmentation.returningCustomers} ({Math.round((customerSegmentation.returningCustomers / (customerSegmentation.newCustomers + customerSegmentation.returningCustomers + customerSegmentation.highValueCustomers)) * 100)}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">High-Value Customers</span>
                </div>
                <span className="text-sm font-medium">{customerSegmentation.highValueCustomers} ({Math.round((customerSegmentation.highValueCustomers / (customerSegmentation.newCustomers + customerSegmentation.returningCustomers + customerSegmentation.highValueCustomers)) * 100)}%)</span>
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto text-blue-600 w-full justify-start">
              View Customer Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Best Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Best-Selling Products</CardTitle>
            <CardDescription>Top products by sales volume.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider pb-2 border-b">
                <span>Product</span>
                <span className="text-center">Sales</span>
                <span className="text-right">Revenue</span>
              </div>
              {topProducts.map((product, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-900">{product.sales.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.revenue.toLocaleString()} ₹</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="p-0 h-auto text-blue-600 mt-4 w-full justify-start">
              View All Products
            </Button>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Sales distribution by product category.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-gray-600">{category.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{category.value}%</span>
                </div>
              ))}
            </div>
            <Button variant="link" className="p-0 h-auto text-blue-600 w-full justify-start mt-4">
              Analyze Categories
            </Button>
          </CardContent>
        </Card>

        {/* Inventory Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
            <CardDescription>Key insights into your stock levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Inventory Value:</span>
                  <span className="text-lg font-bold text-gray-900">{inventory.totalValue.toLocaleString()} ₹</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low Stock Alerts ({inventory.lowStockProducts.length})</span>
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                </div>

                <div className="space-y-2 text-sm">
                  {inventory.lowStockProducts.map((product, index) => (
                    <div key={index} className={`flex justify-between items-center p-2 rounded-lg ${
                      product.stock < 20 ? 'bg-red-50' : 'bg-orange-50'
                    }`}>
                      <span className="text-gray-700">{product.name}</span>
                      <span className={`font-medium ${
                        product.stock < 20 ? 'text-red-600' : 'text-orange-600'
                      }`}>{product.stock} in stock</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto text-blue-600 mt-4 w-full justify-start">
              View Full Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
