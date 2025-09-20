"use client"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Type definitions
interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  image?: string
}

interface TimelineStep {
  status: string
  completed: boolean
  date: string
  time: string
  description: string
}

interface OrderData {
  id: string
  date: string
  estimatedDelivery: string
  status: string
  trackingNumber: string
  carrier: string
  total: number
  items: OrderItem[]
  shippingAddress: {
    name: string
    address: string
    phone: string
  }
  timeline: TimelineStep[]
}

// Empty order data - will be fetched from API
const orderData: OrderData = {
  id: "",
  date: "",
  estimatedDelivery: "",
  status: "",
  trackingNumber: "",
  carrier: "",
  total: 0,
  items: [],
  shippingAddress: {
    name: "",
    address: "",
    phone: "",
  },
  timeline: [],
}

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const copyTrackingNumber = () => {
    if (orderData.trackingNumber) {
      navigator.clipboard.writeText(orderData.trackingNumber)
    }
  }

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }

    switch (status.toLowerCase()) {
      case "order placed":
        return <Package className="w-5 h-5 text-secondary" />
      case "order shipped":
      case "in transit":
        return <Truck className="w-5 h-5 text-secondary" />
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-muted-foreground" />
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Order Tracking</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Info */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {orderData.id ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-semibold font-mono text-blue-600">{params.id}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    <Truck className="w-3 h-3 mr-1" />
                    {orderData.status || 'Processing'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-semibold text-foreground">{orderData.estimatedDelivery || 'N/A'}</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Order not found</p>
              </div>
            )}

            <Link href="/order-details">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View Order Details
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tracking Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tracking Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderData.timeline.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${step.completed ? "bg-green-100" : "bg-muted"}`}>
                    {getStatusIcon(step.status, step.completed)}
                  </div>
                  {index < orderData.timeline.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 ${step.completed ? "bg-green-200" : "bg-muted"}`} />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.status}
                    </h3>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{step.date}</p>
                      <p className="text-xs text-muted-foreground">{step.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Shipping Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shipping Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Carrier</span>
                <span className="font-medium">{orderData.carrier}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tracking Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{orderData.trackingNumber}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyTrackingNumber}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Delivery Address</span>
              </div>
              <div className="ml-6 space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{orderData.shippingAddress.name}</p>
                <p>{orderData.shippingAddress.address}</p>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{orderData.shippingAddress.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg bg-muted"
                />
                <div className="flex-1 space-y-1">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                    <span className="font-medium text-sm">${item.price}</span>
                  </div>
                </div>
              </div>
            ))}

            <Separator />

            <div className="flex items-center justify-between font-semibold">
              <span>Total Amount</span>
              <span>${orderData.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full bg-transparent">
            Contact Customer Support
          </Button>

          <Button variant="outline" className="w-full bg-transparent">
            Share Tracking Info
          </Button>
        </div>
      </div>
    </div>
  )
}
