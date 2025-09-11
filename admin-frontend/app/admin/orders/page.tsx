"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
  Download,
  Loader2,
} from "lucide-react"

interface Order {
  id: string
  customer: string
  customerEmail: string
  orderDate: string
  total: number
  status: string
  trackingId: string | null
  items: any[]
  address: string
}



export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [invoiceOrderId, setInvoiceOrderId] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusUpdateOrder, setStatusUpdateOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [trackingId, setTrackingId] = useState("")
  const itemsPerPage = 8

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      const result = await response.json()
      if (result.success) {
        setOrders(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async () => {
    if (!statusUpdateOrder || !newStatus) return
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStatus',
          orderId: statusUpdateOrder.id,
          status: newStatus,
          trackingId: trackingId || null
        })
      })
      
      if (response.ok) {
        fetchOrders()
        setStatusUpdateOrder(null)
        setNewStatus("")
        setTrackingId("")
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const downloadReceipt = (period: string) => {
    const now = new Date()
    let filteredOrders = orders
    
    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredOrders = orders.filter(order => new Date(order.orderDate) >= weekAgo)
    } else if (period === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      filteredOrders = orders.filter(order => new Date(order.orderDate) >= monthAgo)
    } else if (period === 'year') {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      filteredOrders = orders.filter(order => new Date(order.orderDate) >= yearAgo)
    }
    
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Date', 'Total', 'Status'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.customer,
        order.customerEmail,
        order.orderDate,
        order.total,
        order.status
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${period}-${now.toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredOrders = orders.filter((order) => {
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



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Track orders, manage deliveries, and handle refunds efficiently.</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Download Reports
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => downloadReceipt('week')}>This Week</DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadReceipt('month')}>This Month</DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadReceipt('year')}>This Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
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
                <p className="text-3xl font-bold text-gray-900">{orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length}</p>
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
                <p className="text-3xl font-bold text-gray-900">{orders.filter(o => o.status === 'Refunded').length}</p>
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
                <p className="text-3xl font-bold text-gray-900">{orders.filter(o => o.status === 'Delivered').length}</p>
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading orders...</span>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ORDER ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">CUSTOMER</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">EMAIL</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ORDER DATE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">TOTAL</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STATUS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">{order.id}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{order.customer}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600">{order.customerEmail}</span>
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                                </DialogHeader>
                                {selectedOrder && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Customer</Label>
                                        <p className="font-medium">{selectedOrder.customer}</p>
                                      </div>
                                      <div>
                                        <Label>Email</Label>
                                        <p>{selectedOrder.customerEmail}</p>
                                      </div>
                                      <div>
                                        <Label>Order Date</Label>
                                        <p>{selectedOrder.orderDate}</p>
                                      </div>
                                      <div>
                                        <Label>Total</Label>
                                        <p className="font-medium">${selectedOrder.total.toFixed(2)}</p>
                                      </div>
                                      <div>
                                        <Label>Status</Label>
                                        <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                                      </div>
                                      <div>
                                        <Label>Tracking ID</Label>
                                        <p>{selectedOrder.trackingId || 'Not assigned'}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Address</Label>
                                      <p>{selectedOrder.address || 'No address provided'}</p>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => {
                                    setStatusUpdateOrder(order)
                                    setNewStatus(order.status)
                                    setTrackingId(order.trackingId || '')
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Order Status - {statusUpdateOrder?.id}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Status</Label>
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Processing">Processing</SelectItem>
                                        <SelectItem value="Shipped">Shipped</SelectItem>
                                        <SelectItem value="Delivered">Delivered</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        <SelectItem value="Refunded">Refunded</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Tracking ID (Optional)</Label>
                                    <Input
                                      value={trackingId}
                                      onChange={(e) => setTrackingId(e.target.value)}
                                      placeholder="Enter tracking ID"
                                    />
                                  </div>
                                  <Button onClick={updateOrderStatus} className="w-full">
                                    Update Status
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
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
              Shipped Orders
            </CardTitle>
            <CardDescription>Track Deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.filter(o => o.status === 'Shipped' && o.trackingId).slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.trackingId}</p>
                    <p className="text-sm text-gray-600">{order.customer} - {order.id}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
                </div>
              ))}
              {orders.filter(o => o.status === 'Shipped' && o.trackingId).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No shipped orders with tracking</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Refund & Returns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Refunded Orders
            </CardTitle>
            <CardDescription>Manage Returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.filter(o => o.status === 'Refunded').slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.customer} - ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">Refunded</Badge>
                </div>
              ))}
              {orders.filter(o => o.status === 'Refunded').length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No refunded orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Latest Activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.customer} - ${order.total.toFixed(2)}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
