"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingCart, Users, TrendingUp, TrendingDown, AlertTriangle, DollarSign } from "lucide-react"
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

const revenueData = [
  { month: "Jan", revenue: 65000 },
  { month: "Feb", revenue: 72000 },
  { month: "Mar", revenue: 68000 },
  { month: "Apr", revenue: 85000 },
  { month: "May", revenue: 92000 },
  { month: "Jun", revenue: 98000 },
  { month: "Jul", revenue: 105000 },
]

const categoryData = [
  { name: "Electronics", value: 45, color: "#3B82F6" },
  { name: "Clothing", value: 25, color: "#EF4444" },
  { name: "Home & Garden", value: 15, color: "#F59E0B" },
  { name: "Books", value: 10, color: "#10B981" },
  { name: "Sports", value: 5, color: "#8B5CF6" },
]

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">Export Report</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">1,245,678 coins</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+12.5% vs Last Month</span>
                </div>
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
                <p className="text-3xl font-bold text-gray-900">125.50 coins</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+2.3% vs Last Month</span>
                </div>
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
                <p className="text-3xl font-bold text-gray-900">4.7%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">-0.8% vs Last Month</span>
                </div>
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
                <p className="text-3xl font-bold text-gray-900">1,200</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+8.7% vs Last Month</span>
                </div>
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
                    tickFormatter={(value) => `${value / 1000}k coins`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString()} coins`, "Revenue"]}
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
                <span className="text-sm font-medium">1200 (22%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Returning Customers</span>
                </div>
                <span className="text-sm font-medium">3500 (64%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">High-Value Customers</span>
                </div>
                <span className="text-sm font-medium">800 (15%)</span>
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
              {[
                { name: "Wireless Headphones", sales: 1200, revenue: 180000 },
                { name: "Smart Watch X2", sales: 950, revenue: 142500 },
                { name: "Ergonomic Office Chair", sales: 700, revenue: 105000 },
                { name: "Portable Power Bank", sales: 600, revenue: 30000 },
                { name: "LED Desk Lamp", sales: 480, revenue: 19200 },
              ].map((product, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-900">{product.sales.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${product.revenue.toLocaleString()}</p>
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
                  <span className="text-lg font-bold text-gray-900">540,000 coins</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low Stock Alerts (3)</span>
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                    <span className="text-gray-700">Smart Watch X2</span>
                    <span className="text-orange-600 font-medium">18 in stock</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                    <span className="text-gray-700">LED Desk Lamp</span>
                    <span className="text-orange-600 font-medium">32 in stock</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                    <span className="text-gray-700">Bluetooth Speaker</span>
                    <span className="text-red-600 font-medium">10 in stock</span>
                  </div>
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
