"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, Trash2, Heart, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: "Elegant Ceramic Mixing Bowls - Set of 3",
    price: 49.99,
    originalPrice: 59.99,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80&text=Bowls",
    size: "Large",
    color: "White",
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 Black Wireless Noise-Cancelling Headphones",
    price: 399.99,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80&text=Headphones",
    size: null,
    color: "Black",
  },
]

const savedForLaterItems = [
  {
    id: 3,
    name: "Premium Leather Wallet",
    price: 89.99,
    originalPrice: 119.99,
    image: "/placeholder.svg?height=80&width=80&text=Wallet",
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [savedItems, setSavedItems] = useState(savedForLaterItems)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems((items) => items.filter((item) => item.id !== id))
    } else {
      setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const moveToSaved = (id: number) => {
    const item = cartItems.find((item) => item.id === id)
    if (item) {
      setCartItems((items) => items.filter((item) => item.id !== id))
      setSavedItems((items) => [...items, { ...item, quantity: undefined }])
    }
  }

  const moveToCart = (id: number) => {
    const item = savedItems.find((item) => item.id === id)
    if (item) {
      setSavedItems((items) => items.filter((item) => item.id !== id))
      setCartItems((items) => [...items, { ...item, quantity: 1 }])
    }
  }

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save10") {
      setAppliedCoupon("SAVE10")
      setCouponCode("")
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon ? subtotal * 0.1 : 0
  const shipping = subtotal > 50 ? 0 : 8.99
  const total = subtotal - discount + shipping

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
              <h2 className="text-lg font-semibold">Electronics</h2>
              <Button variant="ghost" size="sm" className="text-secondary">
                View All
              </Button>
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
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${item.price}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
                        )}
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
                          <Button variant="ghost" size="sm" onClick={() => moveToSaved(item.id)} className="text-xs">
                            <Heart className="w-3 h-3 mr-1" />
                            Save for Later
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => updateQuantity(item.id, 0)}
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

        {/* Saved for Later */}
        {savedItems.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Books & Media</h2>
            {savedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-muted"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-medium text-sm line-clamp-2 text-balance">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${item.price}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
                        )}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => moveToCart(item.id)} className="text-xs">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-base">
                  <span>Estimated Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" id="wallet" className="rounded" />
                  <label htmlFor="wallet">Use Wallet & Coins</label>
                </div>
                <p className="text-xs text-muted-foreground">Current balance: $8,854. Available for this order.</p>
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
    </div>
  )
}
