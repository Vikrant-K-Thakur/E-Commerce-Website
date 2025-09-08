"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ShoppingCart,
  Package,
  RefreshCw,
  CheckCircle,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
} from "lucide-react"

const orderData = [
  {
    id: "#ORD001",
    customer: "Alice Smith",
    orderDate: "2024-07-20",
    total: 890.0,
    status: "Delivered",
    trackingId: "TRK780123",
  },
  {
    id: "#ORD002",
    customer: "Bob Johnson",
    orderDate: "2024-07-18",
    total: 270.5,
    status: "Shipped",
    trackingId: "TRK443320",
  },
  {
    id: "#ORD003",
    customer: "Charlie Brown",
    orderDate: "2024-07-15",
    total: 156.25,
    status: "Pending",
    trackingId: null,
  },
  {
    id: "#ORD004",
    customer: "Diana Miller",
    orderDate: "2024-07-17",
    total: 520.0,
    status: "Processing",
    trackingId: null,
  },
  {
    id: "#ORD005",
    customer: "Eve Davis",
    orderDate: "2024-07-16",
    total: 85.0,
    status: "Refunded",
    trackingId: null,
  },
  {
    id: "#ORD006",
    customer: "Frank White",
    orderDate: "2024-07-15",
    total: 199.99,
    status: "Delivered",
    trackingId: "TRK320987",
  },
  {
    id: "#ORD007",
    customer: "Grace Black",
    orderDate: "2024-07-14",
    total: 92.75,
    status: "Cancelled",
    trackingId: null,
  },
  {
    id: "#ORD008",
    customer: "Henry Green",
    orderDate: "2024-07-13",
    total: 450.0,
    status: "Processing",
    trackingId: null,
  },
]

const trackingData = [
  { id: "TRK780123", status: "Delivered on 2024-07-21", order: "#ORD001" },
  { id: "TRK443320", status: "In transit - Expected 2024-07-22", order: "#ORD002" },
  { id: "TRK320987", status: "Delivered on 2024-07-19", order: "#ORD006" },
]

const refundData = [
  { orderId: "#ORD005", customer: "Eve Davis", status: "Completed", amount: 85.0 },
  { orderId: "#ORD018", customer: "John Doe", status: "Pending", amount: 125.5 },
  { orderId: "#ORD007", customer: "Grace Black", status: "Completed", amount: 92.75 },
]

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [invoiceOrderId, setInvoiceOrderId] = useState("")
  const itemsPerPage = 8

  const filteredOrders = orderData.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Delivered: { variant: "default", className: "bg-green-100 text-green-800" },
      Shipped: { variant: "default", className: "bg-blue-100 text-blue-800" },
      Pending: { variant: "secondary", className: "bg-orange-100 text-orange-800" },
      Processing: { variant: "secondary", className: "bg-yellow-100 text-yellow-800" },
      Cancelled: { variant: "destructive", className: "bg-red-100 text-red-800" },
      Refunded: { variant: "secondary", className: "bg-purple-100 text-purple-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Pending"]
    return (
      <Badge variant={config.variant as any} className={config.className}>
        {status}
      </Badge>
    )
  }

  const generateInvoice = () => {
    if (invoiceOrderId) {
      console.log(`Generating invoice for ${invoiceOrderId}`)
      // TODO: Implement invoice generation
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Track orders, manage deliveries, and handle refunds efficiently.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Order
        </Button>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">1,245</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+15% since last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Shipments</p>
                <p className="text-3xl font-bold text-gray-900">78</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">-5% since last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Refund Requests</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">+3% since last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Deliveries</p>
                <p className="text-3xl font-bold text-gray-900">987</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+10% yesterday</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage and track all customer orders.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ORDER ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">CUSTOMER</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ORDER DATE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">TOTAL</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STATUS</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{order.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">{order.customer}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{order.orderDate}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
                            <DropdownMenuItem>Track Package</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Delivery Tracking
            </CardTitle>
            <CardDescription>View All</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackingData.map((tracking, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{tracking.id}</p>
                    <p className="text-sm text-gray-600">{tracking.status}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Refund & Returns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Refund & Returns
            </CardTitle>
            <CardDescription>Manage All</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {refundData.map((refund, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{refund.orderId}</p>
                    <p className="text-sm text-gray-600">
                      {refund.customer} - ${refund.amount}
                    </p>
                  </div>
                  <Badge
                    variant={refund.status === "Completed" ? "default" : "secondary"}
                    className={
                      refund.status === "Completed" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                    }
                  >
                    {refund.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Invoice Generation
            </CardTitle>
            <CardDescription>View History</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Enter Order ID</label>
                <Input
                  placeholder="e.g., #ORD001"
                  value={invoiceOrderId}
                  onChange={(e) => setInvoiceOrderId(e.target.value)}
                />
              </div>
              <Button
                onClick={generateInvoice}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!invoiceOrderId}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate
              </Button>
              <p className="text-xs text-gray-500">Quickly generate invoices for specific orders.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
