"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"



const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "shipped":
      return <Truck className="w-4 h-4 text-blue-600" />
    case "processing":
      return <Clock className="w-4 h-4 text-orange-600" />
    case "cancelled":
      return <XCircle className="w-4 h-4 text-red-600" />
    default:
      return <Package className="w-4 h-4 text-muted-foreground" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-orange-100 text-orange-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (user?.email) {
      fetchOrders()
    }
  }, [user?.email])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders?email=${user?.email}`)
      const data = await response.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId: string, totalAmount: number) => {
    const confirmMessage = `Are you sure you want to cancel this order?\n\n` +
      `• The amount (₹${totalAmount}) will be refunded\n` +
      `• Any discount coupons used will remain consumed and cannot be reused\n\n` +
      `Do you want to proceed with cancellation?`
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          orderId,
          email: user?.email,
          refundAmount: totalAmount
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('Order cancelled successfully!\n\n• Amount refunded to your wallet\n• Any discount coupons used remain consumed')
        fetchOrders()
        window.dispatchEvent(new Event('notificationUpdate'))
        window.dispatchEvent(new Event('walletUpdate'))
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
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some((item: any) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    return matchesSearch && order.status?.toLowerCase() === activeTab
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Order History</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="text-xs">
              Orders
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs">
              Delivered
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs">
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {loading ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Card key={order.orderId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">Order ID:</span>
                          <span className="text-sm font-mono font-medium text-blue-600">{order.orderId}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Order Date: {order.date}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {order.items?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">
                            {item.name} x{item.quantity}
                          </span>
                          <span className="text-muted-foreground">{item.price} ₹</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-muted-foreground">Payment: Wallet</div>
                      <div className="font-semibold">Total: {order.totalAmount} ₹</div>
                    </div>

                    {/* Cancel Order Button */}
                    {(order.status === 'confirmed' || order.status === 'processing') && (
                      <div className="pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => cancelOrder(order.orderId, order.totalAmount)}
                          className="w-full"
                        >
                          Cancel Order
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No orders match your search." : "You haven't placed any orders yet."}
                </p>
                <Link href="/">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
