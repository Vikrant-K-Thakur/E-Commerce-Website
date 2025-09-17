"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { BarChart3, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Download, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface AnalyticsData {
  keyMetrics: {
    totalRevenue: number
    totalOrders: number
    activeCustomers: number
    conversionRate: number
  }
  salesData: Array<{ month: string; revenue: number; orders: number; customers: number }>
  customerSegmentData: Array<{ name: string; value: number; color: string }>
  productPerformanceData: Array<{ category: string; sales: number; units: number; growth: number }>
  conversionFunnelData: Array<{ stage: string; count: number; percentage: number }>
  topProductsData: Array<{ name: string; revenue: number; units: number; rating: string }>
}

// Analytics Export Dialog Component
const AnalyticsExportDialog = ({ analyticsData, open, onOpenChange }: { analyticsData: AnalyticsData, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateReport = (period: string) => {
    setIsGenerating(true)
    setTimeout(() => {
      downloadAnalyticsReport(period)
      setIsGenerating(false)
      onOpenChange(false)
    }, 1000)
  }

  const downloadAnalyticsReport = (period: string) => {
    try {
      const now = new Date()
      const { keyMetrics, salesData, customerSegmentData, productPerformanceData, conversionFunnelData, topProductsData } = analyticsData

      // Generate PDF content as HTML
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Analytics Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
    .metrics { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin-bottom: 30px; }
    .metric { flex: 1; min-width: 200px; padding: 20px; border: 2px solid #007bff; border-radius: 8px; text-align: center; background: #f8f9fa; }
    .metric h4 { margin: 0 0 10px 0; color: #007bff; font-size: 14px; }
    .metric p { margin: 0; font-size: 24px; font-weight: bold; color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
    th { background-color: #007bff; color: white; font-weight: bold; }
    tr:nth-child(even) { background-color: #f8f9fa; }
    .section { margin: 30px 0; }
    .section h3 { color: #007bff; margin-bottom: 15px; }
    .chart-container { display: flex; gap: 30px; margin: 20px 0; }
    .chart { flex: 1; min-width: 300px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="color: #007bff; margin: 0;">Analytics Report</h1>
    <h3 style="margin: 10px 0; color: #666;">Period: ${period.charAt(0).toUpperCase() + period.slice(1)} Report</h3>
    <p style="margin: 0; color: #888;">Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}</p>
  </div>
  
  <div class="metrics">
    <div class="metric">
      <h4>Total Revenue</h4>
      <p>${keyMetrics.totalRevenue.toLocaleString()} ₹</p>
    </div>
    <div class="metric">
      <h4>Total Orders</h4>
      <p>${keyMetrics.totalOrders.toLocaleString()}</p>
    </div>
    <div class="metric">
      <h4>Active Customers</h4>
      <p>${keyMetrics.activeCustomers.toLocaleString()}</p>
    </div>
    <div class="metric">
      <h4>Conversion Rate</h4>
      <p>${keyMetrics.conversionRate}%</p>
    </div>
  </div>

  <div class="section">
    <h3>Sales Trend</h3>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Revenue (₹)</th>
          <th>Orders</th>
          <th>Customers</th>
        </tr>
      </thead>
      <tbody>
        ${salesData.map(data => `
          <tr>
            <td>${data.month}</td>
            <td style="font-weight: bold;">${data.revenue.toLocaleString()}</td>
            <td>${data.orders.toLocaleString()}</td>
            <td>${data.customers.toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="chart-container">
    <div class="chart">
      <h3>Customer Segments</h3>
      <table>
        <thead>
          <tr>
            <th>Segment</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${customerSegmentData.map(segment => `
            <tr>
              <td>${segment.name}</td>
              <td style="font-weight: bold;">${segment.value}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="chart">
      <h3>Product Performance</h3>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Sales (₹)</th>
            <th>Units</th>
          </tr>
        </thead>
        <tbody>
          ${productPerformanceData.map(product => `
            <tr>
              <td>${product.category}</td>
              <td style="font-weight: bold;">${product.sales.toLocaleString()}</td>
              <td>${product.units.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="section">
    <h3>Conversion Funnel</h3>
    <table>
      <thead>
        <tr>
          <th>Stage</th>
          <th>Count</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        ${conversionFunnelData.map(stage => `
          <tr>
            <td>${stage.stage}</td>
            <td>${stage.count.toLocaleString()}</td>
            <td style="font-weight: bold;">${stage.percentage}%</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h3>Top Performing Products</h3>
    <table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Revenue (₹)</th>
          <th>Units Sold</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        ${topProductsData.map(product => `
          <tr>
            <td>${product.name}</td>
            <td style="font-weight: bold;">${product.revenue.toLocaleString()}</td>
            <td>${product.units.toLocaleString()}</td>
            <td>${product.rating} ★</td>
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

      alert(`Analytics report for ${period} is being generated!`)
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
            Download Analytics Report
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
              <li>• Key metrics and performance indicators</li>
              <li>• Sales trend analysis</li>
              <li>• Customer segmentation data</li>
              <li>• Product performance by category</li>
              <li>• Conversion funnel analysis</li>
              <li>• Top performing products</li>
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

export default function ReportsAnalytics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [reportType, setReportType] = useState("sales")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
      const result = await response.json()
      
      if (result.success) {
        setAnalyticsData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  if (loading || !analyticsData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading analytics data...</div>
        </div>
      </div>
    )
  }

  const { keyMetrics, salesData, customerSegmentData, productPerformanceData, conversionFunnelData, topProductsData } = analyticsData

  return (
    <div className="p-6 space-y-6">
      {/* Analytics Export Dialog */}
      <AnalyticsExportDialog 
        analyticsData={analyticsData} 
        open={exportDialogOpen} 
        onOpenChange={setExportDialogOpen} 
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business intelligence and performance insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => setExportDialogOpen(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{keyMetrics.totalRevenue.toLocaleString()} ₹</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{keyMetrics.totalOrders.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-3xl font-bold text-gray-900">{keyMetrics.activeCustomers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{keyMetrics.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Orders Trend</CardTitle>
            <CardDescription>Monthly performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis
                    yAxisId="revenue"
                    orientation="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) => `${value / 1000}k ₹`}
                  />
                  <YAxis
                    yAxisId="orders"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "revenue" ? `${value.toLocaleString()} ₹` : value,
                      name === "revenue" ? "Revenue" : "Orders",
                    ]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="orders"
                    type="monotone"
                    dataKey="orders"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Customer distribution by activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {customerSegmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Product Category Performance</CardTitle>
            <CardDescription>Sales and growth by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productPerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) => `${value / 1000}k ₹`}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    width={100}
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString()} ₹`, "Sales"]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="sales" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Customer journey analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnelData.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{stage.count.toLocaleString()}</span>
                      <Badge variant="secondary" className="text-xs">
                        {stage.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Best sellers by revenue and units sold</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PRODUCT NAME</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">REVENUE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">UNITS SOLD</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">AVG. RATING</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PERFORMANCE</th>
                </tr>
              </thead>
              <tbody>
                {topProductsData.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{product.revenue.toLocaleString()} ₹</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{product.units.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-900">{product.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">Excellent</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
