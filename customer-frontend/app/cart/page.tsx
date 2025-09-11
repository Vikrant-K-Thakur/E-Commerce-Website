"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, Trash2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, totalPrice, totalItems } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save10") {
      setAppliedCoupon("SAVE10")
      setCouponCode("")
    }
  }

  const discount = appliedCoupon ? totalPrice * 0.1 : 0
  const shipping = totalPrice > 50 ? 0 : 8.99
  const total = totalPrice - discount + shipping

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
          <h1 className="text-lg font-semibold">Your Cart</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Cart Items ({totalItems})</h2>
            </div>

            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-muted"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm line-clamp-2 text-balance">{item.name}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold">₹{item.price}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Link href="/">
              <Button className="mt-4">Continue Shopping</Button>
            </Link>
          </div>
        )}

        {/* Coupon Section */}
        {cartItems.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-secondary" />
                <span className="font-medium">Apply Coupon</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {appliedCoupon}
                    </Badge>
                    <span className="text-sm text-green-700">10% discount applied</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setAppliedCoupon(null)} className="text-green-700">
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={applyCoupon} variant="outline">
                    Apply
                  </Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground">Try "SAVE10" for 10% off your order</p>
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Order Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-base">
                  <span>Estimated Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" id="wallet" className="rounded" />
                  <label htmlFor="wallet">Use Wallet & Coins</label>
                </div>
                <p className="text-xs text-muted-foreground">Current balance: ₹8,854. Available for this order.</p>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Proceed to Checkout
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}