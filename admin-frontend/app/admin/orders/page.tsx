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
  BarChart3,
} from "lucide-react"

interface Order {
  id: string
  customer: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCoinBalance: number
  customerJoinDate: string
  orderDate: string
  orderTime: string
  total: number
  subtotal: number
  discountAmount: number
  paymentMethod: string
  status: string
  trackingId: string | null
  items: any[]
  address: string
  deliveryAddress: any
  pickupPoint: any
}

// Analytics Dialog Component
const AnalyticsDialog = ({ orders, open, onOpenChange }: { orders: Order[], open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateReport = (period: string) => {
    setIsGenerating(true)
    setTimeout(() => {
      downloadReceipt(period)
      setIsGenerating(false)
      onOpenChange(false)
    }, 1000)
  }

  const downloadReceipt = (period: string) => {
    try {
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

      if (filteredOrders.length === 0) {
        alert(`No orders found for the selected period (${period})`)
        return
      }

      // Calculate analytics data
      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
      const avgOrderValue = totalRevenue / filteredOrders.length
      const statusCounts = filteredOrders.reduce((acc, order) => {
        // Normalize status to handle case variations
        const normalizedStatus = order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()
        acc[normalizedStatus] = (acc[normalizedStatus] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Payment method distribution
      const paymentMethodCounts = filteredOrders.reduce((acc, order) => {
        const normalizedMethod = order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1).toLowerCase()
        acc[normalizedMethod] = (acc[normalizedMethod] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Generate PDF content as HTML
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Orders Analytics Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
    .analytics { margin-bottom: 30px; }
    .metrics { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
    .metric { flex: 1; min-width: 200px; padding: 20px; border: 2px solid #007bff; border-radius: 8px; text-align: center; background: #f8f9fa; }
    .metric h4 { margin: 0 0 10px 0; color: #007bff; font-size: 14px; }
    .metric p { margin: 0; font-size: 24px; font-weight: bold; color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
    th { background-color: #007bff; color: white; font-weight: bold; }
    tr:nth-child(even) { background-color: #f8f9fa; }
    .status-delivered { color: #28a745; font-weight: bold; }
    .status-cancelled { color: #dc3545; font-weight: bold; }
    .status-pending { color: #fd7e14; font-weight: bold; }
    .status-shipped { color: #17a2b8; font-weight: bold; }
    .status-processing { color: #ffc107; font-weight: bold; }
    .chart-container { display: flex; gap: 30px; margin: 20px 0; }
    .chart { flex: 1; min-width: 300px; }
    .chart-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #007bff; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="color: #007bff; margin: 0;">Orders Analytics Report</h1>
    <h3 style="margin: 10px 0; color: #666;">Period: ${period.charAt(0).toUpperCase() + period.slice(1)} Report</h3>
    <p style="margin: 0; color: #888;">Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}</p>
  </div>
  
  <div class="analytics">
    <h2 style="color: #007bff; margin-bottom: 20px;">Analytics Summary</h2>
    <div class="metrics">
      <div class="metric">
        <h4>Total Orders</h4>
        <p>${filteredOrders.length}</p>
      </div>
      <div class="metric">
        <h4>Total Revenue</h4>
        <p>${totalRevenue.toFixed(2)} ₹</p>
      </div>
      <div class="metric">
        <h4>Average Order Value</h4>
        <p>${avgOrderValue.toFixed(2)} ₹</p>
      </div>
      <div class="metric">
        <h4>Delivered Orders</h4>
        <p>${statusCounts['Delivered'] || statusCounts['delivered'] || 0}</p>
      </div>
      <div class="metric">
        <h4>Cancelled Orders</h4>
        <p>${statusCounts['Cancelled'] || statusCounts['cancelled'] || 0}</p>
      </div>
      <div class="metric">
        <h4>Pending Orders</h4>
        <p>${statusCounts['Pending'] || statusCounts['pending'] || 0}</p>
      </div>
      <div class="metric">
        <h4>Shipped Orders</h4>
        <p>${statusCounts['Shipped'] || statusCounts['shipped'] || 0}</p>
      </div>
    </div>

    <div class="chart-container">
      <div class="chart">
        <div class="chart-title">Order Status Distribution</div>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(statusCounts).map(([status, count]) => `
              <tr>
                <td class="status-${status.toLowerCase()}">${status}</td>
                <td>${count}</td>
                <td>${((count / filteredOrders.length) * 100).toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="chart">
        <div class="chart-title">Payment Methods</div>
        <table>
          <thead>
            <tr>
              <th>Payment Method</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(paymentMethodCounts).map(([method, count]) => `
              <tr>
                <td>${method}</td>
                <td>${count}</td>
                <td>${((count / filteredOrders.length) * 100).toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  <h2 style="color: #007bff; margin: 30px 0 15px 0;">Order Details</h2>
  <table>
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Customer</th>
        <th>Email</th>
        <th>Date</th>
        <th>Time</th>
        <th>Total (₹)</th>
        <th>Status</th>
        <th>Payment Method</th>
      </tr>
    </thead>
    <tbody>
      ${filteredOrders.map(order => `
        <tr>
          <td style="font-weight: bold; color: #007bff;">${order.id}</td>
          <td>${order.customer}</td>
          <td>${order.customerEmail}</td>
          <td>${order.orderDate}</td>
          <td>${order.orderTime}</td>
          <td style="font-weight: bold;">${order.total.toFixed(2)}</td>
          <td class="status-${order.status.toLowerCase()}">${order.status}</td>
          <td style="text-transform: capitalize;">${order.paymentMethod}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
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

      alert(`Analytics report for ${period} is being generated! (${filteredOrders.length} orders)`)
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
              <li>• Order statistics and revenue metrics</li>
              <li>• Status distribution analysis</li>
              <li>• Payment method breakdown</li>
              <li>• Complete order listing with details</li>
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
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false)
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

  const cancelOrderAdmin = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order? The amount will be refunded to the customer.')) {
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancelOrder',
          orderId
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('Order cancelled successfully! Amount refunded to customer.')
        fetchOrders()
      } else {
        alert('Failed to cancel order: ' + result.error)
      }
    } catch (error) {
      console.error('Failed to cancel order:', error)
      alert('Failed to cancel order. Please try again.')
    }
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
      {/* Analytics Dialog */}
      <AnalyticsDialog
        orders={orders}
        open={analyticsDialogOpen}
        onOpenChange={setAnalyticsDialogOpen}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Track orders, manage deliveries, and handle refunds efficiently.</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setAnalyticsDialogOpen(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Reports
          </Button>
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
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
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
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PHONE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ORDER DATE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">TOTAL</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STATUS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <span className="font-medium text-blue-600">{order.id}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <span className="text-gray-900 font-medium">{order.customer}</span>
                            {order.customerCoinBalance > 0 && (
                              <div className="text-xs text-green-600">
                                Balance: {order.customerCoinBalance.toFixed(2)} ₹
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600">{order.customerEmail}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600">{order.customerPhone || 'N/A'}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <span className="text-gray-600">{order.orderDate}</span>
                            <div className="text-xs text-gray-500">{order.orderTime}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <span className="font-medium text-gray-900">{order.total.toFixed(2)} ₹</span>
                            {order.discountAmount > 0 && (
                              <div className="text-xs text-red-600">
                                Discount: -{order.discountAmount.toFixed(2)}
                              </div>
                            )}
                          </div>
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
                                  <div className="space-y-6">
                                    {/* Customer Details Section */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3 text-blue-600">Customer Details</h3>
                                      <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Name</Label>
                                          <p className="font-medium text-gray-900">{selectedOrder.customer}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Email</Label>
                                          <p className="text-gray-900">{selectedOrder.customerEmail}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Phone</Label>
                                          <p className="text-gray-900">{selectedOrder.customerPhone || 'Not provided'}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Wallet Balance</Label>
                                          <p className="font-medium text-green-600">{selectedOrder.customerCoinBalance.toFixed(2)} ₹</p>
                                        </div>
                                        <div className="col-span-2">
                                          <Label className="text-sm font-medium text-gray-600">Profile Address</Label>
                                          <p className="text-gray-900">{selectedOrder.customerAddress || 'No address provided'}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Customer Since</Label>
                                          <p className="text-gray-900">{selectedOrder.customerJoinDate || 'Unknown'}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Delivery Address Section */}
                                    {selectedOrder.deliveryAddress && (
                                      <div>
                                        <h3 className="text-lg font-semibold mb-3 text-orange-600">Delivery Address</h3>
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50 rounded-lg">
                                          <div>
                                            <Label className="text-sm font-medium text-gray-600">Name</Label>
                                            <p className="font-medium text-gray-900">{selectedOrder.deliveryAddress.name}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium text-gray-600">Phone</Label>
                                            <p className="text-gray-900">{selectedOrder.deliveryAddress.phone}</p>
                                          </div>
                                          <div className="col-span-2">
                                            <Label className="text-sm font-medium text-gray-600">Address</Label>
                                            <p className="text-gray-900">{selectedOrder.deliveryAddress.address}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium text-gray-600">City</Label>
                                            <p className="text-gray-900">{selectedOrder.deliveryAddress.city}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium text-gray-600">Pincode</Label>
                                            <p className="text-gray-900">{selectedOrder.deliveryAddress.pincode}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium text-gray-600">Address Type</Label>
                                            <p className="text-gray-900 capitalize">{selectedOrder.deliveryAddress.type || 'home'}</p>
                                          </div>
                                          {selectedOrder.deliveryAddress.isDefault && (
                                            <div>
                                              <Label className="text-sm font-medium text-gray-600">Default Address</Label>
                                              <p className="text-green-600 font-medium">Yes</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Pickup Point Section */}
                                    {selectedOrder.pickupPoint && (
                                      <div>
                                        <h3 className="text-lg font-semibold mb-3 text-purple-600">Pickup Point</h3>
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg">
                                          <div className="col-span-2">
                                            <Label className="text-sm font-medium text-gray-600">Pickup Location</Label>
                                            <p className="font-medium text-gray-900">{selectedOrder.pickupPoint.name}</p>
                                          </div>
                                          <div className="col-span-2">
                                            <Label className="text-sm font-medium text-gray-600">Address</Label>
                                            <p className="text-gray-900">{selectedOrder.pickupPoint.address}</p>
                                          </div>
                                          {selectedOrder.pickupPoint.contactPhone && (
                                            <div>
                                              <Label className="text-sm font-medium text-gray-600">Contact</Label>
                                              <p className="text-gray-900">{selectedOrder.pickupPoint.contactPhone}</p>
                                            </div>
                                          )}
                                          {selectedOrder.pickupPoint.timings && (
                                            <div>
                                              <Label className="text-sm font-medium text-gray-600">Timings</Label>
                                              <p className="text-gray-900">{selectedOrder.pickupPoint.timings}</p>
                                            </div>
                                          )}
                                          {selectedOrder.pickupPoint.distance !== undefined && (
                                            <div>
                                              <Label className="text-sm font-medium text-gray-600">Distance from Customer</Label>
                                              <p className="text-gray-900">{selectedOrder.pickupPoint.distance}km</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Order Details Section */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3 text-green-600">Order Details</h3>
                                      <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Order ID</Label>
                                          <p className="font-medium text-gray-900">{selectedOrder.id}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Order Date</Label>
                                          <p className="text-gray-900">{selectedOrder.orderDate}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Order Time</Label>
                                          <p className="text-gray-900">{selectedOrder.orderTime}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Payment Method</Label>
                                          <p className="text-gray-900 capitalize">{selectedOrder.paymentMethod}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Subtotal</Label>
                                          <p className="text-gray-900">{selectedOrder.subtotal.toFixed(2)} ₹</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Discount</Label>
                                          <p className="text-red-600">-{selectedOrder.discountAmount.toFixed(2)} ₹</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Total Amount</Label>
                                          <p className="font-bold text-lg text-gray-900">{selectedOrder.total.toFixed(2)} ₹</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Status</Label>
                                          <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                                        </div>
                                        <div className="col-span-2">
                                          <Label className="text-sm font-medium text-gray-600">Tracking ID</Label>
                                          <p className="text-gray-900">{selectedOrder.trackingId || 'Not assigned'}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Order Items Section */}
                                    {selectedOrder.items && selectedOrder.items.length > 0 && (
                                      <div>
                                        <h3 className="text-lg font-semibold mb-3 text-purple-600">Order Items</h3>
                                        <div className="space-y-2">
                                          {selectedOrder.items.map((item: any, index: number) => (
                                            <div key={index} className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                                              <img
                                                src={item.image || '/placeholder.svg'}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                              />
                                              <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-600">
                                                  {item.productId && `Product ID: ${item.productId} | `}
                                                  {item.size && `Size: ${item.size} | `}
                                                  Qty: {item.quantity} | Price: {item.price} ₹
                                                </p>
                                              </div>
                                              <p className="font-medium text-gray-900">
                                                {(item.price * item.quantity).toFixed(2)} ₹
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
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

                            {(order.status !== 'cancelled' && order.status !== 'delivered') && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => cancelOrderAdmin(order.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Cancel
                              </Button>
                            )}
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
                      {order.customer} - {order.total.toFixed(2)} ₹
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
          <CardContent className="max-h-64 overflow-y-auto">
            <div className="space-y-4">
              {orders.slice(0, 10).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.customer} - {order.total.toFixed(2)} ₹
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
