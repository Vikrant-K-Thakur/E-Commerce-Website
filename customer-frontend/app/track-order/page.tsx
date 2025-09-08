"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function TrackOrderPage() {
  const [trackingInput, setTrackingInput] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleTrackOrder = () => {
    if (!trackingInput.trim()) return

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)
      // Redirect to order tracking page
      window.location.href = `/orders/ORD789012345`
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Track Your Order</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Track Order Form */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <Package className="w-12 h-12 text-secondary mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Track Your Order</h2>
              <p className="text-muted-foreground text-pretty">
                Enter your order ID or tracking number to get real-time updates
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Order ID or Tracking Number</label>
                <Input
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="e.g., ORD789012345 or TRK123456789"
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleTrackOrder}
                disabled={!trackingInput.trim() || isSearching}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Track Order
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Need Help?</h3>

            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <p className="font-medium">Where to find your Order ID?</p>
                <p className="text-muted-foreground">
                  Check your email confirmation or go to "My Orders" in your profile
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-medium">Where to find your Tracking Number?</p>
                <p className="text-muted-foreground">You'll receive it via email once your order ships</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/orders" className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View My Orders
                </Button>
              </Link>

              <Link href="/support" className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Recent Orders</h3>

            <div className="space-y-3">
              <Link href="/orders/ORD789012345">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Order #ORD789012345</p>
                    <p className="text-xs text-muted-foreground">Shipped • 2 items</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Track
                  </Button>
                </div>
              </Link>

              <Link href="/orders/ORD789012344">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Order #ORD789012344</p>
                    <p className="text-xs text-muted-foreground">Delivered • 1 item</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
