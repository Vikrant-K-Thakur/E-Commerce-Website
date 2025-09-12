"use client"

import { useState } from "react"
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
import { BarChart3, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Download } from "lucide-react"

const salesData = [
  { month: "Jan", revenue: 65000, orders: 450, customers: 320 },
  { month: "Feb", revenue: 72000, orders: 520, customers: 380 },
  { month: "Mar", revenue: 68000, orders: 480, customers: 350 },
  { month: "Apr", revenue: 85000, orders: 620, customers: 420 },
  { month: "May", revenue: 92000, orders: 680, customers: 480 },
  { month: "Jun", revenue: 98000, orders: 720, customers: 520 },
  { month: "Jul", revenue: 105000, orders: 780, customers: 580 },
]

const customerSegmentData = [
  { name: "New Customers", value: 35, color: "#3B82F6" },
  { name: "Returning Customers", value: 45, color: "#10B981" },
  { name: "VIP Customers", value: 20, color: "#8B5CF6" },
]

const productPerformanceData = [
  { category: "Electronics", sales: 45000, units: 1200, growth: 12.5 },
  { category: "Clothing", sales: 38000, units: 2100, growth: 8.3 },
  { category: "Home & Garden", sales: 28000, units: 850, growth: -2.1 },
  { category: "Books", sales: 15000, units: 950, growth: 15.7 },
  { category: "Sports", sales: 22000, units: 680, growth: 5.4 },
]

const conversionFunnelData = [
  { stage: "Visitors", count: 10000, percentage: 100 },
  { stage: "Product Views", count: 6500, percentage: 65 },
  { stage: "Add to Cart", count: 2800, percentage: 28 },
  { stage: "Checkout", count: 1200, percentage: 12 },
  { stage: "Purchase", count: 850, percentage: 8.5 },
]

const topProductsData = [
  { name: "Wireless Headphones", revenue: 25000, units: 450, rating: 4.8 },
  { name: "Smart Watch", revenue: 22000, units: 320, rating: 4.6 },
  { name: "Laptop Stand", revenue: 18000, units: 680, rating: 4.7 },
  { name: "Bluetooth Speaker", revenue: 15000, units: 520, rating: 4.5 },
  { name: "Phone Case", revenue: 12000, units: 890, rating: 4.4 },
]

export default function ReportsAnalytics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [reportType, setReportType] = useState("sales")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business intelligence and performance insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
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
                <p className="text-3xl font-bold text-gray-900">545,000 coins</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+18.2% vs last period</span>
                </div>
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
                <p className="text-3xl font-bold text-gray-900">4,250</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+12.5% vs last period</span>
                </div>
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
                <p className="text-3xl font-bold text-gray-900">3,080</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+8.7% vs last period</span>
                </div>
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
                <p className="text-3xl font-bold text-gray-900">8.5%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">-1.2% vs last period</span>
                </div>
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
                    tickFormatter={(value) => `${value / 1000}k coins`}
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
                      name === "revenue" ? `${value.toLocaleString()} coins` : value,
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

        {/* Customer Segmentation */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
            <CardDescription>Customer base distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {customerSegmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {customerSegmentData.map((segment, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                    <span className="text-gray-600">{segment.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{segment.value}%</span>
                </div>
              ))}
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
                    tickFormatter={(value) => `${value / 1000}k coins`}
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
                    formatter={(value) => [`${value.toLocaleString()} coins`, "Sales"]}
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
                      <span className="font-medium text-gray-900">${product.revenue.toLocaleString()}</span>
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

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Reports</CardTitle>
          <CardDescription>Create detailed reports for specific business needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Report</SelectItem>
                <SelectItem value="customers">Customer Report</SelectItem>
                <SelectItem value="products">Product Report</SelectItem>
                <SelectItem value="inventory">Inventory Report</SelectItem>
                <SelectItem value="marketing">Marketing Report</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
