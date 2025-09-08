"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const orders = [
  {
    id: "ORD789012345",
    date: "2023-11-20",
    items: [
      { name: "Wireless Earbuds", quantity: 1, price: 89.99 },
      { name: "Phone Case", quantity: 1, price: 24.99 },
    ],
    total: 114.98,
    status: "delivered",
    estimatedDelivery: "December 25, 2023",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD789012344",
    date: "2023-11-18",
    items: [{ name: "Laptop Sleeve", quantity: 1, price: 45.99 }],
    total: 45.99,
    status: "shipped",
    estimatedDelivery: "December 22, 2023",
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD789012343",
    date: "2023-11-15",
    items: [{ name: "Premium Headphones", quantity: 1, price: 199.99 }],
    total: 199.99,
    status: "processing",
    estimatedDelivery: "December 28, 2023",
    trackingNumber: null,
  },
  {
    id: "ORD789012342",
    date: "2023-11-10",
    items: [{ name: "Smart Watch", quantity: 1, price: 299.99 }],
    total: 299.99,
    status: "cancelled",
    estimatedDelivery: null,
    trackingNumber: null,
  },
]

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
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    return matchesSearch && order.status === activeTab
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="processing" className="text-xs">
              Processing
            </TabsTrigger>
            <TabsTrigger value="shipped" className="text-xs">
              Shipped
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs">
              Delivered
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs">
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Order ID</span>
                            <span className="text-sm text-muted-foreground">{order.id}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Estimated Delivery: {order.estimatedDelivery || "N/A"}
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
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-foreground">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="text-muted-foreground">${item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm text-muted-foreground">Order Date: {order.date}</div>
                        <div className="font-semibold">Total: ${order.total.toFixed(2)}</div>
                      </div>

                      {order.trackingNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Tracking: {order.trackingNumber}</span>
                          <Button variant="outline" size="sm">
                            Track Order
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
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
